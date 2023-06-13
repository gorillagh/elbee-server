const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ id: orderId }).populate("userId").exec();
  console.log(order);
  //later apply coupon
  //later calculate price
  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.total * 100,
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
