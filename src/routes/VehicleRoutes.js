const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/VehicleController");


router.post("/addvehicle", vehicleController.addVehicle);

router.get("/getallvehicles", vehicleController.getAllVehicles);

router.get("/getvehiclebyuserid/:userId", vehicleController.getVehicleByUserId);

router.put("/updatevehiclebyuserid/:id", vehicleController.updateVehicleById);

router.delete("/deletevehiclebyuserid/:id", vehicleController.deleteVehicleById);

module.exports = router;
