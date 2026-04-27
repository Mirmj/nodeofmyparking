const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  ownerparkingId: { type: mongoose.Schema.Types.ObjectId, ref: "ownerparking", required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "vehicle", required: true },
  vehicleType: { type: String, enum: ["2 Wheeler", "4 Wheeler"], required: true },
  slot: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("booking", bookingSchema);
