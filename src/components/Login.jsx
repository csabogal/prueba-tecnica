import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí enviamos los datos del formulario al backend
    console.log("Formulario enviado:", { email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inicio de Sesión</h2>

      <div>
        <label htmlFor="email">Correo electrónico:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {/* <div>
        <a href="/profile">Ir a Perfil</a>
      </div> */}
      <div>
        <a href="/products">Ir a Productos</a>
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default Login;
