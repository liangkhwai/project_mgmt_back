const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "upload/files/files" });
const FilesController = require("../controllers/files");
const router = express.Router();

router.post("/fileUplaod",upload.array('files'),FilesController.fileUpload );
router.get("/list",FilesController.getList)
router.post('/delete',FilesController.delete)

module.exports = router;
