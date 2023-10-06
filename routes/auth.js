const express = require("express");

const authController = require("../controllers/auth");
const router = express.Router();

router.post("/login", authController.login);

router.post("/loginTch", authController.loginTch);

router.get("/check", authController.check);

router.get("/logout", authController.logout);

router.get("/check/role", authController.checkRole);
router.post("/change/password", authController.changePassword);

module.exports = router;
