const express = require("express");
const formidable = require("express-formidable");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  uploadFile,
  saveOrder,
  getOrder,
  update,
} = require("../controllers/order");

router.post("/uploadfile/:orderType", formidable(), uploadFile);
router.post("/saveorder", saveOrder);
router.get("/getorder/:orderId", getOrder);
router.put("/update-order/:orderId", update);

module.exports = router;
