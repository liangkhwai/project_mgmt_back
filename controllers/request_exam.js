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
const { Sequelize } = require("sequelize");
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
      return res.status(401).json("invalid token or unavailable token");
    }

    const tchId = parseInt(req.body.tchId);
    const sql = `
      SELECT exam_requests.*, \`groups\`.title 
      FROM exam_requests 
      INNER JOIN \`groups\` ON exam_requests.groupId = \`groups\`.id 
      INNER JOIN boards ON \`groups\`.id = boards.groupId 
      INNER JOIN teachers ON boards.teacherId = teachers.id 
      WHERE boards.role = 'advisor' AND teachers.id = :tchId;
    `;

    try {
      const getRequest = await sequelize.query(sql, {
        replacements: { tchId },
        type: sequelize.QueryTypes.SELECT,
      });

      const requestsWithFiles = await Promise.all(
        getRequest.map(async (request) => {
          const files = await Exam_requests_files.findAll({
            where: { examRequestId: request.id },
          });
          return { ...request, files };
        })
      );

      return res.status(200).json(requestsWithFiles);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// NOT OPTIMIZE
// exports.getRequest = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     const check = await checkToken(token);
//     if (!check) {
//       res.status(401).json("invalid token or unavalible token");
//     }

//     console.log(req.body);
//     const tchId = parseInt(req.body.tchId);
//     try {
//       const sql = `SELECT exam_requests.*,\`groups\`.title FROM exam_requests
//       INNER JOIN \`groups\` ON exam_requests.groupId = \`groups\`.id
//       INNER JOIN boards ON \`groups\`.id = boards.groupId
//       INNER JOIN teachers ON boards.teacherId = teachers.id
//       WHERE boards.role = 'advisor' AND teachers.id = ${tchId};
//     `;
//       const getRequest = await sequelize.query(sql);
//       console.log(getRequest[0]);
//       let resRequest = [];
//       for (const request of getRequest[0]) {
//         console.log(request);
//         const files = await Exam_requests_files.findAll({
//           where: { examRequestId: parseInt(request.id) },
//         });
//         const dummy = { ...request, files };
//         console.log(dummy);
//         console.log(request);
//         resRequest.push(dummy);
//       }

//       return res.status(200).json(resRequest);
//     } catch (er) {
//       console.log(er);
//       return res.status(500).json(er);
//     }
//   } catch (er) {
//     console.log(er);
//     return res.status(500).json(er);
//   }
// };

exports.getRequestGroup = async (req, res, next) => {
  try {
    const grpId = req.params.grpId;

    const requestList = await Exam_requests.findAll({
      where: { groupId: parseInt(grpId) },
    });

    console.log(requestList);
    return res.status(200).json(requestList);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.setStatus = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    const isApprove = req.body.isApprove;
    const exam_request_data = req.body.item;
    const categories = req.body.categories;
    console.log(isApprove, exam_request_data, categories);
    let statusText = "ไม่อนุมัติการยื่นสอบ";
    if (isApprove) {
      statusText = "อนุมัติการยื่นสอบ";
      const group = await Group.update(
        {
          status: categories,
        },
        {
          where: { id: parseInt(exam_request_data.groupId) },
        }
      );
    }
    const exam_request = await Exam_requests.update(
      {
        isApprove: isApprove,
        status: statusText,
      },
      { where: { id: parseInt(exam_request_data.id) } }
    );

    const requestExam = await Exam_requests.findOne({
      where: { id: parseInt(exam_request_data.id) },
    });
    const files = await Exam_requests_files.findAll({
      where: { examRequestId: parseInt(exam_request_data.id) },
    });
    let exam_update = { ...requestExam.dataValues, files };
    const grpFind = await Group.findOne({
      where: { id: parseInt(requestExam.groupId) },
      attributes: ["title"],
    });
    console.log(grpFind);
    exam_update = { ...exam_update, ...grpFind.dataValues };
    console.log(exam_update);
    return res.status(200).json(exam_update);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getLastRequest = async (req, res) => {
  try {
    const grpId = req.params.grpId;

    const sql = `SELECT * FROM exam_requests WHERE groupId = ${grpId} ORDER BY exam_requests.id DESC LIMIT 1 `; // อย่าลืมเพิ่ม INNER JOIN ของ booking  กับ result

    const result = await sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });
    if (result.length === 0) return res.status(200).json();

    return res.status(200).json(result[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
