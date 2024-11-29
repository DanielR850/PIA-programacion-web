document.addEventListener('DOMContentLoaded', () => {
    // =======================
    // Función principal: Navegación y submenús
    // =======================
    const initNavigation = () => {
        const mainButtons = document.querySelectorAll('.main-button');
        const subButtons = document.querySelectorAll('.sub-button');
        const infoBoxes = document.querySelectorAll('.info-box');

        // Mostrar/ocultar submenús
        mainButtons.forEach((mainButton) => {
            mainButton.addEventListener('click', () => {
                const submenu = mainButton.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    submenu.classList.toggle('active');
                    submenu.style.display = submenu.classList.contains('active') ? 'block' : 'none';
                }
            });
        });

        // Mostrar caja asociada al botón final
        subButtons.forEach((subButton) => {
            subButton.addEventListener('click', () => {
                const targetId = subButton.getAttribute('data-target');
                const targetBox = document.getElementById(targetId);
                console.log('SubButton clicked:', targetId); // Depuración

                // Ocultar todas las cajas y mostrar solo la seleccionada
                infoBoxes.forEach((box) => {
                    box.style.display = box === targetBox ? 'block' : 'none';
                });
            });
        });
    };

    // =======================
    // Cargar nombre del administrador
    // =======================
    const loadAdminName = () => {
        const adminName = localStorage.getItem('adminName');
        const adminNameElement = document.getElementById('admin-name');

        if (adminName) {
            adminNameElement.textContent = adminName;
            console.log('Nombre del administrador cargado:', adminName);
        } else {
            adminNameElement.textContent = 'Usuario desconocido';
            console.warn('No se encontró un nombre en localStorage.');
        }
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('adminName');
        window.location.href = '/index.html';
    };

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', handleLogout);

    // =======================
    // Función genérica: CRUD para una sección
    // =======================
    const initCRUD = (sectionId, apiUrl, idCatalogo) => {
        const form = document.querySelector(`#info-${sectionId} .crud-form`);
        const tableBody = document.querySelector(`#info-${sectionId} .crud-table tbody`);

        // Obtener registros
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/${idCatalogo}`);
                if (response.ok) {
                    const data = await response.json();
                    renderTable(data);
                } else {
                    console.error(`Error al obtener los datos de ${sectionId}:`, response.statusText);
                }
            } catch (error) {
                console.error(`Error al obtener los datos de ${sectionId}:`, error);
            }
        };

        // Renderizar registros en la tabla
        const renderTable = (data) => {
            tableBody.innerHTML = '';
            data.forEach((item) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.Titulo}</td>
                    <td>${item.ContenidoTexto}</td>
                    <td><img src="${item.Imagen}" alt="${item.TextoAlternativo}" width="100" /></td>
                    <td>${item.TextoAlternativo}</td>
                    <td>
                        <button class="delete-button" data-id="${item.IdSeccion}">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        };

        // Agregar registro
        const addData = async (formData) => {
            try {
                const response = await fetch(`${apiUrl}/${idCatalogo}`, {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    alert('Registro agregado correctamente.');
                    fetchData();
                    form.reset();
                } else {
                    alert('Error al agregar el registro.');
                }
            } catch (error) {
                console.error('Error al agregar el registro:', error);
            }
        };

        // Eliminar registro
        const deleteData = async (id) => {
            if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
            try {
                const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('Registro eliminado correctamente.');
                    fetchData();
                } else {
                    alert('Error al eliminar el registro.');
                }
            } catch (error) {
                console.error('Error al eliminar el registro:', error);
            }
        };

        // Manejo del formulario
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(form);
                formData.append('idUsuario', 1);
                addData(formData);
            });
        }

        // Manejo de botones en la tabla
        if (tableBody) {
            tableBody.addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                if (event.target.classList.contains('delete-button')) {
                    deleteData(id);
                }
            });
        }

        fetchData();
    };

    // =======================
    // CRUD para Habilitar Cuentas
    // =======================
    const initHabilitarCuentas = () => {
        const form = document.getElementById('habilitar-cuentas-form');

        const agregarCuenta = async (formData) => {
            try {
                const response = await fetch('/api/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
        
                const result = await response.json();
        
                if (result.success) {
                    alert('Cuenta agregada correctamente.');
                    form.reset(); // Limpiar formulario
                } else {
                    alert('Error al agregar la cuenta: ' + result.message);
                }
            } catch (error) {
                console.error('Error al agregar la cuenta:', error);
                alert('Error al agregar la cuenta. Intenta nuevamente.');
            }
        };
        

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const NombreCompleto = form.NombreCompleto.value.trim();
            const Usuario = form.Usuario.value.trim();
            const Contrasena = form.Contrasena.value.trim();
            const Edad = parseInt(form.Edad.value, 10);

            if (!NombreCompleto || !Usuario || !Contrasena || isNaN(Edad) || Edad <= 0) {
                alert('Por favor, completa todos los campos correctamente.');
                return;
            }

            const formData = { NombreCompleto, Usuario, Contrasena, Edad, IdTipoUsuario: 2 };
            agregarCuenta(formData);
        });
    };
    
    // =======================
    // Inicialización
    // =======================
    initNavigation();
    initHabilitarCuentas();

    initCRUD('historia', 'http://localhost:3000/api/seccion', 1);
    initCRUD('mision', 'http://localhost:3000/api/seccion', 2);
    initCRUD('equipo', 'http://localhost:3000/api/seccion', 3);
    initCRUD('eventos-estado', 'http://localhost:3000/api/seccion', 4);
    initCRUD('eventos-nacionales', 'http://localhost:3000/api/seccion', 5);
    initCRUD('eventos-internacionales', 'http://localhost:3000/api/seccion', 6);
});
