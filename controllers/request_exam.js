const Group = require("../models/group.js");
const Exam_requests = require("../models/exam_requests.js");
const Exam_requests_files = require("../models/exam_requests_files.js");
const checkToken = require("../utils/checkToken");
const jwt = require("jsonwebtoken");

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
          filename:file.filename,
          originalname: file.originalname,
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
