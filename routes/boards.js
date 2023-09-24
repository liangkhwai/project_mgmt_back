const express = require("express");

const boardController = require("../controllers/board");
const router = express.Router();

router.post("/add/random", boardController.addRandom);
router.get("/get/:grpId", boardController.getList);
router.put("/updateBoard", boardController.updateBoard);
module.exports = router;
