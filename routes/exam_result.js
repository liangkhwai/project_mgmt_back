const express = require("express");

const resultController = require("../controllers/exam_result");
const router = express.Router();

router.get("/list", resultController.getList);

router.post('/submit', resultController.submitResult)
module.exports = router;
