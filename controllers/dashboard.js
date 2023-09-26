const Group = require("../models/group");
const researcher = require("../models/researcher");
const Thesis = require("../models/thesis");
const Files = require("../models/files");
exports.list = async (req, res, next) => {
  try {
    result = [];
    const group = await Group.findAll();
    result = { ...result, countGroup: group.length };
    const resercher = await researcher.findAll();
    result = { ...result, countResearcher: resercher.length };
    const thesis = await Thesis.findAll();
    result = { ...result, countThesis: thesis.length };
    const files = await Files.findAll();
    result = { ...result, countFiles: files.length };
    const researcherWithStatusInGroup = await researcher.findAll({
      include: [
        {
          model: Group,
          where: { status: "ส่งปริญญานิพนธ์แล้ว" },
        },
      ],
    });
    result = {
      ...result,
      countResearcherWithStatusInGroup: researcherWithStatusInGroup.length,
    };

    const sqlCountStatus =
      "SELECT COALESCE(COUNT(g.status), 0) AS count FROM ( SELECT 'ยังไม่ยื่นสอบหัวข้อ' AS status UNION ALL SELECT 'สอบหัวข้อ' UNION ALL SELECT 'ยังไม่ยื่นสอบก้าวหน้า' UNION ALL SELECT 'สอบก้าวหน้า' UNION ALL SELECT 'ยังไม่ยื่นสอบป้องกัน' UNION ALL SELECT 'สอบป้องกัน') AS s LEFT JOIN project_mgmt.groups AS g ON s.status = g.status GROUP BY s.status;";
    const countStatus = await Group.sequelize.query(sqlCountStatus, {
      type: Group.sequelize.QueryTypes.SELECT,
    });
    result = { ...result, countStatus: countStatus.map((item) => item.count) };

    const sqlCountAdvisor =
      "SELECT firstname,lastname,tel, COALESCE(COUNT(boards.id), 0) AS advisor_count FROM teachers LEFT JOIN boards ON teachers.id = boards.teacherId AND boards.role = 'advisor' GROUP BY teachers.id";
    const countAdvisor = await Group.sequelize.query(sqlCountAdvisor, {
      type: Group.sequelize.QueryTypes.SELECT,
    });
    result = {
      ...result,
      countAdvisor: countAdvisor,
    };

    const sqlGroupWithBoards =
      "SELECT g.*,CONCAT(a_teacher.firstname, ' ', a_teacher.lastname) AS advisor_name, CONCAT(b1_teacher.firstname, ' ', b1_teacher.lastname) AS board1_name, CONCAT(b2_teacher.firstname, ' ', b2_teacher.lastname) AS board2_name,COUNT(rsh.id) AS researcher_count FROM `groups` AS g LEFT JOIN boards AS a ON g.id = a.groupId AND a.role = 'advisor' LEFT JOIN teachers AS a_teacher ON a.teacherId = a_teacher.id LEFT JOIN boards AS b1 ON g.id = b1.groupId AND b1.role = 'board1' LEFT JOIN teachers AS b1_teacher ON b1.teacherId = b1_teacher.id LEFT JOIN boards AS b2 ON g.id = b2.groupId AND b2.role = 'board2' LEFT JOIN teachers AS b2_teacher ON b2.teacherId = b2_teacher.id LEFT JOIN researchers AS rsh ON rsh.groupId = g.id GROUP BY g.id, g.title, g.status, g.createdAt, g.updatedAt, g.leaderId, advisor_name, board1_name, board2_name;";

    const groupWithBoards = await Group.sequelize.query(sqlGroupWithBoards, {
      type: Group.sequelize.QueryTypes.SELECT,
    });
    result = {
      ...result,
      groupWithBoards: groupWithBoards,
    };

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
};
