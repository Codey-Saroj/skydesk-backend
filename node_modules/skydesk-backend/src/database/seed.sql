

-- ─────────────────────────────────────────────────────────────
-- FLIGHTS (mirrored from frontend dummy data)
-- ─────────────────────────────────────────────────────────────

INSERT INTO flights (flight_number, airline, origin, destination, origin_city, destination_city, departure_time, arrival_time, duration, stops, price, cabin_class, available_seats)
VALUES
  ('6E 2291', 'IndiGo',          'DEL', 'BOM', 'Delhi',     'Mumbai',    '2026-07-18 06:15:00+05:30', '2026-07-18 08:20:00+05:30', '2h 05m', 'Non-stop',       4820.00, 'Economy',  6),
  ('AI 3107', 'Air India',       'DEL', 'BOM', 'Delhi',     'Mumbai',    '2026-07-18 09:40:00+05:30', '2026-07-18 11:55:00+05:30', '2h 15m', 'Non-stop',       5640.00, 'Economy', 12),
  ('UK 8842', 'Vistara',         'DEL', 'BOM', 'Delhi',     'Mumbai',    '2026-07-18 14:05:00+05:30', '2026-07-18 16:35:00+05:30', '2h 30m', '1 stop · BLR',   4110.00, 'Economy',  3),
  ('6E 1140', 'IndiGo',          'DEL', 'BOM', 'Delhi',     'Mumbai',    '2026-07-18 19:20:00+05:30', '2026-07-18 21:25:00+05:30', '2h 05m', 'Non-stop',       6215.00, 'Business', 9),
  ('AI 5502', 'Air India',       'BOM', 'BLR', 'Mumbai',    'Bengaluru', '2026-07-24 11:10:00+05:30', '2026-07-24 12:35:00+05:30', '1h 25m', 'Non-stop',       3990.00, 'Economy',  8),
  ('6E 0873', 'IndiGo',          'PAT', 'DEL', 'Patna',     'Delhi',     '2026-06-30 17:45:00+05:30', '2026-06-30 19:35:00+05:30', '1h 50m', 'Non-stop',       3210.00, 'Economy',  5),
  ('SG 450',  'SpiceJet',        'BLR', 'GOI', 'Bengaluru', 'Goa',       '2026-08-15 14:20:00+05:30', '2026-08-15 15:35:00+05:30', '1h 15m', 'Non-stop',       3200.00, 'Economy', 14),
  ('UK 888',  'Vistara',         'JAI', 'DEL', 'Jaipur',    'Delhi',     '2026-09-10 11:00:00+05:30', '2026-09-10 12:10:00+05:30', '1h 10m', 'Non-stop',       2900.00, 'Economy', 20),
  ('BA 178',  'British Airways', 'JFK', 'LHR', 'New York',  'London',    '2026-08-01 09:15:00-04:00', '2026-08-01 21:30:00+01:00', '7h 15m', 'Non-stop',      33440.00, 'Economy', 45),
  ('VS 026',  'Virgin Atlantic', 'JFK', 'LHR', 'New York',  'London',    '2026-08-01 11:10:00-04:00', '2026-08-01 23:20:00+01:00', '7h 10m', 'Non-stop',      35600.00, 'Economy', 30),
  ('AA 100',  'American Airlines','JFK','LHR', 'New York',  'London',    '2026-08-01 18:25:00-04:00', '2026-08-02 06:35:00+01:00', '7h 10m', 'Non-stop',      31120.00, 'Economy', 25),
  ('6E 777',  'IndiGo',          'HYD', 'SIN', 'Hyderabad', 'Singapore', '2026-09-20 23:55:00+05:30', '2026-09-21 07:20:00+08:00', '4h 55m', 'Non-stop',      18700.00, 'Economy', 18);

-- ─────────────────────────────────────────────────────────────
-- OFFERS (mirrored from frontend dummy data)
-- ─────────────────────────────────────────────────────────────

INSERT INTO offers (title, description, code, discount, badge, valid_until)
VALUES
  (
    '20% Off International Flights',
    'Book any international flight and save 20% this season. Valid on all cabin classes.',
    'INTL20', '20% OFF', 'HOT', '2026-07-31'
  ),
  (
    'Weekend Getaway Deals',
    'Fly out Friday, return Sunday. Special weekend pricing on select domestic routes.',
    'WKND50', '₹500 OFF', 'LIMITED', '2026-07-27'
  ),
  (
    'Student Discount Special',
    'Verified students get exclusive discounts on all routes. Show your ID at check-in.',
    'STUDENT15', '15% OFF', 'NEW', '2026-08-31'
  ),
  (
    'HDFC Credit Card Offer',
    'Get ₹1500 cashback on bookings above ₹10,000 with your HDFC credit card.',
    'HDFC1500', '₹1500 CB', 'BANK OFFER', '2026-07-20'
  );

-- ─────────────────────────────────────────────────────────────
-- Done — users, bookings, trips and expenses are created via the API
-- ─────────────────────────────────────────────────────────────
