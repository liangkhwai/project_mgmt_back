const express = require("express");

const groupController = require("../controllers/group");
const router = express.Router();

router.post("/create", groupController.create);

router.get("/getGroup", groupController.getGroup)

router.post("/createTitleGroup", groupController.createTitleGroup)

router.get("/getAllGroup",groupController.getAllGroup)

router.post("/getOneGroup", groupController.getOneGroup)

router.post("/getGroupMember", groupController.getGroupMember)
router.put("/removeFromGroup",groupController.removeResearcherFromGroup)

router.put('/changeGroupTitle',groupController.changeGroupTitle)
router.put('/addGroupMember',groupController.addGroupMember)
router.post('/removeGroup',groupController.removeGroup)
module.exports = router;
