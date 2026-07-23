// src/utils/response.js
// Helper functions to send consistent JSON responses across all controllers.
// Every API response follows the shape: { success, message, data }

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {*} data  - The payload to return
 * @param {string} message - Human-readable success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message - Human-readable error message
 * @param {number} statusCode - HTTP status code (default 500)
 */
export const sendError = (res, message = 'Something went wrong', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
