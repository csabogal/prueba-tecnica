import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Product from "./components/Product";
import Search from "./components/Search";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<Product />} />
        <Route path="/search" element={<Search />} />
        {/* Otras rutas */}
      </Routes>
    </Router>
  );
}

export default App;
