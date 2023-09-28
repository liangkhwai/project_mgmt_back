const Thesis = require("../models/thesis");
const ThesisFiles = require("../models/thesis_files");
const Group = require("../models/group");

exports.upload = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log(req.file);
    console.log(req.files);

    const theses = await Thesis.create({
      //   filename: req.file.filename,
      //   originalname: Buffer.from(req.file.originalname, "latin1").toString(
      //     "utf8"
      //   ),
      title: req.body.title,
      years: req.body.years,
      abstract: req.body.abstract,
      groupId: parseInt(req.body.grpId),
    });

    console.log(theses);

    const thesisFiles = await ThesisFiles.create({
      filename: req.file.filename,
      originalname: Buffer.from(req.file.originalname, "latin1").toString(
        "utf8"
      ),
      path: req.file.path,
      thesisId: theses.id,
    });

    const group = await Group.update(
      {
        status: "ส่งปริญญานิพนธ์แล้ว",
      },
      {
        where: {
          id: parseInt(req.body.grpId),
        },
      }
    );

    return res.status(200).json("success");
  } catch (er) {
    console.log(er);
    return res.status(500).json(er);
  }
};

exports.getThesis = async (req, res, next) => {
  try {
    const grpId = req.params.grpId;
    console.log(grpId);
    const thesis = await Thesis.findOne({
      where: { groupId: parseInt(grpId) },
      include: ThesisFiles,
    });

    return res.status(200).json(thesis);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.getAllTheses = async (req, res, next) => {
  try {
    const sql =
      "SELECT g.*,CONCAT(a_teacher.firstname, ' ', a_teacher.lastname) AS advisor_name, CONCAT(b1_teacher.firstname, ' ', b1_teacher.lastname) AS board1_name,CONCAT(b2_teacher.firstname, ' ', b2_teacher.lastname) AS board2_name,GROUP_CONCAT(DISTINCT CONCAT(r.firstname, ' ', r.lastname) SEPARATOR ', ') AS researchers_names,tf.filename FROM theses AS g LEFT JOIN boards AS a ON g.groupId = a.groupId AND a.role = 'advisor' LEFT JOIN teachers AS a_teacher ON a.teacherId = a_teacher.id LEFT JOIN boards AS b1 ON g.groupId = b1.groupId AND b1.role = 'board1' LEFT JOIN teachers AS b1_teacher ON b1.teacherId = b1_teacher.id LEFT JOIN boards AS b2 ON g.groupId = b2.groupId AND b2.role = 'board2' LEFT JOIN teachers AS b2_teacher ON b2.teacherId = b2_teacher.id LEFT JOIN researchers AS r ON r.groupId = g.groupId LEFT JOIN thesis_files AS tf ON tf.thesisId = g.id GROUP BY g.id, g.title, g.createdAt, g.updatedAt, advisor_name, board1_name, board2_name, tf.filename;";
    const theses = await Thesis.sequelize.query(sql, {
      type: Thesis.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json(theses);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
