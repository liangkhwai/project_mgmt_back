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
