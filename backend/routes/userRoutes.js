const express = require('express');
const router = express.Router();
const passport = require('passport');
const { 
    registerUser, 
    loginUser, 
    getMe, 
    generateToken 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// --- Rutas de Registro y Login Tradicional ---

// Registrar un usuario: POST /api/users
router.post('/', registerUser);

// Iniciar sesión: POST /api/users/login
router.post('/login', loginUser);

// Ver mi perfil (Protegido): GET /api/users/me
router.get('/me', protect, getMe);


// --- Rutas de Autenticación con Google ---

// Iniciar proceso con Google: GET /api/users/auth/google
router.get('/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

// Callback de Google: GET /api/users/auth/google/callback
router.get('/auth/google/callback', 
    passport.authenticate('google', { session: false }), 
    (req, res) => {
        // Generamos el token para el usuario que Google validó
        const token = generateToken(req.user._id);
        
        // Definimos la URL del frontend dependiendo de dónde estemos
        const frontendURL = process.env.NODE_ENV === 'production' 
            ? 'https://el-fogon-social.vercel.app'
            : 'http://localhost:5173';

        // Redirigimos al frontend con el token
        res.redirect(`${frontendURL}?token=${token}`);
    }
);

module.exports = router;