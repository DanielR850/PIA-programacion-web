const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connection = require('./connection');

const app = express();

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar carpeta 'public' para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Ruta principal para cargar la página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Index.html'));
});

// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
    const { usuario, password, tipo } = req.body;

    const query = `
        SELECT Usuarios.NombreCompleto, TipoUsuario.NombreTipo
        FROM Usuarios
        INNER JOIN TipoUsuario ON Usuarios.IdTipoUsuario = TipoUsuario.IdTipoUsuario
        WHERE Usuario = ? AND Contrasena = ? AND TipoUsuario.NombreTipo = ?`;

    connection.query(query, [usuario, password, tipo], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ success: false, message: 'Error en el servidor.' });
        }

        if (results.length > 0) {
            // Usuario autenticado correctamente
            res.json({ success: true, message: 'Inicio de sesión exitoso.', user: results[0] });
        } else {
            // Credenciales incorrectas
            res.json({ success: false, message: 'Credenciales incorrectas o tipo de usuario no coincide.' });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
