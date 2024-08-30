import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simula la obtención de datos del usuario desde el backend
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setIsEditing(false);
    localStorage.setItem("user", JSON.stringify(user)); // Actualiza el usuario en el localStorage
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Perfil del Usuario
      </Typography>

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
