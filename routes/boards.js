const express = require("express");

const boardController = require("../controllers/board");
const router = express.Router();

router.post("/add/random", boardController.addRandom);

module.exports = router;
