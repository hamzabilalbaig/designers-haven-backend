const express = require("express");
const multer = require("multer");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadController.uploadFile);

module.exports = router;
