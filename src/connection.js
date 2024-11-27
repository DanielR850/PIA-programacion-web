const mysql = require('mysql2');

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
  host: 'localhost',       // Cambia si usas un servidor diferente
  user: 'root',            // Usuario de MySQL
  password: 'tu_contraseña',  // Contraseña de MySQL
  database: 'nombre_bd',   // Nombre de la base de datos
  port: 3306               // Puerto (3306 por defecto)
});

module.exports = pool.promise(); // Exporta la conexión como una promesa
