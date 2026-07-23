// src/routes/flight.routes.js

import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as flightController from '../controllers/flight.controller.js';

const router = Router();

// All flight routes require authentication
router.use(authenticate);

router.get('/',    flightController.searchFlights);
router.get('/:id', flightController.getFlightById);

export default router;
