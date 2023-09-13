const express = require("express");

const bookingController = require("../controllers/exam_booking");
const router = express.Router();

router.post("/booking", bookingController.booking);

module.exports = router;
