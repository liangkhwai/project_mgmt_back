const Exam_booking = require("../models/exam_booking");
const Free_hours = require("../models/free_hours");
const Exam_requests = require("../models/exam_requests");
const sequelize = require("../db");
exports.booking = async (req, res, next) => {
  try {
    const eventList = req.body;
    console.log(eventList);

    const updateFreeHours = await Free_hours.update(
      {
        isBooked: true,
      },
      { where: { id: eventList.eventId.map((item) => parseInt(item)) } }
    );

    const booking = await Exam_booking.create({
      start_time: eventList.start,
      end_time: eventList.end,
      examRequestId: eventList.requestId.id,
    });

    const exam_request = await Exam_requests.update(
      {
        status: "รอขึ้นสอบ",
      },
      { where: { id: parseInt(eventList.requestId.id) } }
    );

    console.log(booking);

    return res.status(200).json("success");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.checkBooked = async (req, res, next) => {
  try {
    const sql =
      "SELECT * FROM exam_bookings WHERE examRequestId = ? ORDER BY id DESC LIMIT 1";
    const result = await sequelize.query(sql, {
      replacements: [req.params.requestId],
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length === 0) {
      return res.status(200).json(false);
    }

    return res.status(200).json(result[0]);
  } catch (er) {
    console.log(er);
    return res.status(500).json(er);
  }
};

exports.checkResulted = async (req, res, next) => {
  try {
    const sql =
      "SELECT * FROM exam_results WHERE examRequestId = ? ORDER BY id DESC LIMIT 1";
    const result = await sequelize.query(sql, {
      replacements: [req.params.requestId],
      type: sequelize.QueryTypes.SELECT,
    });

    if (result.length === 0) {
      return res.status(200).json(false);
    }

    return res.status(200).json(result[0]);
  } catch (er) {
    console.log(er);
    return res.status(500).json(er);
  }
};
