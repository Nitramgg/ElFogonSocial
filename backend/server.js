const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const passport = require('passport'); 
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// 1. Cargar configuración de passport
require('./config/passport'); 

// 2. Conectar a la base de datos
connectDB(); 

// 3. INICIALIZAR APP (Esto debe ir acá arriba)
const app = express(); 

// 4. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize()); 

// 5. Rutas de la API
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('Servidor de El Fogón funcionando perfectamente 🏀');
});

// 6. Manejo de Errores (Siempre al final de las rutas)
app.use(errorHandler);

// 7. Iniciar el servidor (Única vez)
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🔥 Servidor iniciado en el puerto ${port}`));