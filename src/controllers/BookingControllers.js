const Booking = require("../models/BookModel");
const OwnerParkingModel = require("../models/OwnerParkingModel");
const OwnerParking = require("../models/OwnerParkingModel");
const Vehicle = require("../models/VehicleModel");

const addBooking = async (req, res) => {
  try {
    const { userId, ownerparkingId, vehicleId, vehicleType, startTime, endTime } = req.body;
    const start = new Date(startTime);
    const end = new Date(endTime);

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const parking = await OwnerParking.findById(ownerparkingId);
    if (!parking) return res.status(404).json({ message: "Parking not found" });

    const existingBookings = await Booking.find({
      ownerparkingId,
      vehicleType,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });

    let assignedSlot = null;
    let availableSlots = [];

    if (vehicleType === "2 Wheeler") {
      for (let i = 1; i <= parking.totalCapacityTwoWheeler; i++) {
        let slot = `A-${i}`;
        if (!existingBookings.some((b) => b.slot === slot)) {
          availableSlots.push(slot);
        }
      }
    } else if (vehicleType === "4 Wheeler") {
      for (let i = 1; i <= parking.totalCapacityFourWheeler; i++) {
        let slot = `B-${i}`;
        if (!existingBookings.some((b) => b.slot === slot)) {
          availableSlots.push(slot);
        }
      }
    }

    if (availableSlots.length > 0) {
      assignedSlot = availableSlots[0];
    } else {
      return res.status(400).json({ message: "No available slots for selected time" });
    }

    const newBooking = await Booking.create({
      userId,
      ownerparkingId,
      vehicleId,
      vehicleType,
      slot: assignedSlot,
      startTime: start,
      endTime: end,
    });

    res.status(201).json({ message: "Booking successful", data: newBooking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId ownerparkingId vehicleId");
    res.status(200).json({ message: "All bookings fetched successfully", data: bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).populate("ownerparkingId vehicleId");
    res.status(200).json({ message: "User bookings fetched successfully", data: bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDailyVisitors = async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }

    // First get all parkings owned by this owner
    const ownerParkings = await OwnerParking.find({ parkingownerId: ownerId });
    const parkingIds = ownerParkings.map(parking => parking._id);

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find bookings for owner's parkings within today
    const dailyVisitors = await Booking.find({
      ownerparkingId: { $in: parkingIds },
      startTime: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('vehicleId', 'registrationNumber')
      .populate('userId', 'name');

    res.status(200).json({ 
      success: true,
      message: "Daily visitors fetched successfully", 
      data: dailyVisitors 
    });
  } catch (err) {
    console.error('Error in getDailyVisitors:', err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching daily visitors",
      error: err.message 
    });
  }
};

const getActiveBookings = async (req, res) => {
  try {
    const { ownerId, currentTime } = req.query;
    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }
    
    // Get all parkings owned by this owner
    const ownerParkings = await OwnerParking.find({ parkingownerId: ownerId });
    const parkingIds = ownerParkings.map(parking => parking._id);

    // Find all active bookings for owner's parkings
    const now = currentTime ? new Date(currentTime) : new Date();
    
    const activeBookings = await Booking.find({
      ownerparkingId: { $in: parkingIds },
      startTime: { $lte: now },
      endTime: { $gt: now }
    }).populate('vehicleId', 'registrationNumber')
      .populate('userId', 'name');

    res.status(200).json({ 
      success: true,
      message: "Active bookings fetched successfully", 
      data: activeBookings 
    });
  } catch (err) {
    console.error('Error in getActiveBookings:', err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching active bookings",
      error: err.message 
    });
  }
};

module.exports = {
  addBooking,
  getAllBookings,
  getBookingsByUserId,
  cancelBooking,
  getDailyVisitors,
  getActiveBookings,
};
