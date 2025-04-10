// db_init.js
const fs = require('fs');
const sequelize = require('./config/database');

async function initDB() {
  const sql = fs.readFileSync(__dirname + '/db_init.sql', 'utf8');
  await sequelize.query(sql);
  console.log('✅ Base de datos verificada/actualizada');
}

module.exports = initDB;