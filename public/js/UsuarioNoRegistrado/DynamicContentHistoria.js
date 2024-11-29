document.addEventListener('DOMContentLoaded', async () => {
    const contentContainer = document.getElementById('content-container'); // Contenedor principal

    try {
        // Llamada al backend para obtener los datos de la sección "Historia"
        const response = await fetch('/api/seccion/1'); // Cambiar "1" por el idCatalogo correspondiente a Historia
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la historia');
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
                    img.alt = item.TextoAlternativo || 'Imagen de historia';
                    block.appendChild(img);
                }

                contentContainer.appendChild(block);
            });
        } else {
            contentContainer.innerHTML = '<p>No hay información disponible en este momento.</p>';
        }

    } catch (error) {
        console.error('Error al cargar los datos dinámicos:', error);
        contentContainer.innerHTML = '<p>Ocurrió un error al cargar la información. Intente más tarde.</p>';
    }
});
