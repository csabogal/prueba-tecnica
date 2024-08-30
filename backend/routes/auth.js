const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

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
    const token = jwt.sign({ userId: newUser._id }, "secret_key", {
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
router.put("/update", async (req, res) => {
  const { userId, username, email, password } = req.body;

  console.log("Datos recibidos para actualización:", {
    userId,
    username,
    email,
    password,
  });

  try {
    // Verificar si el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar los datos del usuario
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    console.log("Perfil actualizado con éxito:", user);
    res.status(200).json({ message: "Perfil actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: "Error al actualizar el perfil" });
  }
});

module.exports = router;
