const express = require("express");
const researcherController = require("../controllers/researcher");
const router = express.Router();

router.get("/list", researcherController.getList);

module.exports = router;
