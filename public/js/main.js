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
                infoBoxes.forEach(box => box.classList.remove('active'));

                // Mostrar solo la caja seleccionada
                if (targetBox) {
                    targetBox.classList.add('active');
                }
            });
        });
    };
    const loadAdminName = () => {
        // Obtener el nombre del usuario desde localStorage
        const adminName = localStorage.getItem('adminName');
        const adminNameElement = document.getElementById('admin-name');
    
        if (adminName) {
            adminNameElement.textContent = adminName; // Mostrar el nombre del usuario
            console.log('Nombre del administrador cargado:', adminName); // Depuración
        } else {
            adminNameElement.textContent = 'Usuario desconocido'; // Texto por defecto si no hay nombre
            console.warn('No se encontró un nombre en localStorage.');
        }
    };
    
    // Llamar a la función al cargar la página
    loadAdminName();
    
    
    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('adminName');
        window.location.href = '/index.html'; // Redirigir a la página de inicio
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
            tableBody.innerHTML = ''; // Limpiar la tabla
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
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            formData.append('idUsuario', 1); // Ajustar según sea necesario
            addData(formData);
        });

        // Manejo de botones en la tabla
        tableBody.addEventListener('click', (event) => {
            const id = event.target.dataset.id;
            if (event.target.classList.contains('delete-button')) {
                deleteData(id);
            }
        });

        fetchData(); // Inicializa los datos al cargar la página
    };

    // Inicializar la navegación
    initNavigation();

    const initHabilitarCuentas = () => {
        const form = document.getElementById('habilitar-cuentas-form');
        const tableBody = document.getElementById('habilitar-cuentas-table').querySelector('tbody');

        // Función para obtener las cuentas existentes
        const fetchCuentas = async () => {
            try {
                const response = await fetch('/api/cuentas');
                if (!response.ok) throw new Error('Error al obtener cuentas');
                const cuentas = await response.json();

                // Limpiar tabla
                tableBody.innerHTML = '';

                // Agregar filas a la tabla
                cuentas.forEach((cuenta) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cuenta.NombreCompleto}</td>
                        <td>${cuenta.Usuario}</td>
                        <td>${cuenta.Contraseña}</td>
                        <td>${cuenta.Edad}</td>
                        <td>
                            <button class="delete-button" data-id="${cuenta.IdUsuario}">Eliminar</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } catch (error) {
                console.error('Error al cargar cuentas:', error);
            }
        };

        // Función para agregar una cuenta
        const addCuenta = async (formData) => {
            try {
                const response = await fetch('/api/cuentas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                if (!response.ok) throw new Error('Error al agregar cuenta');
                alert('Cuenta agregada correctamente');
                fetchCuentas(); // Recargar las cuentas
                form.reset(); // Limpiar formulario
            } catch (error) {
                console.error('Error al agregar cuenta:', error);
                alert('Error al agregar cuenta');
            }
        };

        // Función para eliminar una cuenta
        const deleteCuenta = async (id) => {
            if (!confirm('¿Estás seguro de eliminar esta cuenta?')) return;
            try {
                const response = await fetch(`/api/cuentas/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Error al eliminar cuenta');
                alert('Cuenta eliminada correctamente');
                fetchCuentas(); // Recargar las cuentas
            } catch (error) {
                console.error('Error al eliminar cuenta:', error);
                alert('Error al eliminar cuenta');
            }
        };

        // Manejar envío del formulario
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = {
                nombreCompleto: document.getElementById('nombre-completo').value.trim(),
                usuario: document.getElementById('usuario').value.trim(),
                contraseña: document.getElementById('contraseña').value.trim(),
                edad: parseInt(document.getElementById('edad').value.trim(), 10),
            };
            addCuenta(formData);
        });

        // Manejar acciones en la tabla
        tableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-button')) {
                const id = event.target.getAttribute('data-id');
                deleteCuenta(id);
            }
        });

        // Inicializar las cuentas
        fetchCuentas();
    };

    // Llamar a la función de inicialización
    initHabilitarCuentas();
;


    // Inicializar CRUD para cada sección
    initCRUD('historia', 'http://localhost:3000/api/seccion', 1); // Historia
    initCRUD('mision', 'http://localhost:3000/api/seccion', 2); // Misión
    initCRUD('equipo', 'http://localhost:3000/api/seccion', 3); // Nuestro Equipo
    initCRUD('eventos-estado', 'http://localhost:3000/api/seccion', 4); // Eventos Estatales
    initCRUD('eventos-nacionales', 'http://localhost:3000/api/seccion', 5); // Eventos Nacionales
    initCRUD('eventos-internacionales', 'http://localhost:3000/api/seccion', 6); // Eventos Internacionales
});
