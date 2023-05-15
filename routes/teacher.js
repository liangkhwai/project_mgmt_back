const express = require("express");

const teacherController = require("../controllers/teacher");
const router = express.Router();

router.get("/list", teacherController.getList);

// router.put("/update", teacherController.upDate);

router.post("/insert", teacherController.inSert);

router.post("/delete", teacherController.deLete);

module.exports = router;
