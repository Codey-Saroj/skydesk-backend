// src/routes/index.js
// Aggregates all route modules into a single router.

import { Router } from 'express';
import authRoutes    from './auth.routes.js';
import flightRoutes  from './flight.routes.js';
import bookingRoutes from './booking.routes.js';
import tripRoutes    from './trip.routes.js';
import expenseRoutes from './expense.routes.js';
import offerRoutes   from './offer.routes.js';
import supportRoutes from './support.routes.js';
import chatRoutes    from './chat.routes.js';

const router = Router();

router.use('/auth',     authRoutes);
router.use('/flights',  flightRoutes);
router.use('/bookings', bookingRoutes);
router.use('/trips',    tripRoutes);
router.use('/expenses', expenseRoutes);
router.use('/offers',   offerRoutes);
router.use('/support',  supportRoutes);
router.use('/chat',     chatRoutes);

export default router;
