// Importar módulos necesarios
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./connection'); // Ajusta la ruta si es necesario
const multer = require('multer');
const fs = require('fs');


const app = express();

// ========================
// Configuración global
// ========================
// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar carpeta 'public' para archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// ========================
// Configuración de Multer
// ========================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix);
    },
});
const upload = multer({ storage });

// ========================
// Rutas principales
// ========================

// Ruta principal (HTML)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Index.html'));
});

// ========================
// Rutas para autenticación
// ========================
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
// Rutas para CRUD genérico (Historia, Misión, etc.)
// ========================
// Obtener registros por catálogo
app.get('/api/seccion/:idCatalogo', (req, res) => {
    const { idCatalogo } = req.params;

    const query = 'SELECT * FROM seccionacercanosotrosyportafolio WHERE idCatalogo = ?';
    connection.query(query, [idCatalogo], (err, results) => {
        if (err) {
            console.error('Error al obtener los datos:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener datos.' });
        }
        console.log('Datos obtenidos:', results);
        res.json(results);
    });
});

// Agregar registro
app.post('/api/seccion/:idCatalogo', upload.single('image'), (req, res) => {
    const { idCatalogo } = req.params;
    const { title, content, 'alt-text': altText, idUsuario } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `
        INSERT INTO seccionacercanosotrosyportafolio 
        (idCatalogo, Titulo, ContenidoTexto, Imagen, TextoAlternativo, IdUsuario, Orden) 
        SELECT ?, ?, ?, ?, ?, ?, COALESCE(MAX(Orden), 0) + 1 
        FROM seccionacercanosotrosyportafolio WHERE idCatalogo = ?`;

    connection.query(query, [idCatalogo, title, content, imagePath, altText, idUsuario, idCatalogo], (err, results) => {
        if (err) {
            console.error('Error al insertar el dato:', err);
            return res.status(500).json({ success: false, message: 'Error al insertar el dato.' });
        }
        res.json({ success: true, message: 'Dato agregado correctamente.' });
    });
});

// Eliminar registro
app.delete('/api/seccion/:id', (req, res) => {
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

        const query = 'DELETE FROM seccionacercanosotrosyportafolio WHERE idSeccion = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error al eliminar el dato:', err);
                return res.status(500).json({ success: false, message: 'Error al eliminar el dato.' });
            }
            res.json({ success: true, message: 'Dato eliminado correctamente.' });
        });
    });
});

// ========================
// Rutas para CRUD de Usuarios
// ========================

app.post('/api/usuarios', async (req, res) => {
    const { NombreCompleto, Usuario, Contrasena, Edad, IdTipoUsuario } = req.body;

    if (!NombreCompleto || !Usuario || !Contrasena || !Edad || !IdTipoUsuario) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    }

    try {
        const [result] = await connection.query(
            'INSERT INTO usuarios (NombreCompleto, Usuario, Contrasena, Edad, IdTipoUsuario) VALUES (?, ?, ?, ?, ?)',
            [NombreCompleto, Usuario, Contrasena, Edad, IdTipoUsuario]
        );
        res.json({ success: true, message: 'Cuenta agregada correctamente.', id: result.insertId }); // Respuesta exitosa
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al agregar usuario.' }); // Respuesta con error
    }
});




app.get('/api/carrusel', async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM carrusel');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener imágenes del carrusel:', error);
        res.status(500).json({ success: false, message: 'Error al obtener imágenes.' });
    }
});
app.post('/api/carrusel', upload.single('imagen'), async (req, res) => {
    const { textoAlternativo, idUsuario } = req.body;
    const rutaImagen = req.file ? `/uploads/${req.file.filename}` : null;

    if (!rutaImagen || !idUsuario) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    }

    try {
        await connection.query(
            'INSERT INTO carrusel (RutaImagen, TextoAlternativo, IdUsuario) VALUES (?, ?, ?)',
            [rutaImagen, textoAlternativo, idUsuario]
        );
        res.json({ success: true, message: 'Imagen agregada al carrusel.' });
    } catch (error) {
        console.error('Error al agregar imagen al carrusel:', error);
        res.status(500).json({ success: false, message: 'Error al agregar imagen.' });
    }
});
app.delete('/api/carrusel/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.query('SELECT RutaImagen FROM carrusel WHERE IdImagen = ?', [id]);
        const rutaImagen = rows[0]?.RutaImagen;

        if (rutaImagen) {
            fs.unlinkSync(path.join(__dirname, '../public', rutaImagen)); // Eliminar archivo
        }

        await connection.query('DELETE FROM carrusel WHERE IdImagen = ?', [id]);
        res.json({ success: true, message: 'Imagen eliminada del carrusel.' });
    } catch (error) {
        console.error('Error al eliminar imagen del carrusel:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar imagen.' });
    }
});


// ========================
// Configuración del servidor
// ========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

