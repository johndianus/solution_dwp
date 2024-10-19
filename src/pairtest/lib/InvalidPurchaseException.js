export default class InvalidPurchaseException extends Error {
    constructor(message, details = {}) {
      super(message);
      this.name = 'InvalidPurchaseException';
      this.details = details;
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, InvalidPurchaseException);
      }
    }
  
    // Method to log error information without displaying the stack trace
    errorDetails() {
      console.error(`[${this.name}]: ${this.message}`);
      if (Object.keys(this.details).length > 0) {
        console.error('Error Details:', JSON.stringify(this.details, null, 2));
      }
    }
  }
  