const express = require("express");

const dashboardController = require("../controllers/dashboard");
const router = express.Router();

router.get("/list", dashboardController.list);
router.get('/list/:roomId',dashboardController.listRoom)

module.exports = router;
