const vehicleModel = require("../models/VehicleModel");

//  Add a Vehicle
const addVehicle = async (req, res) => {
  try {
    const savedVehicle = await vehicleModel.create(req.body);
    res.status(201).json({
      message: "Vehicle created successfully.",
      data: savedVehicle,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get All Vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleModel.find().populate("userId");
    if (vehicles.length === 0) {
      return res.status(404).json({ message: "No vehicles found." });
    }
    res.status(200).json({
      message: "Vehicles fetched successfully.",
      data: vehicles,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get Vehicles by User ID
const getVehicleByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const vehicles = await vehicleModel.find({ userId }).populate("userId");
    if (vehicles.length === 0) {
      return res.status(404).json({ message: "No vehicles found for this user." });
    }

    res.status(200).json({
      message: "Vehicles retrieved successfully.",
      data: vehicles,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Update Vehicle by ID
const updateVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVehicle = await vehicleModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    res.status(200).json({
      message: "Vehicle updated successfully.",
      data: updatedVehicle,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Delete Vehicle by ID
const deleteVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVehicle = await vehicleModel.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    res.status(200).json({
      message: "Vehicle deleted successfully.",
      data: deletedVehicle,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addVehicle,
  getAllVehicles,
  getVehicleByUserId,
  updateVehicleById,
  deleteVehicleById,
};
