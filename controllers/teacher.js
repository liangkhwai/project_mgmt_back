const Teachers = require("../models/teacher");

const checkToken = require("../utils/checkToken");

exports.getList = async (req, res, next) => {
  try {
    const teacher = await Teachers.findAll();
    // console.log(teacher)
    res.status(200).json(teacher);
  } catch {
    res.status(404).json("err");
  }
};
