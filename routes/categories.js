const express = require("express");

const categoriesController = require("../controllers/categories");
const router = express.Router();

router.get("/list", categoriesController.getList);

router.put("/update",categoriesController.upDate)

router.post("/insert", categoriesController.inSert)

module.exports = router;
