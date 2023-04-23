const express = require("express");
const researcherController = require("../controllers/researcher");
const router = express.Router();

router.get("/list", researcherController.getList);


router.put("/update",researcherController.upDate)


module.exports = router;
