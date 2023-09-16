const Booking = require("../models/exam_booking");
const Exam_request = require("../models/exam_requests");
const Exam_result = require("../models/exam_result");
const sequelize = require("../db");
const Exam_booking = require("../models/exam_booking");
const Group = require("../models/group");
exports.getList = async (req, res, next) => {
  try {
    const sql =
      "SELECT exam_bookings.*,`groups`.id as `grpId` , `groups`.title ,`groups`.status FROM exam_bookings INNER JOIN exam_requests ON exam_bookings.examRequestId = exam_requests.id INNER JOIN `groups` ON `groups`.id = exam_requests.groupId where exam_bookings.isResult IS NULL OR exam_bookings.isResult = 0 ";

    const result = await sequelize.query(sql);

    if (result.length === 0) {
      return res.status(200).json("no data");
    }

    return res.status(200).json(result[0]);
  } catch (er) {
    return res.status(500).json(er);
  }
};

exports.submitResult = async (req, res, next) => {
  try {
    const result = req.body.result;
    const requestId = req.body.resultId;
    const bookingId = req.body.bookingId;
    const grpId = req.body.grpId;
    const grpStatus = req.body.groupStatus;
    console.log(req.body);
    let statusTarget = "";
    if (grpStatus === "สอบหัวข้อ") {
      statusTarget = "ยังไม่ยื่นสอบก้าวหน้า";
    } else if (grpStatus === "สอบก้าวหน้า") {
      statusTarget = "ยังไม่ยื่นสอบป้องกัน";
    } else {
      statusTarget = "รอส่งปริญญานิพนธ์";
    }

    try {
      const exam_result = await Exam_result.create({
        result: result,
        examRequestId: requestId,
        examBookingId: bookingId,
      })
        .then(async () => {
          const exam_booking = await Booking.update(
            {
              isResult: true,
            },
            { where: { id: bookingId } }
          );
        })

        .then(async () => {
          const exam_request = await Exam_request.update(
            {
              status: result ? "ผ่าน" : "ไม่ผ่าน",
            },
            { where: { id: parseInt(requestId) } }
          );
          if (result) {
            const group = await Group.update(
              {
                status: statusTarget,
              },
              { where: { id: parseInt(grpId) } }
            );
          }

          return res.status(200).json(exam_request);
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
