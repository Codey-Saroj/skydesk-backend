// src/controllers/flight.controller.js
import { sendSuccess } from '../utils/response.js';
import * as flightService from '../services/flight.service.js';

export const searchFlights = async (req, res, next) => {
  try {
    const flights = await flightService.searchFlights(req.query);
    sendSuccess(res, { flights, count: flights.length }, 'Flights fetched successfully.');
  } catch (err) {
    next(err);
  }
};

export const getFlightById = async (req, res, next) => {
  try {
    const flight = await flightService.getFlightById(parseInt(req.params.id, 10));
    sendSuccess(res, { flight }, 'Flight fetched successfully.');
  } catch (err) {
    next(err);
  }
};
