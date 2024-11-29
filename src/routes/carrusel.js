const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const connection = require('../connection');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../public/uploads');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Obtener todas las imágenes del carrusel
router.get('/api/carrusel', async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM carrusel');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener imágenes del carrusel:', error);
        res.status(500).json({ success: false, message: 'Error al obtener imágenes.' });
    }
});

// Agregar una nueva imagen al carrusel
router.post('/api/carrusel', upload.single('imagen'), async (req, res) => {
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

// Eliminar una imagen del carrusel
router.delete('/api/carrusel/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await connection.query('SELECT RutaImagen FROM carrusel WHERE IdImagen = ?', [id]);
        const rutaImagen = rows[0]?.RutaImagen;

        if (rutaImagen) {
            fs.unlinkSync(path.join(__dirname, '../public', rutaImagen)); // Eliminar el archivo del servidor
        }

        await connection.query('DELETE FROM carrusel WHERE IdImagen = ?', [id]);
        res.json({ success: true, message: 'Imagen eliminada del carrusel.' });
    } catch (error) {
        console.error('Error al eliminar imagen del carrusel:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar imagen.' });
    }
});

module.exports = router;
