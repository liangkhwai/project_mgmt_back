const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "upload/files/requestExam" });
const requestExamController = require("../controllers/request_exam");
const router = express.Router();

router.post("/request",upload.array('files'),requestExamController.request );



module.exports = router;
