const Categories = require("../models/categorie_room");
exports.getList = async (req, res, next) => {
  try {
    const allRoom = await Categories.findAll();
    res.status(200).json(allRoom);
  } catch {
    return res.status(401);
  }
};
