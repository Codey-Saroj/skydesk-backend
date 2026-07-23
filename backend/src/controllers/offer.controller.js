// src/controllers/offer.controller.js
import { sendSuccess } from '../utils/response.js';
import * as offerService from '../services/offer.service.js';

export const getOffers = async (req, res, next) => {
  try {
    const offers = await offerService.getActiveOffers();
    sendSuccess(res, { offers, count: offers.length }, 'Offers fetched successfully.');
  } catch (err) {
    next(err);
  }
};
