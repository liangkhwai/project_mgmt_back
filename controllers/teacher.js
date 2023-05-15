const Teachers = require("../models/teacher");

const checkToken = require("../utils/checkToken");

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
    const line_id = req.body.line_id;

    const new_teacher = await Teachers.create({
      prefix: prefix,
      firstname: firstname,
      lastname: lastname,
      email: email,
      tel: tel,
      line_id: line_id,
    });

    const withRef = await Teachers.findOne({ where: { id: new_teacher.id } });
    return res.status(201).json(withRef);
  } catch {
    res.status(501).json("err");
  }
};
