// src/utils/AppError.js
// Custom error class that carries an HTTP status code.
// Throw this from services instead of plain Errors so the error handler
// can set the correct HTTP status without any guessing.

export class AppError extends Error {
  /**
   * @param {string} message   Human-readable error message
   * @param {number} statusCode HTTP status code (default 500)
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes known errors from programming bugs

    // Capture the stack trace cleanly (removes AppError constructor from it)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
