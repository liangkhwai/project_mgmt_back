const Researcher = require("../models/researcher");
const checkToken = require("../utils/checkToken");
const categories = require("../models/categorie_room");
const bcrypt = require("bcrypt");
const xlsx = require("xlsx");
// const multer = require("multer");
const jwt = require("jsonwebtoken");
// const Admin = require("../models/admin");
const sequelize = require("../db");
const Categorie_room = require("../models/categorie_room");
const Group = require("../models/group");

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
    const role = decoded.role;
    console.log("Role :", role);
    if (role === "admin" || role === "teacher") {
      return res.status(401).json(null);
      // const admin = Admin.findOne({where:{id:parseInt(userId)}})
      // return res.status(200).json(admin)
    }
    const researcher = await Researcher.findOne({
      where: { id: parseInt(userId) },
      include: categories,
    });
    // console.log(researcher);
    return res.status(200).json(researcher);
  } catch (err) {
    console.log("Error is : ", err);
    return res.status(501).json({ message: err });
  }
};

// exports.getGroupList = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     console.log(token);
//     const check = await checkToken(token);
//     if (!check) {
//       res.status(401).json("invalid token or unavalible token");
//     }
//     const decoded = jwt.verify(token, "soybad");
//     const userId = decoded.userId;
//     const role = decoded.role;
//     console.log("userID : ", userId);
//     if (role === "admin" && role === "teacher")
//       return res.status(401).json(null);
//     const researcher = await Researcher.findOne({
//       where: { id: parseInt(userId) },
//     });

//     if (researcher.groupId === null) {
//       return res.status(401).json("null");
//     }

//     let groupList = await Researcher.findAll({
//       where: { groupId: researcher.groupId },
//       include: categories,
//     });

//     // const researcher = await Researcher.findAll({
//     //   where: { groupId: parseInt(gId) },
//     // });
//     return res.status(200).json({ groupList: groupList });
//   } catch (err) {
//     console.log(err);
//     res.status(501).json({ message: err });
//   }
// };

exports.getGroupList = async (req, res, next) => {
  try {
    const grpId = req.params.grpId;
    console.log(grpId);
    const groupMember = await Researcher.findAll({
      where: { groupId: parseInt(grpId) },
      include: categories,
    });
    console.log(groupMember);
    return res.status(200).json(groupMember);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getList = async (req, res, next) => {
  try {
    // const researcher = await Researcher.findAll({
    //   include: [{ model: Categorie_room ,require: false }, { model: Group , require: false }],
    // });
    const researcher = await Researcher.findAll({
      include: [Categorie_room, Group],
    });
    // console.log(researcher);
    return res.status(200).json(researcher);
  } catch {
    return res.status(401);
  }
};
exports.getListt = async (req, res, next) => {
  try {
    const sql = `SELECT *
    FROM researchers
    LEFT JOIN categorie_rooms ON researchers.id = categorie_rooms.id
    LEFT JOIN \`groups\` ON researchers.groupId = \`groups\`.id;
    `;
    const researcher = await sequelize.query(sql);

    return res.status(200).json(researcher[0]);
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
    const isLate = req.body.isLate;
    const waitRegister = req.body.waitRegister;
    const isActive = req.body.isActive;
    const term = req.body.term;
    const grade_project = req.body.grade_project;
    const isEditGradeProject = req.body.isEditGradeProject;

    const researcher = await Researcher.update(
      {
        student_id: student_id,
        firstname: firstname,
        lastname: lastname,
        email: email,
        categorieRoomId: parseInt(categorieRoomId),
        tel: tel,
        grade: grade,
        isLate: isLate,
        waitRegister: waitRegister,
        isActive: isActive,
        term: term,
        grade_project: grade_project,
        isEditGradeProject: isEditGradeProject,
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
    console.log("id researcher : ", researcher.groupId);
    if (researcher.groupId) {
      return res.status(500).json("ไม่สามารถลบได้เนื่องจากผู้วิจัยอยู่ในกลุ่ม");
    }
    await researcher.destroy();

    console.log("delete success");
    return res.status(200).json("delete success");
  } catch {
    return res.status(401);
  }
};

exports.updateGradeProject = async (req, res, next) => {
  try {
    const gradeProject = req.body.gradeProject;
    const rshId = req.body.rshId;
    const researcher = await Researcher.update(
      {
        grade_project: gradeProject,
        isEditGradeProject: true,
      },
      { where: { id: parseInt(rshId) } }
    );

    return res.status(200).json("success");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
