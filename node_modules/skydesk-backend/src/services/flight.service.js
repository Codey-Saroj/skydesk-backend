// src/services/flight.service.js
// Flight search and retrieval logic.

import { query } from '../config/db.js';
import AppError from '../utils/AppError.js';

/**
 * Search flights with optional filters.
 * All filter parameters are optional; unfiltered returns all flights.
 *
 * @param {{ origin?: string, destination?: string, date?: string, cabin_class?: string }} filters
 * @returns {object[]} Array of flight rows
 */
export const searchFlights = async ({ origin, destination, date, cabin_class } = {}) => {
  const conditions = [];
  const params = [];

  if (origin) {
    params.push(origin.toUpperCase());
    conditions.push(`origin = $${params.length}`);
  }

  if (destination) {
    params.push(destination.toUpperCase());
    conditions.push(`destination = $${params.length}`);
  }

  if (date) {
    params.push(date);
    conditions.push(`DATE(departure_time AT TIME ZONE 'UTC') = $${params.length}`);
  }

  if (cabin_class) {
    params.push(cabin_class);
    conditions.push(`LOWER(cabin_class) = LOWER($${params.length})`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await query(
    `SELECT * FROM flights ${where} ORDER BY departure_time ASC`,
    params
  );

  return result.rows;
};

/**
 * Fetch a single flight by ID.
 *
 * @param {number} id
 * @returns {object} Flight row
 */
export const getFlightById = async (id) => {
  const result = await query('SELECT * FROM flights WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    throw new AppError('Flight not found.', 404);
  }

  return result.rows[0];
};
