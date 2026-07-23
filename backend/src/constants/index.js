// src/constants/index.js
// Single source of truth for enum values used across the application.
// Services, validators, and controllers import from here — never hard-code strings.

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL: 500,
};

export const USER_ROLES = {
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
};

// Must match the expense_category ENUM in schema.sql
export const EXPENSE_CATEGORIES = ['meals', 'transport', 'accommodation', 'communication', 'other'];

// Must match the booking_status ENUM in schema.sql
export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  PENDING: 'pending',
};

// Must match the trip_status ENUM in schema.sql
export const TRIP_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Must match the expense_status ENUM in schema.sql
export const EXPENSE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Must match the ticket_status ENUM in schema.sql
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};
