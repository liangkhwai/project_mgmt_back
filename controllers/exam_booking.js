const Exam_booking = require("../models/exam_booking");
const Free_hours = require("../models/free_hours");
const Exam_requests = require("../models/exam_requests");
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
