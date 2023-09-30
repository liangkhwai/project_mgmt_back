const Board = require("../models/board.js");
const Categorie_room = require("../models/categorie_room.js");
const Group = require("../models/group.js");
const Researcher = require("../models/researcher.js");
const checkToken = require("../utils/checkToken");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const sequelize = require("../db.js");
// const { Op } = require('sequelize/lib/operators');

exports.create = async (req, res, next) => {
  const token = req.cookies.token;
  const check = await checkToken(token);
  if (!check) {
    res.status(401).json("invalid token or unavalible token");
  }
  const group_list = req.body.group_list;
  const decodeToken = jwt.verify(token, "soybad");
  const group = await Group.create({
    leaderId: parseInt(decodeToken.userId),
  });

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
  return res.status(200).json(group.id);
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
    console.log(req.body.grpId);
    console.log("GRPID = : : " + grpId);

    const researcher = await Researcher.findAll({
      where: { groupId: parseInt(grpId) },
      include: Categorie_room,
    });
    // console.log("รายชื่อ " + researcher);

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
    console.log("hio");
    console.log("key body for add group", userId, grpId);
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

exports.removeGroup = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const check = await checkToken(token);
    if (!check) {
      return res.status(401).json("invalid token or unavalible token");
    }
    const grpId = req.body.grpId;

    try {
      const groupDes = await Group.destroy({ where: { id: parseInt(grpId) } });
      return res.status(200).json(parseInt(grpId));
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        error: "Failed to delete the group. It is referenced by other records.",
      });
    }

    // return res.status(200).json(parseInt(grpId));
  } catch (err) {
    return res.status(501).json();
  }
};

exports.getAllGroupNoRandom = async (req, res, next) => {
  try {
    try {
      const sql =
        "SELECT * FROM `groups` AS `group` WHERE `group`.`id` NOT IN (SELECT groupId FROM boards);";
      const group = await sequelize.query(sql);
      console.log(group.length);
      console.log(group[0]);
      return res.status(200).json(group[0]);
    } catch (err) {
      console.log(err);
    }

    console.log(group);

    return res.status(200).json(group);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.changeLeaderGroup = async (req, res, next) => {
  try {
    const rshId = req.body.rshId;
    const grpId = req.body.grpId;
    console.log(rshId, grpId);
    const group = await Group.update(
      {
        leaderId: parseInt(rshId),
      },
      {
        where: { id: parseInt(grpId) },
      }
    );

    const updatedGroup = await Group.findOne({
      where: { id: parseInt(grpId) },
    });
    const refreshGroupMember = await Researcher.findAll({
      where: { groupId: parseInt(grpId) },
      include: Categorie_room,
    });
    console.log(updatedGroup);
    console.log(refreshGroupMember);

    console.log("success");
    return res.status(200).json({ updatedGroup, refreshGroupMember });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.updateGroupInCompleteMember = async (req, res, next) => {
  try {
    const grpId = req.body.grpId;
    console.log(grpId);
    try {
      const fetchMember = await Researcher.update(
        {
          isLate: true,
        },
        {
          where: { groupId: parseInt(grpId) },
        }
      );
    } catch (er) {
      console.log(er);
    }

    console.log("success");
    return res.status(200).json("success");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
