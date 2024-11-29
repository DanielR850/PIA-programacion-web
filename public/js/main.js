document.addEventListener('DOMContentLoaded', () => {
    // =======================
    // Función principal: Navegación y submenús
    // =======================
    const initNavigation = () => {
        const mainButtons = document.querySelectorAll('.main-button');
        const subButtons = document.querySelectorAll('.sub-button');
        const infoBoxes = document.querySelectorAll('.info-box');

        // Mostrar/ocultar submenús
        mainButtons.forEach(mainButton => {
            mainButton.addEventListener('click', () => {
                const submenu = mainButton.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    submenu.classList.toggle('active');
                    submenu.style.display = submenu.classList.contains('active') ? 'block' : 'none';
                }
            });
        });

        // Mostrar caja asociada al botón final
        subButtons.forEach(subButton => {
            subButton.addEventListener('click', () => {
                const targetId = subButton.getAttribute('data-target');
                const targetBox = document.getElementById(targetId);

                // Ocultar todas las cajas primero
                infoBoxes.forEach(box => box.style.display = 'none');

                // Mostrar solo la caja seleccionada
                if (targetBox) {
                    targetBox.style.display = 'block';
                }
            });
        });
    };

    // =======================
    // Función genérica: CRUD para una sección
    // =======================
    const initCRUD = (sectionId, apiUrl) => {
        const form = document.getElementById(`${sectionId}-form`);
        const tableBody = document.getElementById(`${sectionId}-table`)?.querySelector('tbody');

        // Obtener registros
        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                renderTable(data);
            } catch (error) {
                console.error(`Error al obtener los datos de ${sectionId}:`, error);
            }
        };

        // Renderizar registros en la tabla
        const renderTable = (data) => {
            if (!tableBody) return;
        
            tableBody.innerHTML = ''; // Limpiar la tabla
            data.forEach((item) => {
                console.log('Datos del registro:', item); // Depurar datos en el frontend
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.Titulo}</td>
                    <td>${item.ContenidoTexto}</td>
                    <td><img src="${item.Imagen}" alt="${item.TextoAlternativo}" width="100" /></td>
                    <td>${item.TextoAlternativo}</td>
                    <td>
                        <button class="edit-button" data-id="${item.idSeccion}">Editar</button>
                        <button class="delete-button" data-id="${item.idSeccion}">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        };
        

        // Agregar nuevo registro
        const addData = async (formData) => {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    alert(`${sectionId} agregado correctamente`);
                    fetchData();
                    form.reset();
                } else {
                    alert(`Error al agregar ${sectionId}`);
                }
            } catch (error) {
                console.error(`Error al agregar datos a ${sectionId}:`, error);
            }
        };

        // Eliminar registro
        const deleteData = async (id) => {
            if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
            try {
                const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert(`${sectionId} eliminado correctamente`);
                    fetchData();
                } else {
                    alert(`Error al eliminar ${sectionId}`);
                }
            } catch (error) {
                console.error(`Error al eliminar datos de ${sectionId}:`, error);
            }
        };

        // Editar registro
        const editData = async (id) => {
            try {
                const response = await fetch(`${apiUrl}/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('title').value = data.Titulo;
                    document.getElementById('content').value = data.ContenidoTexto;
                    document.getElementById('alt-text').value = data.TextoAlternativo;

                    // Cambiar botón "Agregar" a "Actualizar"
                    const submitButton = form.querySelector('button[type="submit"]');
                    submitButton.textContent = 'Actualizar';
                    submitButton.dataset.id = id;
                } else {
                    alert(`Error al cargar ${sectionId} para editar`);
                }
            } catch (error) {
                console.error(`Error al cargar datos para editar en ${sectionId}:`, error);
            }
        };

        // Actualizar registro
        const updateData = async (id, formData) => {
            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    body: formData,
                });
                if (response.ok) {
                    alert(`${sectionId} actualizado correctamente`);
                    fetchData();
                    form.reset();
                } else {
                    alert(`Error al actualizar ${sectionId}`);
                }
            } catch (error) {
                console.error(`Error al actualizar datos en ${sectionId}:`, error);
            }
        };

        // Manejar el envío del formulario
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            formData.append('idUsuario', 1); // Cambiar según sea necesario

            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton.dataset.id) {
                updateData(submitButton.dataset.id, formData);
                delete submitButton.dataset.id;
                submitButton.textContent = 'Agregar';
            } else {
                addData(formData);
            }
        });

        // Manejar acciones de la tabla
        tableBody.addEventListener('click', (event) => {
            const id = event.target.dataset.id;
            if (event.target.classList.contains('delete-button')) {
                deleteData(id);
            } else if (event.target.classList.contains('edit-button')) {
                editData(id);
            }
        });

        // Inicializar tabla
        fetchData();
    };

    // =======================
    // Inicializar funciones
    // =======================
    initNavigation(); // Inicializa navegación
    initCRUD('history', 'http://localhost:3000/api/historia'); // Inicializa CRUD para Historia
});
