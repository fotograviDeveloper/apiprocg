require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Configuración de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Definición de Modelos
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'sales', 'viewer'), defaultValue: 'sales' }
}, {
  timestamps: true,
  underscored: true
});

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING(50), allowNull: false },
  description: DataTypes.TEXT,
  slug: { type: DataTypes.STRING(100), unique: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true,
  underscored: true
});

const Subcategory = sequelize.define('Subcategory', {
  name: { type: DataTypes.STRING(50), allowNull: false },
  description: DataTypes.TEXT,
  slug: { type: DataTypes.STRING(100), unique: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true,
  underscored: true
});

const Product = sequelize.define('Product', {
  sku: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  description: DataTypes.TEXT,
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  cost_price: DataTypes.DECIMAL(10, 2),
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  min_stock: { type: DataTypes.INTEGER, defaultValue: 5 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true,
  underscored: true
});

const ProductAttribute = sequelize.define('ProductAttribute', {
  attribute_name: { type: DataTypes.STRING(50), allowNull: false },
  attribute_value: { type: DataTypes.TEXT, allowNull: false }
}, {
  timestamps: false,
  underscored: true
});

const Quote = sequelize.define('Quote', {
  client_name: { type: DataTypes.STRING(100), allowNull: false },
  client_email: DataTypes.STRING(100),
  client_phone: DataTypes.STRING(20),
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  tax: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  status: { type: DataTypes.ENUM('draft', 'sent', 'approved', 'rejected'), defaultValue: 'draft' }
}, {
  timestamps: true,
  underscored: true
});

const QuoteItem = sequelize.define('QuoteItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  timestamps: false,
  underscored: true
});

// Establecer Relaciones
Category.hasMany(Subcategory, { foreignKey: 'category_id' });
Subcategory.belongsTo(Category, { foreignKey: 'category_id' });

Subcategory.hasMany(Product, { foreignKey: 'subcategory_id' });
Product.belongsTo(Subcategory, { foreignKey: 'subcategory_id' });

Product.hasMany(ProductAttribute, { foreignKey: 'product_id' });
ProductAttribute.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(Quote, { foreignKey: 'user_id' });
Quote.belongsTo(User, { foreignKey: 'user_id' });

Quote.hasMany(QuoteItem, { foreignKey: 'quote_id' });
QuoteItem.belongsTo(Quote, { foreignKey: 'quote_id' });

Product.hasMany(QuoteItem, { foreignKey: 'product_id' });
QuoteItem.belongsTo(Product, { foreignKey: 'product_id' });

// Función para poblar datos iniciales
async function seedInitialData() {
  try {
    // Crear usuario admin si no existe
    const adminCount = await User.count();
    if (adminCount === 0) {
      await User.create({
        email: 'admin@garza.com',
        password_hash: '$2b$10$ExampleHash', // Debes hashear la contraseña real
        role: 'admin'
      });
      console.log('👑 Usuario admin creado');
    }

    // Crear categorías de ejemplo
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      const electrica = await Category.create({
        name: 'Eléctrica',
        description: 'Productos para instalaciones eléctricas',
        slug: 'electrica',
        is_active: true
      });

      const iluminacion = await Category.create({
        name: 'Iluminación',
        description: 'Productos de iluminación',
        slug: 'iluminacion',
        is_active: true
      });

      // Subcategorías
      const cableado = await Subcategory.create({
        category_id: electrica.id,
        name: 'Cableado',
        slug: 'cableado',
        is_active: true
      });

      // Productos de ejemplo
      await Product.create({
        subcategory_id: cableado.id,
        sku: 'ELE-001',
        name: 'Cable THHN 12 AWG',
        description: 'Cable THHN calibre 12 para instalaciones eléctricas',
        price: 25.50,
        stock: 100,
        is_active: true
      });

      console.log('🛍️  Datos de productos iniciales creados');
    }
  } catch (error) {
    console.error('❌ Error al poblar datos iniciales:', error);
  }
}

// Función principal
async function initializeDatabase() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ alter: true });
    console.log('🎉 Base de datos sincronizada');

    console.log('🌱 Poblando datos iniciales...');
    await seedInitialData();
    
    console.log('🚀 Base de datos lista para usar!');
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
  } 
}

// Ejecutar
initializeDatabase();