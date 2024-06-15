const Group = require("../models/group.js");
const Exam_requests = require("../models/exam_requests.js");
const Files = require("../models/files.js");
const checkToken = require("../utils/checkToken");
const jwt = require("jsonwebtoken");

exports.getList = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1] ? header.split(" ")[1] : null;
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    const files = await Files.findAll();

    return res.status(200).json(files);
  } catch (e) {
    console.log(e);
    return res.status(501).send(e);
  }
};

exports.fileUpload = async (req, res, next) => {
  try {
    const files = req.files;
    let fileLists = [];
    for (const file of files) {
      try {
        let files = await Files.create({
          filename: file.filename,
          originalname: Buffer.from(file.originalname, "latin1").toString(
            "utf8"
          ),
          path: file.path,
        });
        let fileRef = await Files.findOne({
          where: { id: files.id },
        });

        fileLists.push(fileRef);
      } catch (err) {
        console.log(err);
      }
    }
    console.log(fileLists);
    console.log("success");
    return res.status(200).json(fileLists);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1] ? header.split(" ")[1] : null;
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    const id = req.body.id;

    const file = await Files.destroy({ where: { id: parseInt(id) } });

    return res.status(200).json(id);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};
