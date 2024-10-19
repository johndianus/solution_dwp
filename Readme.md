# TicketService Application

## Overview
The `TicketService` application manages the process of purchasing tickets for events, ensuring that ticket purchases comply with specific business rules, calculating costs, and interacting with third-party services for payments and seat reservations. It is designed to be reusable and integrates with payment gateways and seat booking services.

## Features
- **Validation**: Ensures that the account ID is valid and that ticket purchase requests adhere to business rules (e.g., at least one adult ticket must be purchased if any child or infant tickets are being bought).
- **Calculation**: Computes the total payment amount based on the number of tickets and their prices.
- **Integration**: Interacts with third-party services for making payments and reserving seats.
- **Extensible**: The ticket prices and rules can be adjusted via configuration files like `Constants.js`.

## Prerequisites
- **Node.js**: Make sure Node.js is installed (version 14 or above is recommended).
- **npm**: The package manager that comes with Node.js.
- **External Libraries**: This project relies on several npm packages like `moment` for date handling and `random` for generating random values (if needed).

## Getting Started

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ticket-service-app.git
   cd ticket-service-app
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Project Structure
- `src/` - Contains the main source code for the `TicketService` and supporting classes.
  - `pairtest/` - Contains the `TicketService.js` class and business logic.
  - `lib/` - Contains utility classes like `TicketTypeRequest` and `InvalidPurchaseException`.
  - `thirdparty/` - Contains third-party service integrations like `TicketPaymentService` and `SeatReservationService`.
  - `Constants.js` - Contains configurable constants like ticket prices.
- `tests/` - Contains Jest test cases for validating the functionality of `TicketService`.

### Running the Application
To execute the main logic, you can create a script or run a specific file that utilizes the `TicketService`:
```bash
node src/pairtest/TicketService.js
```

### Running Tests
The project uses **Jest** for unit testing. To run the tests:
```bash
npm test
```

This will run all test cases inside the `tests/` directory, ensuring that the validation logic and service integrations work as expected.

### Example Usage
Below is an example of how to use the `TicketService` class:
```javascript
import TicketService from './src/pairtest/TicketService.js';

const ticketService = new TicketService();
const accountId = 123;
const tickets = { adult: 2, child: 1, infant: 0 };

try {
  const response = ticketService.purchaseTickets(accountId, tickets);
  console.log(response);
} catch (error) {
  console.error('Error purchasing tickets:', error.message);
}
```

### Configuration
- Update ticket prices and other constants in `Constants.js`:
  ```javascript
  export const TICKET_PRICES = {
    INFANT: 0,
    CHILD: 15,
    ADULT: 25,
  };
  ```
- Update business rules as needed within the `TicketService` class.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For any questions or support, please contact [your-email@example.com].

## Acknowledgments
- **Jest** for providing a great testing framework.
- **Node.js** for making JavaScript development seamless on the server side.
- Any other libraries and contributors.
