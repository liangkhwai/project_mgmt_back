const express = require("express");

const teacherController = require("../controllers/teacher");
const router = express.Router();

router.get('/get/:tchId', teacherController.getTeacherById)

router.get("/list", teacherController.getList);

router.put("/update", teacherController.upDate);

router.post("/insert", teacherController.inSert);

router.post("/delete", teacherController.deLete);

router.get('/list/random',  teacherController.getListRandomAll)
router.put('/update/line', teacherController.upDateLine)
router.post('/line/notify',teacherController.lineNotify)
module.exports = router;


