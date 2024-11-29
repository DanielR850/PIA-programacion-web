const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connection = require('./connection');
const multer = require('multer'); // Middleware para manejo de archivos
const fs = require('fs'); // Para manejar archivos en el servidor

const app = express();

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar carpeta 'public' para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Configuración de multer para manejar la carga de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Crear carpeta si no existe
        }
        cb(null, uploadDir); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`; // Nombre único para evitar conflictos
        cb(null, uniqueSuffix);
    },
});
const upload = multer({ storage });

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
            res.json({ success: true, message: 'Inicio de sesión exitoso.', user: results[0] });
        } else {
            res.json({ success: false, message: 'Credenciales incorrectas o tipo de usuario no coincide.' });
        }
    });
});

// ========================
// RUTAS CRUD PARA HISTORIA
// ========================

// Obtener registros de Historia
app.get('/api/historia', (req, res) => {
    const query = 'SELECT idSeccion, Titulo, ContenidoTexto, Imagen, TextoAlternativo FROM seccionacercanosotrosyportafolio WHERE idCatalogo = 1';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los datos:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener datos.' });
        }
        console.log('Datos obtenidos de la base de datos:', results); // Agregar esto para depurar
        res.json(results);
    });
});


// Agregar nuevo registro de Historia
app.post('/api/historia', upload.single('image'), (req, res) => {
    const { titulo, contenidoTexto, textoAlternativo, idUsuario } = req.body;
    if (!titulo || !contenidoTexto) {
        return res.status(400).json({ success: false, message: 'Título y contenido son obligatorios.' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `
        INSERT INTO seccionacercanosotrosyportafolio 
        (idCatalogo, Titulo, ContenidoTexto, Imagen, TextoAlternativo, IdUsuario, Orden) 
        SELECT 1, ?, ?, ?, ?, ?, COALESCE(MAX(Orden), 0) + 1 FROM seccionacercanosotrosyportafolio WHERE idCatalogo = 1`;

    connection.query(query, [titulo, contenidoTexto, imagePath, textoAlternativo, idUsuario], (err) => {
        if (err) {
            console.error('Error al insertar el dato:', err);
            return res.status(500).json({ success: false, message: 'Error al insertar el dato.' });
        }
        res.json({ success: true, message: 'Dato agregado correctamente.' });
    });
});

// Eliminar registro de Historia
app.delete('/api/historia/:id', (req, res) => {
    const { id } = req.params;

    const getImageQuery = 'SELECT Imagen FROM seccionacercanosotrosyportafolio WHERE idSeccion = ?';
    connection.query(getImageQuery, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener la imagen:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener datos.' });
        }

        const imagePath = results[0]?.Imagen;
        if (imagePath) {
            fs.unlink(path.join(__dirname, '../public', imagePath), (unlinkErr) => {
                if (unlinkErr) console.error('Error al eliminar la imagen:', unlinkErr);
            });
        }

        const deleteQuery = 'DELETE FROM seccionacercanosotrosyportafolio WHERE idSeccion = ?';
        connection.query(deleteQuery, [id], (err) => {
            if (err) {
                console.error('Error al eliminar el dato:', err);
                return res.status(500).json({ success: false, message: 'Error al eliminar el dato.' });
            }
            res.json({ success: true, message: 'Dato eliminado correctamente.' });
        });
    });
});

// Actualizar registro de Historia
app.put('/api/historia/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { titulo, contenidoTexto, textoAlternativo } = req.body;

    if (!titulo || !contenidoTexto) {
        return res.status(400).json({ success: false, message: 'Título y contenido son obligatorios.' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `
        UPDATE seccionacercanosotrosyportafolio 
        SET Titulo = ?, ContenidoTexto = ?, TextoAlternativo = ?, Imagen = IFNULL(?, Imagen)
        WHERE idSeccion = ?`;

    connection.query(query, [titulo, contenidoTexto, textoAlternativo, imagePath, id], (err) => {
        if (err) {
            console.error('Error al actualizar el dato:', err);
            return res.status(500).json({ success: false, message: 'Error al actualizar el dato.' });
        }
        res.json({ success: true, message: 'Dato actualizado correctamente.' });
    });
});

// ========================

// ========================

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
