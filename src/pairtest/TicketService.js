import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import { TICKET_PRICES } from './Constants.js';

/**
 * @class TicketService
 * @description
 * This class provides the functionality to purchase tickets.
 * It validates the purchase rules, it calculates the total payment amounts and integrates with 
 * services like payments and seat reservation.
 * Responsibilities:
 * - Validate the account ID and ensure that ticket purchase requests follow business rules, 
 *   such as a minimum of one adult ticket and a maximum of 25 total tickets.
 * - Calculate the total payment amount based on ticket quantities and their respective prices.
 * - Calculate the number of seats to be reserved (adults and children get seats, infants do not).
 * - Communicate with external services to process payments and reserve seats.
 * Error handling:
 * This service throws `InvalidPurchaseException` for any invalid input or business rule violations.
 **/

export default class TicketService {
  constructor() {
    this.ticketPrices = TICKET_PRICES;
  }

  validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(`Invalid account ID`, { accountId });
    }
  }

  validateTicketQuantities(tickets) {
    const { adult, child, infant } = tickets;
    if (
      !Number.isInteger(adult) || adult < 0 ||
      !Number.isInteger(child) || child < 0 ||
      !Number.isInteger(infant) || infant < 0
    ) {
      throw new InvalidPurchaseException('Invalid ticket quantities', { tickets });
    }
  }

  calculateTotalAmount(totalAdults, totalChildren) {
    return (totalChildren * this.ticketPrices.CHILD) +
           (totalAdults * this.ticketPrices.ADULT);
  }

  purchaseTickets(accountId, tickets) {
    try {
      this.validateAccountId(accountId);
      this.validateTicketQuantities(tickets);

      // Create ticket type requests
      const ticketTypeRequests = [
        new TicketTypeRequest('ADULT', tickets.adult),
        new TicketTypeRequest('CHILD', tickets.child),
        new TicketTypeRequest('INFANT', tickets.infant),
      ];

      let totalInfants = 0, totalChildren = 0, totalAdults = 0;

      // Aggregate the quantities of each ticket type.
      for (const request of ticketTypeRequests) {
        const type = request.getTicketType();
        const quantity = request.getNoOfTickets();
        switch (type) {
          case 'INFANT':
            totalInfants += quantity;
            break;
          case 'CHILD':
            totalChildren += quantity;
            break;
          case 'ADULT':
            totalAdults += quantity;
            break;
          default:
            throw new InvalidPurchaseException('Invalid ticket type', { type });
        }
      }

      const totalTickets = totalInfants + totalChildren + totalAdults;

      // Validate that at least one ticket is purchased
      if (totalTickets === 0) {
        throw new InvalidPurchaseException('At least one ticket must be purchased.');
      }
      
      // Validate the business rules.
      if (totalTickets > 25) {
        throw new InvalidPurchaseException('Cannot purchase more than 25 tickets at a time.', { totalTickets });
      }

      if (totalAdults < 1 && (totalChildren > 0 || totalInfants > 0)) {
        throw new InvalidPurchaseException('Child or Infant tickets cannot be purchased without at least one Adult ticket.', {
          totalAdults,
          totalChildren,
          totalInfants,
        });
      }

      // Calculate the total payment amount
      const totalAmount = this.calculateTotalAmount(totalAdults, totalChildren);
      const seatsToReserve = totalChildren + totalAdults;

      // Create instances of the payment and reservation services.
      const paymentService = new TicketPaymentService();
      const reservationService = new SeatReservationService();

      // Make the payment request
      paymentService.makePayment(accountId, totalAmount);

      // Reserve the seats
      reservationService.reserveSeat(accountId, seatsToReserve);

      return {
        message: 'Tickets purchased successfully',
        totalAmount,
        seatsReserved: seatsToReserve,
      };
    } catch (error) {
      if (error instanceof InvalidPurchaseException) {
        error.errorDetails();
        throw error; // Re-throw the error for further handling
      } else {
        console.error('Unexpected error occurred:', error);
        throw error; // Re-throw any other unexpected errors
      }
    }
  }
}
