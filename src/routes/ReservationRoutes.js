const routes = require('express').Router();
const reservationController = require('../controllers/ReservationContoller'); // Fixed spelling
const auth = require('../middlewere/AuthMiddleware'); 

// Protected routes
routes.use(auth); // Applies to all routes below

// Active reservations
routes.get('/active', reservationController.getActiveReservations);

// Reservation history
routes.get('/history', reservationController.getPastReservations);

// Create new reservation
routes.post('/create', reservationController.createReservation);

// Update reservation
routes.put('/:id', reservationController.updateReservation);

// Cancel reservation
routes.delete('/:id', reservationController.cancelReservation);

module.exports = routes;