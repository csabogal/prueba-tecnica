import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";
import ProductChart from "./ProductChart";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    description: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Simular una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockProducts = [
        {
          id: 1,
          name: "Producto 1",
          description: "Descripción del producto 1",
        },
        {
          id: 2,
          name: "Producto 2",
          description: "Descripción del producto 2",
        },
        // ... más productos
      ];
      setProducts(mockProducts);
    } catch (err) {
      setError("Error al cargar los productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (
    product = { id: null, name: "", description: "" }
  ) => {
    setCurrentProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct({ id: null, name: "", description: "" });
  };

  const handleSaveProduct = () => {
    if (currentProduct.id) {
      // Actualizar producto existente
      setProducts(
        products.map((p) => (p.id === currentProduct.id ? currentProduct : p))
      );
    } else {
      // Añadir nuevo producto
      setProducts([...products, { ...currentProduct, id: Date.now() }]);
    }
    handleCloseDialog();
    setSnackbar({
      open: true,
      message: `Producto ${
        currentProduct.id ? "actualizado" : "añadido"
      } con éxito`,
    });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    setSnackbar({ open: true, message: "Producto eliminado con éxito" });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      const newProducts = data.map((item, index) => ({
        id: Date.now() + index,
        name: item.name,
        description: item.description,
      }));
      setProducts([...products, ...newProducts]);
      setSnackbar({ open: true, message: "Productos cargados con éxito" });
    };
    reader.readAsBinaryString(file);
  };

  const toggleChart = () => {
    setShowChart(!showChart);
  };

  if (loading)
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Productos
      </Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Añadir Producto
        </Button>
        <Button variant="contained" component="label">
          Carga Masiva
          <input
            type="file"
            hidden
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
          />
        </Button>
        <Button variant="contained" onClick={toggleChart}>
          {showChart ? "Ocultar Gráfica" : "Mostrar Gráfica"}
        </Button>
      </Box>
      {showChart && <ProductChart products={products} />}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(product)}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentProduct.id ? "Editar Producto" : "Añadir Producto"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Producto"
            type="text"
            fullWidth
            value={currentProduct.name}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={currentProduct.description}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                description: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveProduct} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default Product;
