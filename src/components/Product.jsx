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
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";
import ProductChart from "./ProductChart";

const Product = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    _id: null,
    name: "",
    description: "",
    category: "",
    quantity: 0,
    price: 0,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Obtener productos locales
      const localResponse = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!localResponse.ok) {
        const errorData = await localResponse.json();
        throw new Error(
          errorData.message || "Error al cargar los productos locales"
        );
      }
      const localData = await localResponse.json();

      // Obtener productos de la API externa
      const externalResponse = await fetch("https://fakestoreapi.com/products");
      if (!externalResponse.ok) {
        throw new Error("Error al cargar los productos de la API externa");
      }
      const externalData = await externalResponse.json();

      // Combinar y formatear los productos
      const combinedProducts = [
        ...localData,
        ...externalData.map((product) => ({
          _id: `external_${product.id}`,
          name: product.title,
          description: product.description,
          category: product.category,
          quantity: Math.floor(Math.random() * 100), // Cantidad aleatoria
          price: product.price,
        })),
      ];

      setProducts(combinedProducts);
    } catch (err) {
      setError(err.message || "Error al cargar los productos");
      console.error("Error al obtener productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setCurrentProduct({
        _id: product._id,
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        quantity: product.quantity || 0,
        price: product.price || 0,
      });
    } else {
      setCurrentProduct({
        _id: null,
        name: "",
        description: "",
        category: "",
        quantity: 0,
        price: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct({
      _id: null,
      name: "",
      description: "",
      category: "",
      quantity: 0,
      price: 0,
    });
  };

  const handleSaveProduct = async () => {
    try {
      let savedProduct;
      const productData = {
        name: currentProduct.name,
        description: currentProduct.description,
        category: currentProduct.category,
        quantity: currentProduct.quantity,
        price: currentProduct.price,
      };

      if (currentProduct._id) {
        // Actualizar producto existente
        savedProduct = await fetch(
          `http://localhost:5000/api/products/${currentProduct._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(productData),
          }
        );
      } else {
        // Añadir nuevo producto
        savedProduct = await insertSingleProduct(productData);
      }

      if (!savedProduct.ok) {
        const errorData = await savedProduct.json();
        throw new Error(errorData.message || "Error al guardar el producto");
      }

      const updatedProduct = await savedProduct.json();

      setProducts((prevProducts) =>
        currentProduct._id
          ? prevProducts.map((p) =>
              p._id === updatedProduct._id ? updatedProduct : p
            )
          : [...prevProducts, updatedProduct]
      );

      handleCloseDialog();
      setSnackbar({
        open: true,
        message: `Producto ${
          currentProduct._id ? "actualizado" : "añadido"
        } con éxito`,
      });
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      setSnackbar({
        open: true,
        message: `Error al ${
          currentProduct._id ? "actualizar" : "añadir"
        } el producto: ${error.message}`,
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      if (!id) {
        throw new Error("ID del producto no definido");
      }
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el producto");
      }
      setProducts(products.filter((p) => p._id !== id));
      setSnackbar({ open: true, message: "Producto eliminado con éxito" });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setSnackbar({
        open: true,
        message: `Error al eliminar el producto: ${error.message}`,
      });
    }
  };

  const insertProductsIntoDatabase = async (products) => {
    try {
      const response = await fetch("http://localhost:5000/api/products/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(products),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al insertar productos en la base de datos"
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const insertSingleProduct = async (product) => {
    const response = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        category: product.category,
        quantity: product.quantity,
        price: product.price,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al insertar el producto en la base de datos"
      );
    }

    return response;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        let errors = [];
        const validatedData = data.filter((item, index) => {
          if (
            !item.name ||
            typeof item.name !== "string" ||
            item.name.trim() === ""
          ) {
            errors.push(`Fila ${index + 2}: Nombre faltante o inválido`);
            return false;
          }
          if (
            !item.description ||
            typeof item.description !== "string" ||
            item.description.trim() === ""
          ) {
            errors.push(`Fila ${index + 2}: Descripción faltante o inválida`);
            return false;
          }
          if (
            !item.category ||
            typeof item.category !== "string" ||
            item.category.trim() === ""
          ) {
            errors.push(`Fila ${index + 2}: Categoría faltante o inválida`);
            return false;
          }
          if (products.some((p) => p.name === item.name.trim())) {
            errors.push(`Fila ${index + 2}: Producto "${item.name}" ya existe`);
            return false;
          }
          return true;
        });

        const newProducts = validatedData.map((item) => ({
          name: item.name.trim(),
          description: item.description.trim(),
          category: item.category.trim(),
          quantity: item.quantity || 0,
          price: item.price || 0,
        }));

        let message = "";
        if (newProducts.length > 0) {
          try {
            const insertedProducts = await insertProductsIntoDatabase(
              newProducts
            );
            setProducts((prevProducts) => [
              ...prevProducts,
              ...insertedProducts,
            ]);
            message += `${insertedProducts.length} productos cargados con éxito. `;
          } catch (error) {
            message += "Error al insertar productos en la base de datos. ";
          }
        }

        if (errors.length > 0) {
          message += `Se encontraron ${errors.length} errores: ${errors.join(
            "; "
          )}`;
        }
        if (newProducts.length === 0 && errors.length === 0) {
          message = "No se encontraron productos para cargar en el archivo";
        }

        setSnackbar({
          open: true,
          message: message,
        });

        console.log("Errores durante la carga:", errors);
      } catch (error) {
        console.error("Error al procesar el archivo:", error);
        setSnackbar({
          open: true,
          message:
            "Error al procesar el archivo. Asegúrese de que sea un archivo Excel válido.",
        });
      }
    };
    reader.onerror = (error) => {
      console.error("Error al leer el archivo:", error);
      setSnackbar({
        open: true,
        message: "Error al leer el archivo. Inténtelo de nuevo.",
      });
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
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Gestión de Productos
      </Typography>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          fullWidth={isMobile}
        >
          Añadir Producto
        </Button>
        <Button variant="contained" component="label" fullWidth={isMobile}>
          Carga Masiva
          <input
            type="file"
            hidden
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
          />
        </Button>
        <Button variant="contained" onClick={toggleChart} fullWidth={isMobile}>
          {showChart ? "Ocultar Gráfica" : "Mostrar Gráfica"}
        </Button>
        <Button
          variant="outlined"
          component={Link}
          to="/profile"
          sx={{ marginLeft: isMobile ? 0 : "auto" }}
          fullWidth={isMobile}
        >
          Volver al Perfil
        </Button>
      </Box>
      {showChart && <ProductChart products={products} />}
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" noWrap>
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    height: "3em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.description}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Categoría: {product.category}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Cantidad: {product.quantity}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Precio: ${product.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenDialog(product)}
                  disabled={product._id.startsWith("external_")}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteProduct(product._id)}
                  color="error"
                  disabled={product._id.startsWith("external_")}
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
          {currentProduct._id ? "Editar Producto" : "Añadir Producto"}
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
          <TextField
            margin="dense"
            label="Categoría"
            type="text"
            fullWidth
            value={currentProduct.category}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                category: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Cantidad"
            type="number"
            fullWidth
            value={currentProduct.quantity}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                quantity: parseInt(e.target.value, 10) || 0,
              })
            }
          />
          <TextField
            margin="dense"
            label="Precio"
            type="number"
            fullWidth
            value={currentProduct.price}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                price: parseFloat(e.target.value) || 0,
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
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Product;
