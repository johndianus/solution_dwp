import { jest } from '@jest/globals';
import TicketService from '../TicketService.js';
import InvalidPurchaseException from '../lib/InvalidPurchaseException.js';
import TicketPaymentService from '../../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../../thirdparty/seatbooking/SeatReservationService.js';

//Setup Mocks
const setupMocks = () => {
  const mockMakePayment = jest.spyOn(
    TicketPaymentService.prototype,
    'makePayment'
  );

  const mockReserveSeat = jest.spyOn(
    SeatReservationService.prototype,
    'reserveSeat'
  );

  return {
    mockMakePayment,
    mockReserveSeat,
  };
};

describe('TicketService', () => {
  let ticketService;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('purchaseTickets', () => {
    // Invalid account ID
    it('should throw InvalidPurchaseException for invalid account ID', () => {
      const accountId = 0;
      const tickets = { adult: 1, child: 0, infant: 0 };

      expect(() => ticketService.purchaseTickets(accountId, tickets))
        .toThrow(InvalidPurchaseException);
    });

    // More than 25 tickets
    it('should throw InvalidPurchaseException for more than 25 total tickets', () => {
      const accountId = 1;
      const tickets = { adult: 20, child: 6, infant: 0 };

      expect(() => ticketService.purchaseTickets(accountId, tickets))
        .toThrow(InvalidPurchaseException);
    });

    // Ticket for Children without Adult
    it('should throw InvalidPurchaseException for purchasing children without adults', () => {
      const accountId = 1;
      const tickets = { adult: 0, child: 1, infant: 0 };

      expect(() => ticketService.purchaseTickets(accountId, tickets))
        .toThrow(InvalidPurchaseException);
    });

    // Ticket for Children without Infant
    it('should throw InvalidPurchaseException for purchasing infant without adults', () => {
      const accountId = 1;
      const tickets = { adult: 0, child: 0, infant: 1 };

      expect(() => ticketService.purchaseTickets(accountId, tickets))
        .toThrow(InvalidPurchaseException);
    });

    // Invalid negative values
    it('should throw InvalidPurchaseException for invalid ticket types', () => {
      const accountId = 1;
      const tickets = { adult: 1, child: 0, infant: -1 };
  
      expect(() => ticketService.purchaseTickets(accountId, tickets))
        .toThrow(InvalidPurchaseException);
    });
  
    // Account id must be a number
    it('should throw InvalidPurchaseException for account ID as a string', () => {
      const accountId = "abc";
      const tickets = { adult: 1, child: 0, infant: 0 };
  
      expect(() => ticketService.purchaseTickets(accountId, tickets))
        .toThrow(InvalidPurchaseException);
    });

    // Account id must be greater than zero
    it('should throw InvalidPurchaseException for account ID greater than zero', () => {
      const accountId = 0;
      const tickets = { adult: 1, child: 0, infant: 0 };
  
      expect(() => ticketService.purchaseTickets(accountId, tickets))
        .toThrow(InvalidPurchaseException);
    });
  
    // Zero tickets purchased
    it('should throw InvalidPurchaseException for zero tickets purchased', () => {
      const accountId = 1;
      const tickets = { adult: 0, child: 0, infant: 0 };
  
      expect(() => ticketService.purchaseTickets(accountId, tickets))
        .toThrow(InvalidPurchaseException);
    });

    // Successfull Purchase
    it('should successfully purchase tickets and call payment and reservation methods', () => {
      const accountId = 1;
      const tickets = { adult: 2, child: 2, infant: 0 };

      const { mockMakePayment, mockReserveSeat } = setupMocks();
      const response = ticketService.purchaseTickets(accountId, tickets);

      expect(response).toEqual({
        message: 'Tickets purchased successfully',
        totalAmount: 80,
        seatsReserved: 4,
      });

      expect(mockMakePayment).toHaveBeenCalledWith(accountId, 80);
      expect(mockReserveSeat).toHaveBeenCalledWith(accountId, 4);
    });
    
  });
});
