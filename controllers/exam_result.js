const Booking = require("../models/exam_booking");

exports.getList = async(req, res, next) => {
  try {
    const booking = await Booking.findAll({
      where: {
        isResult: !true || null,
      },
    });
    return res.status(200).json(booking);
  } catch (er) {
    return res.status(500).json(er);
  }
};
