const Teacher = require("../models/teacher");
const Group = require("../models/group");
const Board = require("../models/board");
const checkToken = require("../utils/checkToken");
const sequelize = require("../db");
exports.addRandom = async (req, res, next) => {
  try {
    const grpData = req.body.grpData;
    console.log(grpData);
    console.log(grpData.length);
    for (const grp of grpData) {
      console.log(grp);
      let grpId = grp.id;
      let advisorId = grp.boards.advisor.id;
      let board1 = grp.boards.board1.id;
      let board2 = grp.boards.board2.id;

      try {
        let advisor = await Board.create({
          role: grp.boards.advisor.role,
          groupId: parseInt(grpId),
          teacherId: parseInt(advisorId),
        })
          .then(async () => {
            let board11 = await Board.create({
              role: grp.boards.board1.role,
              groupId: parseInt(grpId),
              teacherId: parseInt(board1),
            });
          })
          .then(async () => {
            let board22 = await Board.create({
              role: grp.boards.board2.role,
              groupId: parseInt(grpId),
              teacherId: parseInt(board2),
            });
          });
        console.log("end loop");
      } catch (err) {
        console.log(err);
        return res.status(502).json(err);
      }
    }

    return res.status(200).json(":)");
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getList = async (req, res, next) => {
  try {
    const grpId = req.params.grpId;
    console.log(grpId);
    console.log("Params is : ", grpId);

    const sql = `SELECT boards.*, teachers.*
      FROM project_mgmt.boards
      INNER JOIN teachers ON boards.teacherId = teachers.id
      WHERE groupId = ${parseInt(grpId)}
      ORDER BY 
        CASE WHEN boards.role = 'advisor' THEN 1
             WHEN boards.role = 'board1' THEN 2
             WHEN boards.role = 'board2' THEN 3
             ELSE 4
        END;
      `;

    const boardList = await sequelize.query(sql);

    console.log(boardList);
    return res.status(200).json(boardList[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
