const Researcher = require("../models/researcher");
const checkToken = require("../utils/checkToken");
const bcrypt = require("bcrypt");
const xlsx = require("xlsx");
const multer = require("multer");
exports.getList = async (req, res, next) => {
  try {
    const researcher = await Researcher.findAll();
    // console.log(researcher);

    res.status(200).json(researcher);
  } catch {
    return res.status(401);
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
    const student_id = req.body.student_id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const tel = req.body.tel;
    const grade = req.body.grade;

    const researcher = await Researcher.update(
      {
        student_id: student_id,
        firstname: firstname,
        lastname: lastname,
        email: email,
        tel: tel,
        grade: grade,
      },
      { where: { id: id } }
    );
    console.log("success");
    return res.status(200).json(researcher);
  } catch {
    return res.status(401);
  }
};

exports.inSert = async (req, res, next) => {
  console.log("hi");
  try {
    const token = req.cookies.token;
    console.log(token);
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    const id = req.body.id;
    const student_id = req.body.student_id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const tel = req.body.tel;
    const grade = req.body.grade;

    Researcher.findOne({ where: { student_id: student_id } }).then(
      async (user) => {
        if (user) {
          return res.status(401).json("User already exits");
        } else {
          const pwd = bcrypt.hashSync(student_id, 10);
          console.log(pwd);
          const researcher = await Researcher.create({
            student_id: student_id,
            firstname: firstname,
            lastname: lastname,
            email: email,
            pwd: pwd,
            tel: tel,
            grade: grade,
          });
          console.log("success");
          console.log("after insert id = ", researcher);
          return res.status(201).json({ id: researcher.id });
        }
      }
    );
  } catch {
    return res.status(401);
  }
};

exports.inSertXlsx = async (req, res, next) => {
  try {
    console.log("xlsx");
    // console.log(req.file);
    const file = await req.file;
    console.log("file = ", file);
    const workbook = await xlsx.readFile(file.path);
    console.log("workbook = ", workbook);
    console.log(workbook.SheetNames[0]);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log("work sheet = ", worksheet);
    data = xlsx.utils.sheet_to_json(worksheet);
    console.log(data);
    res.status(200).json(data);
  } catch {
    res.status(501).json("ERR");
  }
};

exports.deLete = async (req, res, next) => {
  console.log("delete");
  try {
    const token = req.cookies.token;
    console.log(token);
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    const id = req.body.id;
    console.log(id);
    const researcher = await Researcher.findOne({ where: { id: id } });
    researcher.destroy();
    console.log("delete success");
    return res.status(200);
  } catch {
    return res.status(401);
  }
};
