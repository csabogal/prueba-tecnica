import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Link,
  Snackbar,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  Theme,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setOpenSuccessModal(true);
      } else {
        setErrorMessage(
          data.message ||
            "Error al registrar el usuario. Por favor, verifica los datos e inténtalo de nuevo."
        );
      }
    } catch (error) {
      setErrorMessage(
        "Error al registrar el usuario. Por favor, verifica tu conexión e inténtalo de nuevo."
      );
    }
  };

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    navigate("/login");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{ padding: isMobile ? 2 : 4, width: "100%", maxWidth: 400 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PersonAddIcon
              sx={{
                m: 1,
                bgcolor: "secondary.main",
                color: "white",
                borderRadius: "50%",
                padding: 1,
                fontSize: isMobile ? 30 : 40,
              }}
            />
            <Typography
              component="h1"
              variant={isMobile ? "h5" : "h4"}
              sx={{ mb: 2 }}
            >
              Registro
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de Usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2 }}
            >
              Registrarse
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Link component={RouterLink} to="/login" variant="body2">
                {"¿Ya tienes una cuenta? Inicia sesión"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
      {errorMessage && (
        <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
          {errorMessage}
        </Typography>
      )}
      <Dialog
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Registro Exitoso"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CheckCircleOutlineIcon
              color="success"
              sx={{ fontSize: 40, mr: 2 }}
            />
            <DialogContentText id="alert-dialog-description">
              Tu cuenta ha sido creada con éxito. Ahora puedes iniciar sesión
              con tus credenciales.
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessModal} autoFocus>
            Ir a Iniciar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Register;
