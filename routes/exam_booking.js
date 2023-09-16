const express = require("express");

const bookingController = require("../controllers/exam_booking");
const router = express.Router();

router.post("/booking", bookingController.booking);
router.get("/checkBooked/:requestId", bookingController.checkBooked);
router.get("/checkResulted/:requestId", bookingController.checkResulted);
module.exports = router;
