import React, { useState, useEffect } from "react";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    // Simula la obtención de datos de productos desde el backend
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const handleAddProduct = (event) => {
    event.preventDefault();
    const newProduct = { id: Date.now(), name: newProductName };
    setProducts([...products, newProduct]);
    setNewProductName("");
    localStorage.setItem("products", JSON.stringify(products));
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
    localStorage.setItem("products", JSON.stringify(products));
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(products));
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>

      <h3>Agregar Producto</h3>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Nombre del producto"
          required
        />
        <button type="submit">Agregar</button>
      </form>

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
    </div>
  );
};

export default Product;
