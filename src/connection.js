const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', // Servidor local
  user: 'root',      // Usuario raíz
  password: 'daniel0812', // Coloca tu contraseña correcta aquí
  database: 'ProgramacionWeb', // Asegúrate de usar el nombre correcto de tu base de datos
  port: 3306         // Puerto correcto
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos.');
  }
});

module.exports = connection;
