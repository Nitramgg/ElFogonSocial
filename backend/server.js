const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const passport = require('passport'); // ⬅️ Importamos passport
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Carga la configuración de la estrategia de Google
require('./config/passport'); 

const port = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

// Conectamos a la base de datos
connectDB(); 

const app = express();

// --- Middlewares de configuración ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Inicializamos Passport para que el servidor pueda usar Google Auth
app.use(passport.initialize()); 

// --- Rutas de la API ---
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('Servidor de El Fogón funcionando perfectamente 🏀');
});

// --- Manejo de Errores ---
app.use(errorHandler);

app.listen(port, () => console.log(`🔥 Servidor iniciado en el puerto ${port}`));