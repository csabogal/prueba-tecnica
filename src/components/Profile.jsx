import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simula la obtención de datos del usuario desde el backend
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (
          parsedUser &&
          parsedUser.username &&
          parsedUser.email &&
          parsedUser.password
        ) {
          setUser(parsedUser);
          console.log(
            "Datos del usuario obtenidos de localStorage:",
            parsedUser
          );
        } else {
          console.error("Datos del usuario en localStorage no son válidos");
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      console.log("Enviando datos para actualización:", {
        userId: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
      });

      const response = await fetch("http://localhost:5000/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
        }),
      });

      const text = await response.text();
      console.log("Respuesta del servidor:", text);

      const data = JSON.parse(text);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(user));
        setIsEditing(false);
        console.log("Perfil actualizado con éxito:", data);
      } else {
        console.error("Error al actualizar el perfil:", data.message);
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  return (
    <Box className="profile-container">
      {!isEditing ? (
        <Box>
          <Typography variant="body1">
            Nombre de usuario: {user.username}
          </Typography>
          <Typography variant="body1">
            Correo electrónico: {user.email}
          </Typography>
          <Typography variant="body1">Contraseña: ********</Typography>
          <Button variant="contained" color="primary" onClick={handleEdit}>
            Editar
          </Button>
        </Box>
      ) : (
        <form onSubmit={handleSave}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Nombre de usuario"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Correo electrónico"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </form>
      )}
    </Box>
  );
};

export default Profile;
