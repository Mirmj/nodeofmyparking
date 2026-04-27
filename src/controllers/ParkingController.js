const parkingModel = require("../models/ParkingModel");

const addParking = async (req, res) => {
  try {
    const savedParkings = await parkingModel.create(req.body);
    res.status(201).json({
      message: "Parking added successfully",
      data: savedParkings,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};

const getAllParkings = async (req, res) => {

    try{
        
        const parkings = await parkingModel.find().populate("ParkingOwnerId stateId cityId areaId");
        res.status(200).json({
            message: "All parkings fetched successfully",
            data: parkings
        })

    }catch(err){

        res.status(500).json({
            message: err
        })

    }

}
module.exports = {
        addParking,
        getAllParkings,
}