const express = require("express");

const groupController = require("../controllers/group");
const router = express.Router();

router.post("/create", groupController.create);

router.get("/getGroup", groupController.getGroup)

router.post("/createTitleGroup", groupController.createTitleGroup)

router.get("/getAllGroup",groupController.getAllGroup)
module.exports = router;
