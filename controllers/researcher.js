const Researcher = require("../models/researcher");

exports.getList = async (req, res, next) => {
  const researcher = await Researcher.findAll();
  console.log(researcher);
  res.status(200).json({
    researcher: researcher,
  });
};
