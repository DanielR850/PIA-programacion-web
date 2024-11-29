document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('carrusel-form');
    const carruselContainer = document.getElementById('carrusel-container');

    // Función para agregar una imagen al carrusel
    const addImage = async (formData) => {
        try {
            const response = await fetch('/api/carrusel', {
                method: 'POST',
                body: formData, // Enviar el FormData directamente
            });
            const result = await response.json();

            if (result.success) {
                alert(result.message);
                form.reset(); // Limpiar formulario
                fetchImages(); // Recargar imágenes
            } else {
                alert('Error al agregar la imagen: ' + result.message);
            }
        } catch (error) {
            console.error('Error al agregar la imagen:', error);
        }
    };

    // Manejo del evento de envío del formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar recarga de la página

        const formData = new FormData(form);

        // Validar si los campos están completos
        const fileInput = form.querySelector('#imagen');
        const altTextInput = form.querySelector('#textoAlternativo');

        if (!fileInput.files.length || !altTextInput.value.trim()) {
            alert('Por favor, completa todos los campos antes de enviar.');
            return;
        }

        // Agregar la imagen al servidor
        addImage(formData);
    });

    // Función para obtener imágenes desde el servidor
    const fetchImages = async () => {
        try {
            const response = await fetch('/api/carrusel');
            const images = await response.json();
            renderImages(images);
        } catch (error) {
            console.error('Error al cargar las imágenes del carrusel:', error);
        }
    };

    // Función para renderizar imágenes en el contenedor
    const renderImages = (images) => {
        carruselContainer.innerHTML = ''; // Limpiar el contenedor
        images.forEach((image) => {
            const imageDiv = document.createElement('div');
            imageDiv.classList.add('carrusel-item');
            imageDiv.innerHTML = `
                <img src="${image.RutaImagen}" alt="${image.TextoAlternativo}" />
                <button class="delete-button" data-id="${image.IdImagen}">Eliminar</button>
            `;
            carruselContainer.appendChild(imageDiv);
        });
    };

    // Cargar las imágenes al iniciar
    fetchImages();
});
