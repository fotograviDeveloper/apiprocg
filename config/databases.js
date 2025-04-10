// config/databases.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log, // Muestra los logs SQL en consola (solo desarrollo)
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Verificación de conexión
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a MySQL exitosa'))
  .catch(err => console.error('❌ Error al conectar a MySQL:', err));

module.exports = sequelize;