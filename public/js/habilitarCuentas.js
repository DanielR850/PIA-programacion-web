document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('habilitar-cuentas-form');
    const tableBody = document.getElementById('cuentas-habilitadas-tbody');

    // Cargar cuentas habilitadas al inicio
    const fetchCuentas = async () => {
        try {
            const response = await fetch('/api/usuarios'); // Asegúrate de que este endpoint sea correcto
            if (!response.ok) throw new Error('Error al obtener las cuentas');

            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error('Error al cargar cuentas habilitadas:', error);
            alert('Error al cargar cuentas habilitadas.');
        }
    };

    // Renderizar tabla
    const renderTable = (data) => {
        tableBody.innerHTML = ''; // Limpiar tabla

        data.forEach((cuenta) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cuenta.NombreCompleto}</td>
                <td>${cuenta.Usuario}</td>
                <td>${cuenta.Contrasena}</td>
                <td>${cuenta.Edad}</td>
                <td>
                    <button class="delete-button" data-id="${cuenta.IdUsuario}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    // Agregar cuenta
    const agregarCuenta = async (formData) => {
        try {
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (result.success) {
                alert('Cuenta agregada correctamente.');
                fetchCuentas(); // Recargar cuentas
                form.reset();
            } else {
                throw new Error(result.message || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error al agregar cuenta:', error);
            alert('Error al agregar la cuenta. Intenta nuevamente.');
        }
    };

    // Manejar el formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir recarga de página

        // Capturar valores del formulario
        const NombreCompleto = form.NombreCompleto.value.trim();
        const Usuario = form.Usuario.value.trim();
        const Contrasena = form.Contrasena.value.trim();
        const Edad = parseInt(form.Edad.value, 10);

        // Validar datos antes de enviar
        if (!NombreCompleto || !Usuario || !Contrasena || isNaN(Edad) || Edad <= 0) {
            alert('Por favor, completa todos los campos correctamente.');
            return;
        }

        const formData = { NombreCompleto, Usuario, Contrasena, Edad, IdTipoUsuario: 2 };
        agregarCuenta(formData); // Llamar a la función para agregar cuenta
    });

    // Eliminar cuenta
    tableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-button')) {
            const id = event.target.dataset.id;

            if (!confirm('¿Estás seguro de eliminar esta cuenta?')) return;

            try {
                const response = await fetch(`/api/usuarios/${id}`, {
                    method: 'DELETE',
                });

                const result = await response.json();
                if (result.success) {
                    alert('Cuenta eliminada correctamente.');
                    fetchCuentas(); // Recargar tabla
                } else {
                    throw new Error(result.message || 'Error desconocido');
                }
            } catch (error) {
                console.error('Error al eliminar cuenta:', error);
                alert('Error al eliminar la cuenta.');
            }
        }
    });

    // Inicializar datos
    fetchCuentas();
});
