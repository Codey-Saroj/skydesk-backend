// src/controllers/trip.controller.js
import { sendSuccess } from '../utils/response.js';
import * as tripService from '../services/trip.service.js';

export const getTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getUserTrips(req.user.id);
    sendSuccess(res, { trips, count: trips.length }, 'Trips fetched successfully.');
  } catch (err) {
    next(err);
  }
};
