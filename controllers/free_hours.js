const Teacher = require("../models/teacher");
const Group = require("../models/group");
const Board = require("../models/board");
const checkToken = require("../utils/checkToken");
const FreeHours = require("../models/free_hours");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const Free_hours = require("../models/free_hours");
const sequelize = require("../db");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");
exports.addHours = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1] ? header.split(" ")[1] : null;
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }

    console.log(req.body);
    const title = req.body.date.title;
    let start = dayjs(req.body.date.start)
      .utc()
      .add(7, "hours")
      .locale("th")
      .format("YYYY-MM-DD HH:mm:ss");
    let end = dayjs(req.body.date.end)
      .utc()
      .add(7, "hours")
      .locale("th")
      .format("YYYY-MM-DD HH:mm:ss");
    // console.log(start,end);
    if (start > end) {
      let startTmp = start;
      start = end;
      end = startTmp;
    }

    const allDay = req.body.date.allDay;
    const tchId = req.body.tchId;

    const find_free_hours = await FreeHours.findOne({
      where: {
        start_time: start,
        end_time: end,
        teacherId: parseInt(tchId),
      },
    });
    if (find_free_hours) {
      return res.status(400).json("มีข้อมูลนี้อยู่แล้ว");
    }
    const free_hours_create = await FreeHours.create({
      title: title ? title : "ว่าง",
      start_time: start,
      end_time: end,
      allDay: allDay,
      teacherId: parseInt(tchId),
    });

    console.log("data that create: ", free_hours_create);
    const free_hours = await FreeHours.findOne({
      where: { id: parseInt(free_hours_create.id) },
      include: [Teacher],
    });

    console.log(free_hours);
    return res.status(200).json(free_hours);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
function isBool(val) {
  if (val == 1) {
    return true;
  }
  return false;
}
exports.getEventListTch = async (req, res, next) => {
  try {
    const tchId = req.body.tchId;

    const free_hours = await FreeHours.findAll({
      where: { teacherId: parseInt(tchId) },
    });
    const resArr = [];

    for (const freeHours of free_hours) {
      const startTime = dayjs(freeHours.start_time)
        .utc()
        .add(7, "hours")
        .locale("th")
        .format("YYYY-MM-DD HH:mm:ss");
      const endTime = dayjs(freeHours.end_time)
        .utc()
        .add(7, "hours")
        .locale("th")
        .format("YYYY-MM-DD HH:mm:ss");

      let data = {
        id: parseInt(freeHours.id),
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

exports.updateEvent = async (req, res, next) => {
  try {
    console.log(req.body);
    const eventId = req.body.event.id;
    const title = req.body.event.title;
    const start = req.body.event.start;
    const end = req.body.event.end;
    const allDay = req.body.event.allDay;
    const free_hours = await FreeHours.update(
      {
        title: title,
        allDay: allDay,
        start_time: start,
        end_time: end,
      },
      { where: { id: parseInt(eventId) } }
    );
    console.log("data update id : ", eventId);
    const data = await FreeHours.findAll({
      // where: { id: parseInt(eventId) },
      include: Teacher,
    });
    const eventsList = [];

    // for (const event of data) {
    //   const startTime = dayjs(event.start_time)
    //     .utc()
    //     .add(7, "hours")
    //     .locale("th")
    //     .format("YYYY-MM-DD HH:mm:ss");
    //   const endTime = dayjs(event.end_time)
    //     .utc()
    //     .add(7, "hours")
    //     .locale("th")
    //     .format("YYYY-MM-DD HH:mm:ss");

    //   let data = {
    //     id: parseInt(event.id),
    //     start: dayjs(startTime).$d,
    //     end: dayjs(endTime).$d,
    //     title: event.title,
    //     allDay: isBool(event.allDay),
    //     teacher: event.teacher,
    //   };
    //   eventsList.push(data);
    // }
    const getFreeUpdate = await FreeHours.findOne({
      where: { id: parseInt(eventId) },
      include: [Teacher],
    });
    console.log("db : ", getFreeUpdate);
    // console.log("DATA FROM DB ",data);
    // const update_free_hour = {
    //   id: parseInt(data.id),
    //   start: dayjs(data.start_time).$d,
    //   end: dayjs(data.end_time).$d,
    //   title: data.title,
    //   allDay: isBool(data.allDay),
    //   teacher:data.teacher
    // };
    // console.log(update_free_hour);
    return res.status(203).json(getFreeUpdate);
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    console.log(req.body);
    const eventId = req.body.id;

    const free_hours = await FreeHours.findOne({
      where: { id: parseInt(eventId) },
    });
    free_hours.destroy();
    return res.status(200).json(parseInt(eventId));
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await FreeHours.findAll({ include: Teacher });
    const eventsList = [];

    for (const event of events) {
      const startTime = dayjs(event.start_time)
        .utc()
        .add(7, "hours")
        .locale("th")
        .format("YYYY-MM-DD HH:mm:ss");
      const endTime = dayjs(event.end_time)
        .utc()
        .add(7, "hours")
        .locale("th")
        .format("YYYY-MM-DD HH:mm:ss");

      let data = {...event.dataValues,
        id: parseInt(event.id),
        start: dayjs(startTime).$d,
        end: dayjs(endTime).$d,
        title: event.title,
        allDay: isBool(event.allDay),
        teacher: event.teacher,
      };
      eventsList.push(data);
    }
    return res.status(200).json(eventsList);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getEventOnlyGroup = async (req, res) => {
  try {
    const grpId = parseInt(req.params.grpId);
    console.log(grpId);
    const sql = `SELECT free_hours.id as fh_id ,free_hours.title, free_hours.start_time,free_hours.end_time,free_hours.isBooked,free_hours.teacherId,teachers.* FROM project_mgmt.free_hours INNER JOIN teachers ON free_hours.teacherId = teachers.id INNER JOIN boards ON teachers.id = boards.teacherId INNER JOIN \`groups\` ON boards.groupId = \`groups\`.id WHERE \`groups\`.id = ${parseInt(
      grpId
    )}  AND (isBooked = false OR isBooked IS NULL)`; //AND isBooked = false อย่าลืมเพิ่มอันนี้

    const events = await sequelize.query(sql);
    const eventsList = [];
    console.log("events : ", events[0]);
    for (const event of events[0]) {
      const startTime = dayjs(event.start_time)
        .utc()
        .add(7, "hours")
        .locale("th")
        .format("YYYY-MM-DD HH:mm:ss");
      const endTime = dayjs(event.end_time)
        .utc()
        .add(7, "hours")
        .locale("th")
        .format("YYYY-MM-DD HH:mm:ss");

      let data = {
        id: parseInt(event.id),
        start: dayjs(startTime).$d,
        end: dayjs(endTime).$d,
        title: event.title,
        allDay: isBool(event.allDay),
        teacher: {
          eventId: event.fh_id,
          id: event.teacherId,
          firstname: event.firstname,
          lastname: event.lastname,
        },
      };
      eventsList.push(data);
    }
    const duplicates = [];
    for (let i = 0; i < eventsList.length; i++) {
      for (let j = i + 1; j < eventsList.length; j++) {
        for (let k = j + 1; k < eventsList.length; k++) {
          // Check if start and end properties are the same
          if (
            dayjs(eventsList[i].start).isSame(dayjs(eventsList[j].start)) &&
            dayjs(eventsList[i].end).isSame(dayjs(eventsList[j].end)) &&
            dayjs(eventsList[i].start).isSame(dayjs(eventsList[k].start)) &&
            dayjs(eventsList[i].end).isSame(dayjs(eventsList[k].end))
          ) {
            // If duplicate found, add to duplicates array
            console.log("isit");
            console.log(eventsList[i]);
            console.log(eventsList[j]);
            console.log(eventsList[k]);

            const eventGroup = {
              start: eventsList[i].start,
              end: eventsList[i].end,
              title: "ว่าง",
              allDay: eventsList[i].allDay,
              teacher: [
                eventsList[i].teacher,
                eventsList[j].teacher,
                eventsList[k].teacher,
              ],
            };
            console.log(eventGroup);
            duplicates.push(eventGroup);
          }
        }
      }
    }

    return res.status(200).json(duplicates);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
