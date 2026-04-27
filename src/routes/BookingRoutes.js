const express = require("express");
const {
    addBooking,
    getAllBookings,
    getBookingsByUserId,
    cancelBooking,
    getDailyVisitors,
    getActiveBookings,
} = require("../controllers/BookingControllers");

const router = express.Router();

router.post("/addbooking", addBooking); 
router.get("/getallbookings", getAllBookings); 
router.get("/getbookingbyid/:userId", getBookingsByUserId);  
router.delete("/cancelbooking/:bookingId", cancelBooking); 
router.get("/getdailyvisitors", getDailyVisitors);
router.get("/getactivebookings", getActiveBookings);

module.exports = router;
