const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "upload/" });
const researcherController = require("../controllers/researcher");
const router = express.Router();
router.get("/list", researcherController.getList);

router.put("/update", researcherController.upDate);

router.post("/insert", researcherController.inSert);

router.post(
  "/insertXlsx",
  upload.single("file"),
  researcherController.inSertXlsx
);

router.post("/delete", researcherController.deLete);

router.get("/getOne", researcherController.getOne);
router.post("/getGroupList", researcherController.getGroupList);
module.exports = router;
