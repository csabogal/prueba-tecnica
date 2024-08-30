import React, { useState, useEffect } from "react";
import { read, utils } from "xlsx";
import ProductChart from "./ProductChart";
import { Box, Button, TextField, Typography } from "@mui/material";
import "./Product.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const handleAddProduct = (event) => {
    event.preventDefault();
    if (newProductName.trim() === "") {
      setErrorMessage("El nombre del producto no puede estar vacío");
      return;
    }
    const newProduct = { id: Date.now(), name: newProductName };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    setNewProductName("");
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleEditProduct = (id) => {
    const productToEdit = products.find((p) => p.id === id);
    if (productToEdit) {
      setNewProductName(productToEdit.name);
      setIsEditing(true);
      setEditingProductId(id);
    }
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    const updatedProducts = products.map((p) =>
      p.id === editingProductId ? { ...p, name: newProductName } : p
    );
    setProducts(updatedProducts);
    setIsEditing(false);
    setNewProductName("");
    setEditingProductId(null);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Por favor, seleccione un archivo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet);

        // Validar datos
        const newProducts = json.map((item) => {
          if (!item.name) {
            throw new Error("El archivo contiene productos sin nombre.");
          }
          return {
            id: Date.now() + Math.random(),
            name: item.name,
          };
        });

        // Evitar duplicados
        const uniqueProducts = newProducts.filter(
          (newProduct) =>
            !products.some((product) => product.name === newProduct.name)
        );

        const updatedProducts = [...products, ...uniqueProducts];
        setProducts(updatedProducts);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="form-container">
      <h2>Gestión de Productos</h2>
      <h3>Agregar Nuevo Producto</h3>
      <form onSubmit={handleAddProduct}>
        <div>
          <label htmlFor="newProductName">Nombre del producto:</label>
          <input
            type="text"
            id="newProductName"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            placeholder="Nombre del producto"
            required
          />
        </div>
        <button type="submit">Agregar Producto</button>
      </form>
      <h3>Cargar Productos desde Excel</h3>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="submit">Cargar</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <h3>Lista de Productos</h3>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id}>
            <span>{product.name}</span>
            <button onClick={() => handleEditProduct(product.id)}>
              Editar
            </button>
            <button onClick={() => handleDeleteProduct(product.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      {isEditing && (
        <form onSubmit={handleSaveEdit}>
          <div>
            <label htmlFor="editProductName">Nombre del producto:</label>
            <input
              type="text"
              id="editProductName"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Nombre del producto"
              required
            />
          </div>
          <button type="submit">Guardar Cambios</button>
        </form>
      )}
      <ProductChart products={products} />
    </div>
  );
};

export default Product;
