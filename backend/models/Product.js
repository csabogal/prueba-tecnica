const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
});

module.exports = mongoose.model("Product", ProductSchema);
