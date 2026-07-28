// src/services/flight.service.js
// Flight search and retrieval logic.

import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

/**
 * Search flights with optional filters.
 * All filter parameters are optional; unfiltered returns all flights.
 *
 * @param {{ origin?: string, destination?: string, date?: string, cabin_class?: string }} filters
 * @returns {object[]} Array of flight rows
 */
export const searchFlights = async ({
  origin,
  destination,
  date,
  cabin_class,
} = {}) => {

  const where = {};

  if (origin) {
    where.origin = origin.toUpperCase();
  }

  if (destination) {
    where.destination = destination.toUpperCase();
  }

  if (cabin_class) {
    where.cabin_class = {
      equals: cabin_class,
      mode: 'insensitive',
    };
  }

  if (date) {
    const start = new Date(date);
    const end = new Date(date);

    end.setDate(end.getDate() + 1);

    where.departure_time = {
      gte: start,
      lt: end,
    };
  }

  return await prisma.flights.findMany({
    where,
    orderBy: {
      departure_time: 'asc',
    },
  });
};

/**
 * Fetch a single flight by ID.
 *
 * @param {number} id
 * @returns {object} Flight row
 */
export const getFlightById = async (id) => {

  const flight = await prisma.flights.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!flight) {
    throw new AppError('Flight not found.', 404);
  }

  return flight;
};