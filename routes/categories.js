const express = require("express");

const categoriesController = require("../controllers/categories");
const router = express.Router();

router.get("/list", categoriesController.getList);

router.put("/update",categoriesController.upDate)

router.post("/insert", categoriesController.inSert)

router.post("/delete", categoriesController.deLete)


module.exports = router;
