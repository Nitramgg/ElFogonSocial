const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // El token suele venir en el "Header" como: Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtenemos el token del header
            token = req.headers.authorization.split(' ')[1];

            // Verificamos el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtenemos el usuario del token (sin el password) y lo metemos en el request
            req.user = await User.findById(decoded.id).select('-password');

            next(); // El guardia te deja pasar
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('No autorizado, token fallido');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('No autorizado, no hay token');
    }
});

module.exports = { protect };