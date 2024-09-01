const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");
const { query, validationResult } = require("express-validator");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  [
    query("q").trim().notEmpty().withMessage("Query parameter is required"),
    query("type")
      .isIn(["all", "users", "products"])
      .withMessage("Invalid type"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q, type } = req.query;

    try {
      let userResults = [];
      let productResults = [];

      if (type === "all" || type === "users") {
        userResults = await User.find({
          $or: [
            { username: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
          ],
        });
      }

      if (type === "all" || type === "products") {
        productResults = await Product.find({
          $or: [
            { name: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
          ],
        });
      }

      res.json([...userResults, ...productResults]);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
