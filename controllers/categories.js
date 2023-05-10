const Categories = require("../models/categorie_room");
const checkToken = require("../utils/checkToken");

exports.getList = async (req, res, next) => {
  try {
    const allRoom = await Categories.findAll();
    res.status(200).json(allRoom);
  } catch {
    return res.status(401);
  }
};

exports.upDate = async (req, res, next) => {
  try {
    console.log('hello update')
    const token = req.cookies.token;
    console.log(token);
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    console.log(check)
    console.log(req.body);
    const id = req.body.id;
    console.log(typeof id)
    const room = req.body.room;
    const type = req.body.type;
    const year = req.body.year;

    const Categorie = await Categories.update(
      {
        room: room,
        type: type,
        year: year,
      },
      { where: { id: id } }
    );
    console.log('update success')
    const withRef = await Categories.findOne({
      where: { id: id },
    });
    console.log("update success");
    return res.status(200).json(withRef);
  } catch {
    return res.status(401);
  }
};
