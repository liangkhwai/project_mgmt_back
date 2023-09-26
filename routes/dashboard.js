const express = require("express");

const dashboardController = require("../controllers/dashboard");
const router = express.Router();

router.get("/list", dashboardController.list);

module.exports = router;
