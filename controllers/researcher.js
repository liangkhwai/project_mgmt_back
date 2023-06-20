const Researcher = require("../models/researcher");
const checkToken = require("../utils/checkToken");
const categories = require("../models/categorie_room");
const bcrypt = require("bcrypt");
const xlsx = require("xlsx");
const multer = require("multer");
const jwt = require("jsonwebtoken");

exports.getOne = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    const check = await checkToken(token);
    if (!check) {
      return res.status(401).json("invalid token or unavalible token");
    }

    const decoded = jwt.verify(token, "soybad");
    const userId = decoded.userId;
    const researcher = await Researcher.findOne({
      where: { id: parseInt(userId) },
      include: categories,
    });
    console.log(researcher);
    return res.status(200).json(researcher);
  } catch (err) {
    console.log("Error is : ", err);
    return res.status(501).json({ message: err });
  }
};

exports.getGroupList = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }

    const decoded = jwt.verify(token, "soybad");
    const userId = decoded.userId;
    const researcher = await Researcher.findOne({
      where: { id: parseInt(userId) },
    });

    const groupList = await Researcher.findAll({
      where: { groupId: researcher.groupId },
    });

    // const researcher = await Researcher.findAll({
    //   where: { groupId: parseInt(gId) },
    // });
    return res.status(200).json({ groupList: groupList });
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: err });
  }
};

exports.getList = async (req, res, next) => {
  try {
    const researcher = await Researcher.findAll({ include: categories });
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
    const categorieRoomId = req.body.categorieRoomId;
    const email = req.body.email;
    const tel = req.body.tel;
    const grade = req.body.grade;

    const researcher = await Researcher.update(
      {
        student_id: student_id,
        firstname: firstname,
        lastname: lastname,
        email: email,
        categorieRoomId: parseInt(categorieRoomId),
        tel: tel,
        grade: grade,
      },
      { where: { id: id } }
    );
    const withRef = await Researcher.findOne({
      where: { id: id },
      include: categories,
    });
    console.log("success");
    return res.status(200).json(withRef);
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
    const categorieRoomId = req.body.categorieRoomId;
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
            categorieRoomId: categorieRoomId,
            pwd: pwd,
            tel: tel,
            grade: grade,
          });
          const withRef = await Researcher.findOne({
            where: { id: researcher.id },
            include: categories,
          });
          // console.log("success");
          // console.log("after insert id = ", researcher);
          return res.status(201).json(withRef);
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
    console.log("yo ", req.body.selector);
    const selector = req.body.selector;
    const file = await req.file;
    // console.log("file = ", file);
    const workbook = await xlsx.readFile(file.path);
    // console.log("workbook = ", workbook);
    // console.log(workbook.SheetNames[0]);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // console.log("work sheet = ", worksheet);
    data = xlsx.utils.sheet_to_json(worksheet);
    let stdList = [];

    for (const rsh of data) {
      let std = await Researcher.create({
        student_id: rsh.STUDENT_NO,
        firstname: rsh.NAME,
        lastname: rsh.LNAME,
        pwd: bcrypt.hashSync(rsh.STUDENT_NO, 10),
        categorieRoomId: parseInt(selector),
      });

      let withRef = await Researcher.findOne({
        where: { id: std.id },
        include: categories,
      });

      stdList.push(withRef);
    }
    // console.log(stdList);
    res.status(200).json({ message: "Insert Success", data: stdList });
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
    await researcher.destroy();
    console.log("delete success");
    return res.status(200).json("delete success");
  } catch {
    return res.status(401);
  }
};
