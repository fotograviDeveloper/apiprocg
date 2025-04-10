require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');

// Importar sequelize correctamente (cambia esta línea)
const sequelize = require('./config/databases'); // Sin destructuring

// Inicializar Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Configuración de Passport
require('./config/passport');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/upload', uploadRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: "API Comercializadora Garza",
    status: "Operativo"
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Verificar conexión y iniciar servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

startServer();