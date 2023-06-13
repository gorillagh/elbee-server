const express = require("express");
const formidable = require("express-formidable");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { createPaymentIntent } = require("../controllers/stripe");

router.post("/create-payment-intent/:orderId", createPaymentIntent);

module.exports = router;
