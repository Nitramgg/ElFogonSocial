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

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.get('/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/auth/google/callback', 
    passport.authenticate('google', { session: false }), 
    (req, res) => {
        const token = generateToken(req.user._id);
        
        // Forzamos la URL de Vercel para producción
        const frontendURL = 'https://el-fogon-social.vercel.app';

        // Redirigimos a /login para que el componente procese el token
        res.redirect(`${frontendURL}/login?token=${token}`);
    }
);

module.exports = router;