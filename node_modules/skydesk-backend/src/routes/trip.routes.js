// src/routes/trip.routes.js

import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as tripController from '../controllers/trip.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', tripController.getTrips);

export default router;
