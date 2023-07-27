const Group = require("../models/group.js");
const Exam_requests = require("../models/exam_requests.js");
const Exam_requests_files = require("../models/exam_requests_files.js");
const checkToken = require("../utils/checkToken");
const jwt = require("jsonwebtoken");
const Boards = require("../models/board.js");
const Board = require("../models/board.js");
const Teacher = require("../models/teacher.js");
const sequelize = require("../db.js");
const { createTitleGroup } = require("./group.js");
exports.request = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.file);
    const files = req.files;
    const category = req.body.category;
    const description = req.body.description;
    const grpId = req.body.grpId;

    const exam_request = await Exam_requests.create({
      categories: category,
      description: description,
      status: "รอการอนุมัติ",
      groupId: parseInt(grpId),
    });

    files.forEach(async (file) => {
      try {
        const request_file = await Exam_requests_files.create({
          filename: file.filename,
          originalname: Buffer.from(file.originalname, "latin1").toString(
            "utf8"
          ),
          path: file.path,
          examRequestId: exam_request.id,
        });
      } catch (err) {
        console.log(err);
      }
    });
    return res.status(201).json("success");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getRequest = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }

    console.log(req.body);
    const tchId = parseInt(req.body.tchId);
    try {
      const sql = `SELECT exam_requests.*,\`groups\`.title FROM exam_requests 
      INNER JOIN \`groups\` ON exam_requests.groupId = \`groups\`.id 
      INNER JOIN boards ON \`groups\`.id = boards.groupId 
      INNER JOIN teachers ON boards.teacherId = teachers.id 
      WHERE boards.role = 'advisor' AND teachers.id = ${tchId};
    `;
      const getRequest = await sequelize.query(sql);
      console.log(getRequest[0]);
      let resRequest = []
      for (const request of getRequest[0]) {
        console.log(request);
        const files = await Exam_requests_files.findAll({
          where: { examRequestId: parseInt(request.id) },
        });
        const dummy = { ...request, files };
        console.log(dummy);
        console.log(request);
        resRequest.push(dummy)
      }

      return res.status(200).json(resRequest);
    } catch (er) {
      console.log(er);
      return res.status(500).json(er);
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json(er);
  }
};

exports.setStatus = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    console.log(req.body);
    const isApprove = req.body.isApprove;
    const exam_request_id = req.body.id;
    const categories = req.body.categories;
    console.log(isApprove, exam_request_id, categories);
    let statusText = "ไม่อนุมัติการยื่นสอบ " + categories;
    if (isApprove) {
      statusText = "อนุมัติการยื่นสอบ " + categories;
    }
    const exam_request = await Exam_requests.update(
      {
        isApprove: isApprove,
        status: statusText,
      },
      { where: { id: parseInt(exam_request_id) } }
    );
    console.log(exam_request);
    return res.status(200).json(exam_request);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
