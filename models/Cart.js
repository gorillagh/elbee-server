const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    cartType: {
      type: String,
      required: true,
    },
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

module.exports = mongoose.model("Cart", cartSchema);