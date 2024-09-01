import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Box,
  CircularProgress,
  TextField,
  Divider,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";
import { Snackbar, Alert } from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const showNotification = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const responseText = await response.text();
      console.log("Respuesta del servidor (texto):", responseText);

      if (!response.ok) {
        throw new Error(
          `Error del servidor: ${response.status} ${response.statusText}\n${responseText}`
        );
      }

      try {
        const userData = JSON.parse(responseText);
        setUser(userData);
      } catch (parseError) {
        console.error("Error al parsear la respuesta:", parseError);
        throw new Error("La respuesta del servidor no es un JSON válido");
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleStartEdit = () => {
    setEditedUser({ ...user, biography: user.biography || "" });
    setIsEditing(true);
    setNewPassword("");
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch("/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error del servidor: ${response.status}`
        );
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      showNotification("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      showNotification(
        error.message || "Error al actualizar el perfil",
        "error"
      );
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification("Por favor, complete todos los campos", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("Las contraseñas nuevas no coinciden", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cambiar la contraseña");
      }

      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showNotification("Contraseña cambiada con éxito");
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      showNotification(
        error.message || "Error al cambiar la contraseña",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          onClick={() => navigate("/login")}
          variant="contained"
          color="primary"
        >
          Volver a Iniciar Sesión
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={user?.profileImage || "/default-avatar.jpg"}
                alt={user?.username}
                sx={{
                  width: { xs: 150, sm: 200 },
                  height: { xs: 150, sm: 200 },
                  mb: 2,
                  boxShadow: 3,
                }}
              />
              {!isEditing && !isEditingPassword && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleStartEdit}
                    fullWidth
                  >
                    Editar Perfil
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<LockIcon />}
                    onClick={() => setIsEditingPassword(true)}
                    fullWidth
                  >
                    Cambiar Contraseña
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            {isEditing ? (
              <Box
                component="form"
                onSubmit={handleSaveEdit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label="Nombre de usuario"
                  value={editedUser.username}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, username: e.target.value })
                  }
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Biografía"
                  multiline
                  rows={4}
                  value={editedUser.biography}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, biography: e.target.value })
                  }
                  variant="outlined"
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Guardar Cambios
                  </Button>
                </Box>
              </Box>
            ) : isEditingPassword ? (
              <Box
                component="form"
                onSubmit={handleSavePassword}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label="Contraseña actual"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Nueva contraseña"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Confirmar nueva contraseña"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsEditingPassword(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Cambiar Contraseña
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  {user?.username}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: "#666", mb: 2 }}
                >
                  {user?.email}
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "#333", mt: 3 }}
                >
                  Biografía
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ color: "#666", mb: 3 }}
                >
                  {user?.biography || "No hay biografía disponible"}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<InventoryIcon />}
            onClick={() => navigate("/products")}
            fullWidth={isMobile}
          >
            Ver Productos
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            fullWidth={isMobile}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
