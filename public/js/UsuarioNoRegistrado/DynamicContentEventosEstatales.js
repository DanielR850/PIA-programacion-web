document.addEventListener('DOMContentLoaded', async () => {
    const contentContainer = document.getElementById('content-container'); // Contenedor principal

    try {
        // Llamada al backend para obtener los datos de la sección "Eventos Estatales"
        const response = await fetch('/api/seccion/4'); // Cambiar "4" por el idCatalogo correspondiente a "Eventos Estatales"
        if (!response.ok) {
            throw new Error('Error al obtener los datos de los eventos estatales');
        }

        const data = await response.json();

        // Verificar si hay datos
        if (data && data.length > 0) {
            contentContainer.innerHTML = ''; // Limpiar cualquier contenido anterior

            // Generar bloques dinámicos para cada entrada
            data.forEach(item => {
                const block = document.createElement('div');
                block.classList.add('content-block');

                // Añadir título
                const title = document.createElement('h2');
                title.textContent = item.Titulo;
                block.appendChild(title);

                // Añadir texto
                const text = document.createElement('p');
                text.textContent = item.ContenidoTexto;
                block.appendChild(text);

                // Añadir imagen (si está disponible)
                if (item.Imagen) {
                    const img = document.createElement('img');
                    img.src = item.Imagen; // Ruta de la imagen
                    img.alt = item.TextoAlternativo || 'Imagen de evento estatal';
                    block.appendChild(img);
                }

                // Añadir bloque al contenedor principal
                contentContainer.appendChild(block);
            });
        } else {
            // Mostrar mensaje si no hay datos disponibles
            contentContainer.innerHTML = '<p>No hay información disponible en este momento.</p>';
        }

    } catch (error) {
        console.error('Error al cargar los datos dinámicos:', error);
        contentContainer.innerHTML = '<p>Ocurrió un error al cargar la información. Intente más tarde.</p>';
    }
});
