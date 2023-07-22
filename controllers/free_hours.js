const Teacher = require("../models/teacher");
const Group = require("../models/group");
const Board = require("../models/board");
const checkToken = require("../utils/checkToken");
const FreeHours = require("../models/free_hours");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");
exports.addHours = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }

    console.log(req.body);
    const title = req.body.date.title;
    const start = dayjs(req.body.date.start)
      .utc()
      .add(7, "hours")
      .locale("th")
      .format("YYYY-MM-DD HH:mm:ss");
    const end = dayjs(req.body.date.end)
      .utc()
      .add(7, "hours")
      .locale("th")
      .format("YYYY-MM-DD HH:mm:ss");
    // console.log(start,end);
    const allDay = req.body.date.allDay;
    const tchId = req.body.tchId;

    const free_hours = await FreeHours.create({
      title: title,
      start_time: start,
      end_time: end,
      allDay: allDay,
      teacherId: parseInt(tchId),
    });
    const startTime = dayjs(free_hours.start_time)
      .utc()
      .add(7, "hours")
      .locale("th")
      .format("YYYY-MM-DD HH:mm:ss");
    const endTime = dayjs(free_hours.end_time)
      .utc()
      .add(7, "hours")
      .locale("th")
      .format("YYYY-MM-DD HH:mm:ss");
    free_hours.setDataValue("start_time", startTime);
    free_hours.setDataValue("end_time", endTime);

    function isBool(val) {
      if (val == 1) {
        return true;
      }
      return false;
    }

    const resDta = {
      start: startTime,
      end: endTime,
      title: free_hours.title,
      allDay: isBool(free_hours.allDay),
    };

    return res.status(200).json(resDta);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getEventListTch = async (req, res, next) => {
  try {
    const tchId = req.body.tchId;

    const free_hours = await FreeHours.findAll({
      where: { teacherId: parseInt(tchId) },
    });
    const resArr = [];
    function isBool(val) {
      if (val == 1) {
        return true;
      }
      return false;
    }
    for (const freeHours of free_hours) {
      const startTime = dayjs(freeHours.start_time)
        .utc()
        .add(7, "hours")
        .locale("th")
        .format("YYYY-MM-DD HH:mm:ss")
      const endTime = dayjs(freeHours.end_time)
        .utc()
        .add(7, "hours")
        .locale("th")
        .format("YYYY-MM-DD HH:mm:ss")

      let data = {
        start: dayjs(startTime).$d,
        end: dayjs(endTime).$d,
        title: freeHours.title,
        allDay: isBool(freeHours.allDay),
      };
      resArr.push(data);
    }

   

    return res.status(200).json(resArr);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
