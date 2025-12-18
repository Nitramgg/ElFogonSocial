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

// Callback de Google
router.get('/auth/google/callback', 
    passport.authenticate('google', { session: false }), 
    (req, res) => {
        const token = generateToken(req.user._id);
        
        // REGLA DE ORO: Si estamos subiendo a Render, usemos SIEMPRE la URL de Vercel
        // Reemplaza esto momentáneamente para asegurar el éxito:
        const frontendURL = 'https://el-fogon-social.vercel.app';

        // Redirigimos al componente login con el token
        res.redirect(`${frontendURL}/login?token=${token}`);
    }
);

module.exports = router;