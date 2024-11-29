document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value.trim();
    const tipo = document.getElementById('tipo').value.trim();

    if (!usuario || !password || !tipo) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, password, tipo }),
        });

        if (!response.ok) {
            alert('Error en la solicitud. Verifica tus datos e inténtalo nuevamente.');
            console.error('Error en la respuesta del servidor:', response.statusText);
            return;
        }

        const result = await response.json();

        if (result.success) {
            alert(result.message);

            // Guardar el nombre del usuario en localStorage si está disponible
            if (result.user && result.user.NombreCompleto) {
                localStorage.setItem('adminName', result.user.NombreCompleto);
                console.log('Nombre almacenado:', result.user.NombreCompleto); // Para depuración
            } else {
                console.warn('El nombre del usuario no está disponible en la respuesta.');
            }

            // Redirigir al panel correspondiente según el tipo de usuario
            if (tipo === 'Administrador') {
                window.location.href = '/UsuarioAdministrador/cruds.html';
            } else if (tipo === 'Bailarín') {
                window.location.href = '/UsuarioBailarin/Pantalla-Home-De-Bailarines.html';
            } else {
                console.warn('Tipo de usuario no reconocido:', tipo);
            }
        } else {
            alert(result.message || 'Error al iniciar sesión.');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un error al procesar la solicitud. Intenta nuevamente.');
    }
});
