const sequelize = require("../db");
const Teachers = require("../models/teacher");

const checkToken = require("../utils/checkToken");
const bcrypt = require('bcrypt')
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

exports.getListRandomAll = async (req,res,next) => {
  try{
    // const token = req.cookies.token;
    // console.log(token);
    // const check = await checkToken(token);
    // if(!check){
    //   res.status(401).json("invalid token or unavalible token");
    // }

    const sql = `SELECT DISTINCT * FROM teachers ORDER BY RAND()`
    const teacher = await sequelize.query(sql)
    console.log(teacher);
    return res.status(200).json(teacher)

  }catch(err){
    return res.status(500).json(err)
  }
}

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
    const color_calendar = req.body.color_calendar
    const line_id = req.body.line_id;

    const pwd = bcrypt.hashSync(tel, 10);
    const new_teacher = await Teachers.create({
      prefix: prefix,
      firstname: firstname,
      lastname: lastname,
      email: email,
      tel: tel,
      pwd:pwd,
      color_calendar : color_calendar,
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
    const color_calendar = req.body.color_calendar
    const line_id = req.body.line_id;

    const teacher = await Teachers.update(
      {
        prefix: prefix,
        firstname: firstname,
        lastname: lastname,
        email: email,
        tel: tel,
        color_calendar : req.body.color_calendar,
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
