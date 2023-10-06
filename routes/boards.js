const express = require("express");

const boardController = require("../controllers/board");
const router = express.Router();

router.post("/add/random", boardController.addRandom);
router.post('/add/random/manual', boardController.addRandomManual);
router.get("/get/:grpId", boardController.getList);
router.put("/updateBoard", boardController.updateBoard);
router.get('/info',boardController.getInfo)
module.exports = router;
