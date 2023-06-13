const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    orderType: {
      type: String,
      required: true,
    },
    receiverEmail: String,
    paymentMethod: String,
    notes: String,
    paid: {
      type: Boolean,
      default: false,
      required: true,
    },
    userId: { type: ObjectId, ref: "User" },
    files: [],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
