// src/routes/usuarios.js
const express = require('express');
const router = express.Router();
const connection = require('../db/connection'); // Ajusta la ruta a tu configuración

// Crear usuario
router.post('/', async (req, res) => {
    const { NombreCompleto, Usuario, Contrasena, Edad, IdTipoUsuario } = req.body;

    if (!NombreCompleto || !Usuario || !Contrasena || !Edad || !IdTipoUsuario) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son obligatorios.',
        });
    }

    const query = `
        INSERT INTO usuarios (NombreCompleto, Usuario, Contrasena, Edad, IdTipoUsuario)
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [NombreCompleto, Usuario, Contrasena, Edad, IdTipoUsuario];

    try {
        await connection.execute(query, values);
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente.',
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el usuario.',
        });
    }
});

// Obtener usuarios
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM usuarios';

    try {
        const [rows] = await connection.execute(query);
        res.status(200).json(rows); // Enviar los usuarios en formato JSON
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cargar los usuarios.',
        });
    }
});

module.exports = router;
