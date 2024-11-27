const express = require('express');

const app = express();

// Configuración para manejar JSON
app.use(express.json());

// Puerto donde correrá el servidor
const PORT = 3003;

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
