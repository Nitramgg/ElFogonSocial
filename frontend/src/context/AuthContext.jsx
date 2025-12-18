import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Definimos la URL de tu backend en Render
  const API_URL = 'https://elfogonsocial.onrender.com';

  const fetchUser = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // CORRECCIÓN: Agregamos la URL completa de Render
      const response = await axios.get(`${API_URL}/api/users/me`, config);
      
      // Guardamos el usuario completo (incluyendo el _id y la foto que devuelve el backend)
      setUser(response.data);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenURL = params.get('token');
    const tokenLocal = localStorage.getItem('token');

    if (tokenURL) {
      localStorage.setItem('token', tokenURL);
      fetchUser(tokenURL);
      // Limpiamos la URL para que no quede el token a la vista
      window.history.replaceState({}, document.title, "/");
    } else if (tokenLocal) {
      fetchUser(tokenLocal);
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};