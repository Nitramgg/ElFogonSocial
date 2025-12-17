import { useContext } from 'react';

const Login = () => {
  const handleGoogleLogin = () => {
    // Redirigimos al endpoint de Google que creamos en el backend
    window.location.href = 'http://localhost:5000/api/users/auth/google';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Bienvenido a El Fogón 🏀</h2>
      <p>Inicia sesión para compartir con el club</p>
      
      <button 
        onClick={handleGoogleLogin}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Continuar con Google
      </button>
    </div>
  );
};

export default Login;