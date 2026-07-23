// src/routes/offer.routes.js

import { Router } from 'express';
import * as offerController from '../controllers/offer.controller.js';

const router = Router();

// Offers are intentionally public so the homepage can display them
// without requiring a login. Add `authenticate` here if that changes.
router.get('/', offerController.getOffers);

export default router;
