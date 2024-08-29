import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState({ username: '', email: '', password: '' });
  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    // Simula la obtención de datos del usuario desde el backend
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setIsEditing(false);
    localStorage.setItem('user', JSON.stringify(user)); // Actualiza el usuario en el localStorage
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <h2>Perfil del Usuario</h2>

      {!isEditing ? (
        <div>
          <p>Nombre de usuario: {user.username}</p>
          <p>Correo electrónico: {user.email}</p>
          <p>Contraseña: {user.password}</p>
          <button onClick={handleEdit}>Editar</button>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div>
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Correo electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Guardar</button>
        </form>
      )}
    </div>
  );
};

export default Profile;