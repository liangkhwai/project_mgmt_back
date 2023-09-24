const express = require("express");

const thesisController = require("../controllers/thesis");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "upload/files/thesis" });
router.post("/upload", upload.single('file'), thesisController.upload);
module.exports = router;
