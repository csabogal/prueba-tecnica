import React, { useState, useEffect } from "react";
import { read, utils } from "xlsx";
import ProductChart from "./ProductChart";

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
    setNewProductName("");
    setIsEditing(false);
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

  const handleUpload = async (event) => {
    event.preventDefault();
    setErrorMessage(null);

    if (selectedFile) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = read(data, { type: "array" });
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const productsData = utils.sheet_to_json(worksheet);

          const validatedProducts = productsData.filter((product) => {
            if (product.name && typeof product.name === "string") {
              return true;
            }
            setErrorMessage(
              "El archivo Excel contiene datos inválidos. Por favor, asegúrate de que el nombre del producto sea un valor de texto válido."
            );
            return false;
          });

          if (validatedProducts.length > 0) {
            const updatedProducts = [...products, ...validatedProducts];
            setProducts(updatedProducts);
            localStorage.setItem("products", JSON.stringify(updatedProducts));
            setErrorMessage(null);
            setSelectedFile(null);
          }
        };
        reader.readAsArrayBuffer(selectedFile);
      } catch (error) {
        setErrorMessage(
          "Hubo un error al cargar el archivo Excel. Por favor, asegúrate de que el archivo sea válido."
        );
      }
    } else {
      setErrorMessage("Por favor, selecciona un archivo Excel.");
    }
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>
      <h3>Agregar Nuevo Producto</h3>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Nombre del producto"
          required
        />
        <button type="submit">Agregar Producto</button>
      </form>
      <h3>Cargar Productos desde Excel</h3>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="submit">Cargar</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <h3>Lista de Productos</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name}
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
          <input
            type="text"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            placeholder="Nombre del producto"
            required
          />
          <button type="submit">Guardar Cambios</button>
        </form>
      )}
      <ProductChart products={products} />
    </div>
  );
};

export default Product;
