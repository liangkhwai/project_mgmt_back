const Researcher = require("../models/researcher");
const checkToken = require("../utils/checkToken");
exports.getList = async (req, res, next) => {
  try {
    const researcher = await Researcher.findAll();
    console.log(researcher);

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

    const researcher = await Researcher.create(
      {
        student_id: student_id,
        firstname: firstname,
        lastname: lastname,
        email: email,
        tel: tel,
        grade: grade,
      }
    );
    console.log("success");
    return res.status(200).json(researcher);
  } catch {
    return res.status(401);
  }
};
