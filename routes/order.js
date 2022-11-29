const express = require("express");
const formidable = require("express-formidable");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { uploadFile } = require("../controllers/order");

router.post("/uploadfile/:orderType", formidable(), uploadFile);

module.exports = router;
