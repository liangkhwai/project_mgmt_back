const Group = require("../models/group.js");
const Researcher = require("../models/researcher.js");
const checkToken = require("../utils/checkToken");

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
