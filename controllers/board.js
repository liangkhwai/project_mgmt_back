const Teacher = require("../models/teacher");
const Group = require("../models/group");
const Board = require("../models/board");
const checkToken = require("../utils/checkToken");
const sequelize = require("../db");
// exports.addRandom = async (req, res, next) => {
//   try {
//     const grpData = req.body.grpData;
//     console.log(grpData);
//     console.log(grpData.length);
//     for (const grp of grpData) {
//       console.log(grp);
//       let grpId = grp.id;
//       let advisorId = grp.boards.advisor.id;
//       let board1 = grp.boards.board1.id;
//       let board2 = grp.boards.board2.id;

//       try {
//         let advisor = await Board.create({
//           role: grp.boards.advisor.role,
//           groupId: parseInt(grpId),
//           teacherId: parseInt(advisorId),
//         })
//           .then(async () => {
//             let board11 = await Board.create({
//               role: grp.boards.board1.role,
//               groupId: parseInt(grpId),
//               teacherId: parseInt(board1),
//             });
//           })
//           .then(async () => {
//             let board22 = await Board.create({
//               role: grp.boards.board2.role,
//               groupId: parseInt(grpId),
//               teacherId: parseInt(board2),
//             });
//           });
//         console.log("end loop");
//       } catch (err) {
//         console.log(err);
//         return res.status(502).json(err);
//       }
//     }

//     return res.status(200).json(":)");
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// };

exports.addRandom = async (req, res, next) => {
  const { grpData } = req.body;

  try {
    // Start a transaction
    await sequelize.transaction(async (t) => {
      for (const grp of grpData) {
        const grpId = grp.id;
        const advisorId = grp.boards.advisor.id;
        const board1Id = grp.boards.board1.id;
        const board2Id = grp.boards.board2.id;

        // Create advisor
        await Board.create(
          {
            role: grp.boards.advisor.role,
            groupId: parseInt(grpId),
            teacherId: parseInt(advisorId),
          },
          { transaction: t }
        );

        // Create board1
        await Board.create(
          {
            role: grp.boards.board1.role,
            groupId: parseInt(grpId),
            teacherId: parseInt(board1Id),
          },
          { transaction: t }
        );

        // Create board2
        await Board.create(
          {
            role: grp.boards.board2.role,
            groupId: parseInt(grpId),
            teacherId: parseInt(board2Id),
          },
          { transaction: t }
        );
      }
    });

    return res.status(200).json(":)");
  } catch (err) {
    console.log(err);
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

    console.log("data is ", boardList);
    return res.status(200).json(boardList[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.updateBoard = async (req, res, next) => {
  try {
    const editBoard = req.body.updatedBoard;
    const grpId = req.body.grpId;
    console.log(grpId);

    await Board.destroy({
      where: { groupId: parseInt(grpId) },
    });
    try {
      for (let board of editBoard) {
        await Board.create({
          role: board.role,
          groupId: board.groupId,
          teacherId: board.teacherId,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(501).json(err);
    }

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
    const updatedBoard = await sequelize.query(sql);
    console.log(updatedBoard[0]);
    return res.status(200).json(updatedBoard[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
