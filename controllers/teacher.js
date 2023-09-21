const sequelize = require("../db");
const Teachers = require("../models/teacher");
const { Op } = require("sequelize");
const checkToken = require("../utils/checkToken");
const bcrypt = require("bcrypt");
exports.getList = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    const teacher = await Teachers.findAll();
    // console.log(teacher)
    res.status(200).json(teacher);
  } catch {
    res.status(404).json("err");
  }
};

exports.getListRandomAll = async (req, res, next) => {
  try {
    // const token = req.cookies.token;
    // console.log(token);
    // const check = await checkToken(token);
    // if(!check){
    //   res.status(401).json("invalid token or unavalible token");
    // }

    const sql = `SELECT DISTINCT * FROM teachers ORDER BY RAND()`;
    const teacher = await sequelize.query(sql);
    console.log(teacher);
    return res.status(200).json(teacher);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.inSert = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }

    const prefix = req.body.prefix;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const tel = req.body.tel;
    const color_calendar = req.body.color_calendar;
    const line_id = req.body.line_id;

    const pwd = bcrypt.hashSync(tel, 10);
    const new_teacher = await Teachers.create({
      prefix: prefix,
      firstname: firstname,
      lastname: lastname,
      email: email,
      tel: tel,
      pwd: pwd,
      color_calendar: color_calendar,
      line_id: line_id,
    });

    const withRef = await Teachers.findOne({ where: { id: new_teacher.id } });
    return res.status(201).json(withRef);
  } catch {
    res.status(501).json("err");
  }
};

exports.deLete = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    const id = req.body.id;
    console.log(id);
    const teacher = await Teachers.findOne({ where: { id: id } });
    await teacher.destroy();
    console.log("delete success");
    return res.status(200).json("delete success");
  } catch {
    return res.status(500).json("err");
  }
};

exports.upDate = async (req, res, next) => {
  console.log("hi");
  try {
    const token = req.cookies.token;
    console.log(token);
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    console.log(req.body);
    const id = req.body.id;
    const prefix = req.body.prefix;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const tel = req.body.tel;
    const color_calendar = req.body.color_calendar;
    const line_id = req.body.line_id;

    const teacher = await Teachers.update(
      {
        prefix: prefix,
        firstname: firstname,
        lastname: lastname,
        email: email,
        tel: tel,
        color_calendar: req.body.color_calendar,
        line_id: line_id,
      },
      { where: { id: id } }
    );
    const withRef = await Teachers.findOne({
      where: { id: id },
    });
    console.log("success");
    return res.status(200).json(withRef);
  } catch {
    return res.status(401);
  }
};

exports.upDateLine = async (req, res, next) => {
  try {
    const id = req.body.id;
    const line_id = req.body.line_id;

    const teacher = await Teachers.update(
      {
        line_id: line_id,
      },
      { where: { id: parseInt(id) } }
    );
    const withRef = await Teachers.findOne({
      where: { id: id },
    });
    console.log("success");
    return res.status(200).json(withRef);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.lineNotify = async (req, res, next) => {
  const LINE_CHANEL_ACCESS_TOKEN =
    "wTJxNGn2KhodrGD32cCrcoVQ2KlrsyZaqjdfHQJDydgsknGQh99wRohaFKkBfrwTjt3eeJDDKWKMsHz80v4igI+fn0yCD+IiCNi+i414JmLOXk0xY/ll7fYWawoHaJ86LsWwz0BQe1verNsKO8vcOgdB04t89/1O/w1cDnyilFU=";
  try {
    console.log(req.body);
    const teacher_id = req.body.teacher_id;
    const teachers = await Teachers.findAll({
      where: { id: teacher_id.map((item) => parseInt(item)),
        line_id: {
          [Op.not]: null, // Add the condition for line_id not being null
        }, },
    });

    const sendNotify = await fetch(
      "https://api.line.me/v2/bot/message/multicast",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + LINE_CHANEL_ACCESS_TOKEN,
        },
        method: "POST",
        body: JSON.stringify({
          to: teachers.flatMap((item) => (item ? (item.line_id ? item.line_id : item) : [])),
          // to: teachers.map((item) => (item.line_id ? item.line_id : "")),
          messages: [
            {
              type: "flex",
              altText: "นัดสอบงับ",
              contents: {
                type: "bubble",
                body: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "ขอเรียนเชิญ",
                      weight: "bold",
                      size: "xl",
                    },
                    {
                      type: "separator",
                      color: "#6699FF",
                      margin: "xs",
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      margin: "lg",
                      spacing: "sm",
                      contents: [
                        {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "text",
                              text: "อาจารย์ปัทมากร เนตยวิจิตร",
                              size: "xs",
                            },
                          ],
                        },
                        {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "text",
                              text: "อาจารย์ทรรศนีย์ ลุนราศรี",
                              size: "xs",
                            },
                          ],
                          margin: "xs",
                        },
                        {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "text",
                              text: "อาจารย์ที่ปรึกษา พิชญะภาคย์ พิพิธพัฒน์ไพสิฐ",
                              wrap: true,
                              size: "xs",
                            },
                          ],
                        },
                        {
                          type: "box",
                          layout: "baseline",
                          contents: [
                            {
                              type: "text",
                              text: "ขึ้นสอบรอบ:",
                              size: "xs",
                            },
                            {
                              type: "text",
                              text: "ป้องกัน",
                              size: "xs",
                              flex: 3,
                            },
                          ],
                        },
                        {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "text",
                              text: "ระบบการพัฒนาระบบจองสนามฟุตบอลหญ้าเทียม กรณีศึกษาสนามฟุตบอลหญ้าเทียมริมบึงแก่นนคร",
                              style: "normal",
                              weight: "regular",
                              wrap: true,
                              margin: "none",
                              size: "xs",
                            },
                          ],
                        },
                        {
                          type: "box",
                          layout: "baseline",
                          spacing: "none",
                          contents: [
                            {
                              type: "text",
                              text: "เวลา:",
                              flex: 1,
                              weight: "bold",
                              size: "sm",
                            },
                            {
                              type: "text",
                              text: "02/77/66 13.30-14.30 น.",
                              wrap: true,
                              flex: 5,
                              contents: [],
                              weight: "bold",
                              size: "sm",
                            },
                            {
                              type: "icon",
                              url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                              size: "xs",
                              margin: "none",
                              offsetTop: "xs",
                              offsetBottom: "none",
                              offsetStart: "none",
                              offsetEnd: "none",
                              scaling: true,
                              position: "relative",
                            },
                          ],
                          margin: "xs",
                        },
                        {
                          type: "box",
                          layout: "vertical",
                          contents: [
                            {
                              type: "text",
                              text: "จัดทำโดย",
                              size: "xs",
                            },
                            {
                              type: "text",
                              text: "นางสาวหทัยชนก ศิริกุล",
                              wrap: true,
                              size: "xs",
                            },
                            {
                              type: "text",
                              text: "63342110306-9",
                              size: "xs",
                            },
                            {
                              type: "text",
                              text: "นายศุภวัฒน์ ฝัดวิเศษ",
                              wrap: true,
                              size: "xs",
                            },
                            {
                              type: "text",
                              text: "63342110007-2",
                              size: "xs",
                            },
                            {
                              type: "text",
                              text: "นางสาวชนกนันท์ หิรัญนุเคราะห์ ",
                              wrap: true,
                              size: "xs",
                            },
                            {
                              type: "text",
                              text: "63342110129-7",
                              size: "xs",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                
              },
            },
          ],
        }),
      }
    );

    console.log(sendNotify);

    return res.status(200).json(teachers);
  } catch (er) {
    console.log(er);
    return res.status(500).json(er);
  }
};
