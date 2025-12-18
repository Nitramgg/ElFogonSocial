const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const passport = require('passport'); 
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Carga la configuración de passport
require('./config/passport'); 

// Conectamos a la base de datos
connectDB(); 

const app = express(); // ⬅️ DEFINIMOS APP PRIMERO

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize()); 

// --- Rutas ---
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
    res.send('Servidor de El Fogón funcionando perfectamente 🏀');
});

// --- Manejo de Errores ---
app.use(errorHandler);

// --- Iniciar Servidor (SOLO UNA VEZ Y AL FINAL) ---
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🔥 Servidor iniciado en el puerto ${port}`));