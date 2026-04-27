const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OwnerParkingSchema = new Schema({
   
        parkingname: {
          type: String,
          required: true,
          unique: true,
        },
        parkingownerId: {
          type: Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        area: {
          type: String,
          required: true,
        },
        totalSpots: {
          type: Number,
          required: true,
        },
        parkingType: {
          type: String,
          enum: ["Road", "Ground", "Building"],
          required: true,
        },
        totalCapacityTwoWheeler: {
            type: Number, 
            required: true
        },

        totalCapacityFourWheeler:{ 
              type: Number, 
              required: true
        },

        vehicleTypesAllowed: {
          type: [String], 
          enum: ["2-Wheeler", "4-Wheeler"],
          required: true,
        },
        hourlyRate: {
          type: Number,
          required: true,
        },
        dailyRate: {
          type: Number,
          required: true,
        },
        openTime: {
          type: String,
          required: true,
        },
        closeTime: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
      },
      { timestamps: true }
    );
module.exports = mongoose.model('ownerparking', OwnerParkingSchema);
