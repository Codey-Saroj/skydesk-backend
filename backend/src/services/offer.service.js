// src/services/offer.service.js
// Offer retrieval logic.

import prisma from '../lib/prisma.js';

/**
 * Fetch all active, non-expired offers.
 * @returns {object[]}
 */
export const getActiveOffers = async () => {
  const offers = await prisma.offers.findMany({
    where: {
      is_active: true,
      OR: [{ valid_until: null }, { valid_until: { gte: new Date() } }],
    },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      code: true,
      discount: true,
      badge: true,
      valid_until: true,
      created_at: true,
    },
  });

  return offers;
};
