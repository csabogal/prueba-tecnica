const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  quantity: { type: Number, default: 0 },
  // Otros campos que puedas tener
});

module.exports = mongoose.model("Product", ProductSchema);
