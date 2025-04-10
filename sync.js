const { sequelize } = require('./models');

async function sync() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas');
  } catch (error) {
    console.error('❌ Error al sincronizar:', error);
  } finally {
    await sequelize.close();
  }
}

sync();