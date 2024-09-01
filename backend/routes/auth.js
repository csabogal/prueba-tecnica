const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Ruta de registro
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Datos recibidos:", { username, email, password });

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("El usuario ya existe:", existingUser);
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear un nuevo usuario
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Crear un token JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Usuario registrado con éxito:", newUser);

    res.status(201).json({ token });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

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

    // Hashear la nueva contraseña manualmente
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar la contraseña del usuario
    user.password = hashedPassword;
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
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Generar el token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Devolver el token al cliente
    res.json({ token });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

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
