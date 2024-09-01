const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Ruta de registro
router.post(
  "/register",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email")
      .isEmail()
      .withMessage("Invalid email")
      .custom(async (email) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("Email already in use");
        }
      }),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({ token });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      res.status(500).json({ message: "Error al registrar el usuario" });
    }
  }
);

// Ruta de actualización de perfil
router.put("/update", authMiddleware, async (req, res) => {
  const { username, email, biography } = req.body;

  try {
    console.log("Actualizando perfil para el usuario:", req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.biography = biography || user.biography;

    await user.save();

    const updatedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      biography: user.biography,
    };

    console.log("Perfil actualizado:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el perfil", error: error.message });
  }
});

// Ruta para cambiar la contraseña
router.put("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    // Actualizar la contraseña del usuario
    user.password = newPassword; // Esto activará el middleware pre-save
    await user.save();

    console.log("Contraseña actualizada con éxito");
    res.json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("Error detallado al cambiar la contraseña:", error);
    res.status(500).json({
      message: "Error al cambiar la contraseña",
      error: error.message,
    });
  }
});

// Ruta de inicio de sesión
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Credenciales inválidas" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Credenciales inválidas" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token, userId: user._id });
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  }
);

// Ruta para obtener el perfil del usuario
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

module.exports = router;
