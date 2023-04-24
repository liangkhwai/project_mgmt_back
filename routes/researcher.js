const express = require("express");
const researcherController = require("../controllers/researcher");
const router = express.Router();

router.get("/list", researcherController.getList);


router.put("/update",researcherController.upDate)


router.post('/insert',researcherController.inSert)


router.post('/delete',researcherController.deLete)


module.exports = router;
