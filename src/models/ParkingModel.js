const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkingSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    totalCapacityTwoWheeler: {
        type: Number,
        required: true 
    },
    totalCapacityFourWheeler: {
        type: Number,
        required: true 
    },
    parkingType: {
        type: String,
        enum: ["Road", "Ground", "Building"],
        required: true 
    },
    floor: {
        type: Number,
    },

    ParkingOwnerId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    stateId: {
        type: Schema.Types.ObjectId,
        ref: 'state',
        required: true
    },
    cityId: {
        type: Schema.Types.ObjectId,
        ref: 'city',
        required: true
    },
    areaId: {
        type: Schema.Types.ObjectId,
        ref: 'area',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('parking', parkingSchema);