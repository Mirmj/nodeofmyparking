const routes = require("express").Router();
const parkingController = require("../controllers/OwnerParkingController");
const authenticate = require("../middlewere/AuthMiddleware");

// All owner routes are protected — require a valid JWT
routes.post("/owneraddparking", authenticate, parkingController.addParking);
routes.get("/ownergetallparkings", authenticate, parkingController.getAllParkings);
routes.get("/ownergetparking/:id", authenticate, parkingController.getParkingById);
routes.put("/ownerupdateparking/:id", authenticate, parkingController.updateParking);
routes.delete("/ownerdeleteparking/:id", authenticate, parkingController.deleteParking);

// Get all parkings belonging to a specific owner — used by OwnerDashboard
routes.get("/ownergetparkings/:ownerId", authenticate, parkingController.getParkingsByOwnerId);

module.exports = routes;
