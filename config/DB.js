const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME 
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err.message);
        process.exit(1); // Detener la aplicación si no se puede conectar
    }
    console.log('Conexión exitosa a MySQL');
});

module.exports = connection;