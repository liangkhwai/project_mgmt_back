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
    const header = req.headers.authorization;
    const token = header.split(" ")[1] ? header.split(" ")[1] : null;
    console.log(token);
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    console.log(check);
    console.log(req.body);
    const id = req.body.id;
    console.log(typeof id);
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
    console.log("update success");
    const withRef = await Categories.findOne({
      where: { id: id },
    });
    console.log("update success");
    return res.status(200).json(withRef);
  } catch {
    return res.status(401);
  }
};

exports.inSert = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1] ? header.split(" ")[1] : null;
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    console.log("pass check");
    console.log(req.body);
    const room = req.body.room;
    const type = req.body.type;
    const year = req.body.year;

    const Categorie = await Categories.create({
      room: room,
      type: type,
      year: year,
    });

    const data = await Categories.findOne({ where: { id: Categorie.id } });

    return res.status(201).json(data);
  } catch {
    console.log("err");
    return res.status(501).json("Error to created");
  }
};

exports.deLete = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.split(" ")[1] ? header.split(" ")[1] : null;
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }

    const id = req.body.id;

    const data = await Categories.destroy({ where: { id: id } });

    return res.status(200).json(id);
  } catch {
    return res.status(501).json("err");
  }
};
