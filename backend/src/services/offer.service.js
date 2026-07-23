// src/services/offer.service.js
// Offer retrieval logic.

import { query } from '../config/db.js';

/**
 * Fetch all active, non-expired offers.
 * @returns {object[]}
 */
export const getActiveOffers = async () => {
  const result = await query(
    `SELECT id, title, description, code, discount, badge, valid_until, created_at
     FROM offers
     WHERE is_active = true
       AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
     ORDER BY created_at DESC`
  );
  return result.rows;
};
