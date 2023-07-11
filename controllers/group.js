const Categorie_room = require("../models/categorie_room.js");
const Group = require("../models/group.js");
const Researcher = require("../models/researcher.js");
const checkToken = require("../utils/checkToken");
const jwt = require("jsonwebtoken");

exports.create = async (req, res, next) => {
  const token = req.cookies.token;
  const check = await checkToken(token);
  if (!check) {
    res.status(401).json("invalid token or unavalible token");
  }
  const group_list = req.body.group_list;
  const group = await Group.create();

  for (let std of group_list) {
    console.log(std);
    let rsh = await Researcher.update(
      {
        groupId: group.id,
      },
      { where: { id: std.id } }
    );
  }
  console.log("success");
  return res.status(200).json("Success");
};

exports.getGroup = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      res.status(401).json("invalid token or unavalible token");
    }
    const decoded = jwt.verify(token, "soybad");

    const researcher = await Researcher.findOne({
      where: { id: parseInt(decoded.userId) },
    });

    const group = await Group.findOne({ where: { id: researcher.groupId } });
    console.log(group);
    return res.status(200).json(group);
  } catch (err) {
    console.log(err);
    return res.status(501).json(err);
  }
};

exports.getOneGroup = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check)
      return res.status(401).json("invaldi token or unavalible token");
    console.log("Group id :", req.body);
    const groupId = req.body.grpId;
    const group = await Group.findOne({ where: { id: parseInt(groupId) } });
    if (!group) {
      console.log("HIIIIIIIIIIIIIIIIIIIIIIIII");
    }
    return res.status(200).json(group);
  } catch (err) {
    return res.status(501).json(err);
  }
};

exports.getAllGroup = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check)
      return res.status(401).json("invalid token or unavalible token");

    const allGroup = await Group.findAll();

    return res.status(200).json(allGroup);
  } catch (err) {
    return res.status(501).json(err);
  }
};

exports.createTitleGroup = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      return res.status(401).json("invalid token or unavalible token");
    }
    const decodeToken = jwt.verify(token, "soybad");
    const title = req.body.title;

    const researcher = await Researcher.findOne({
      where: { id: parseInt(decodeToken.userId) },
    });

    const group = await Group.update(
      {
        title: title,
      },
      { where: { id: researcher.groupId } }
    );

    return res.status(200).json(group);
  } catch (err) {
    console.log(err);
    return res.status(501).json(err);
  }
};

exports.changeGroupTitle = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      return res.status(401).json("invalid token or unavalible token");
    }

    const grpId = req.body.groupId;
    const title = req.body.title;
    console.log(req.body);
    console.log(grpId);
    console.log(title);
    const group = await Group.update(
      {
        title: title,
      },
      { where: { id: parseInt(grpId) } }
    );

    return res.status(200).json("success");
  } catch (err) {
    return res.status(501).json(err);
  }
};

exports.removeResearcherFromGroup = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      return res.status(401).json("invalid token or unavalible token");
    }

    const userId = req.body.userId;
    console.log(userId);
    const researcher = await Researcher.update(
      {
        groupId: null,
      },
      { where: { id: parseInt(userId) } }
    );
    console.log(researcher);

    const researcherInfo = await Researcher.findOne({
      where: { id: parseInt(userId) },
    });

    return res.status(200).json(researcherInfo);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getGroupMember = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      return res.status(401).json("invalid token or unavalible token");
    }

    const grpId = req.body.grpId;
    console.log(grpId);

    const researcher = await Researcher.findAll({
      where: { groupId: parseInt(grpId) },
      include: Categorie_room,
    });
    console.log(researcher);

    return res.status(200).json(researcher);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.addGroupMember = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      return res.status(401).json("invalid token or unavalible token");
    }
    const userId = req.body.userId;
    const grpId = req.body.grpId;
    console.log(userId,grpId);
    const researcher = await Researcher.update(
      {
        groupId: grpId,
      },
      { where: { id: parseInt(userId) } }
    );

    return res.status(200).json("success");
  } catch (err) {
    return res.status(500).json(err);
  }
};
