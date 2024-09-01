import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  AccountCircle as AccountCircleIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState("all");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/search?q=${query}&type=${searchType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al realizar la búsqueda");
      }
      const data = await response.json();
      setResults(data);
      setError(null); // Limpiar el error si la búsqueda es exitosa
    } catch (err) {
      setError(
        "Ocurrió un error al realizar la búsqueda. Por favor, inténtelo de nuevo."
      );
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Búsqueda
      </Typography>
      <FormControl fullWidth margin="normal" variant="outlined" sx={{ mb: 2 }}>
        <InputLabel>Tipo de Búsqueda</InputLabel>
        <Select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          label="Tipo de Búsqueda"
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="users">Usuarios</MenuItem>
          <MenuItem value="products">Productos</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Buscar"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          fullWidth
          startIcon={<SearchIcon />}
          sx={{ py: 1, fontSize: "0.875rem" }}
        >
          Buscar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClear}
          fullWidth
          startIcon={<ClearIcon />}
          sx={{ py: 1, fontSize: "0.875rem" }}
        >
          Limpiar
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/profile")}
          fullWidth
          startIcon={<AccountCircleIcon />}
          sx={{ py: 1, fontSize: "0.875rem" }}
        >
          Volver al Perfil
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/products")}
          fullWidth
          startIcon={<ShoppingCartIcon />}
          sx={{ py: 1, fontSize: "0.875rem" }}
        >
          Ir a Productos
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2, textAlign: "center" }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {results.map((result) => (
          <Grid item xs={12} sm={6} md={4} key={result._id}>
            <Card
              sx={{
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  component="h2"
                  noWrap
                  sx={{ fontWeight: "bold" }}
                >
                  {result.name || result.username}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  sx={{ mb: 1 }}
                >
                  {result.email || result.description}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {result.category}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Search;
