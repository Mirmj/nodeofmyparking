const Parking = require("../models/OwnerParkingModel");
const mongoose = require("mongoose");

// ✅ Add Parking
const addParking = async (req, res) => {
  try {
    const {
      parkingname,
      state,
      city,
      area,
      parkingownerId,
      totalCapacityTwoWheeler,
      totalCapacityFourWheeler,
    } = req.body;

    // Validate required fields
    if (!parkingname || !state || !city || !area || !totalCapacityTwoWheeler || !totalCapacityFourWheeler || !parkingownerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate owner ID format
    if (!mongoose.Types.ObjectId.isValid(parkingownerId)) {
      return res.status(400).json({ message: "Invalid owner ID format" });
    }

    const newParking = await Parking.create(req.body);
    
    res.status(201).json({
      message: "Parking added successfully",
      data: newParking,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error adding parking",
      error: err.message,
    });
  }
};

//  Get All Parkings
const getAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.find().populate("parkingownerId");
    res.status(200).json({
      message: "All parkings fetched successfully",
      data: parkings,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching parkings",
      error: err.message,
    });
  }
};

//  Get Parking by ID
const getParkingById = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id).populate("parkingownerId");
    if (!parking) {
      return res.status(404).json({ message: "Parking not found" });
    }
    res.status(200).json({
      message: "Parking details fetched successfully",
      data: parking,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching parking details",
      error: err.message,
    });
  }
};

//  Delete Parking
const deleteParking = async (req, res) => {
  try {
    const deletedParking = await Parking.findByIdAndDelete(req.params.id);
    if (!deletedParking) {
      return res.status(404).json({ message: "Parking not found" });
    }
    res.status(200).json({
      message: "Parking deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting parking",
      error: err.message,
    });
  }
};

//  Update Parking
const updateParking = async (req, res) => {
  try {
    const updatedParking = await Parking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedParking) {
      return res.status(404).json({ message: "Parking not found" });
    }
    res.status(200).json({
      message: "Parking updated successfully",
      data: updatedParking,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating parking",
      error: err.message,
    });
  }
};

// Get Parkings by Owner ID
const getParkingsByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid ownerId format" });
    }

    const parkings = await Parking.find({
      parkingownerId: new mongoose.Types.ObjectId(ownerId),
    }).populate("parkingownerId");

    // Always return 200 with data array (empty array is valid for new owners)
    res.status(200).json({
      message: "Parkings fetched successfully",
      data: parkings || [],
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching parkings",
      error: err.message,
    });
  }
};

module.exports = {
  addParking,
  getAllParkings,
  getParkingById,
  deleteParking,
  updateParking,
  getParkingsByOwnerId,
};
