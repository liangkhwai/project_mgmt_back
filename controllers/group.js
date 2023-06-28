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

exports.getAllGroup = async(req,res,next)=>{
  try{
    const token = req.cookies.token;
    const check = await checkToken(token)
    if(!check) return res.status(401).json("invalid token or unavalible token")

    const allGroup = await Group.findAll()

    return res.status(200).json(allGroup)

  }catch(err){
    return res.status(501).json(err)
  }
}


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
