import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Muro from './components/Muro';

const Root = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <h1>Cargando...</h1>;

  return (
    <Routes>
      <Route path="/" element={user ? <Muro /> : <Navigate to="/login" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Root />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;