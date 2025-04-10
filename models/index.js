// models/index.js
const sequelize = require('../config/databases.js');
const { DataTypes } = require('sequelize');

// Importar modelos
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Subcategory = require('./Subcategory');
const Productattribute = require('./Productattribute.js');
const Quote = require('./Quote');
const QuoteItem = require('./QuoteItem');

// Inicializar modelos
const db = {
  User: User(sequelize, DataTypes),
  Product: Product(sequelize, DataTypes),
  Category: Category(sequelize, DataTypes),
  Subcategory: Subcategory(sequelize, DataTypes),
  Productattribute: Productattribute(sequelize, DataTypes),
  Quote: Quote(sequelize, DataTypes),
  QuoteItem: QuoteItem(sequelize, DataTypes)
};

// Establecer relaciones
Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

// Sincronizar modelos con la base de datos (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true })
    .then(() => console.log('✅ Modelos sincronizados'))
    .catch(err => console.error('❌ Error al sincronizar modelos:', err));
}

module.exports = {
  ...db,
  sequelize,
  DataTypes
};