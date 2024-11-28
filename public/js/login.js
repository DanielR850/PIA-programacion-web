document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir que se recargue la página

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    const tipo = document.getElementById('tipo').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, password, tipo }),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            if (tipo === 'Administrador') {
                window.location.href = '/UsuarioAdministrador/cruds.html';
            } else if (tipo === 'Bailarín') {
                window.location.href = '/UsuarioBailarin/Home.html';
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al procesar la solicitud. Intenta nuevamente.');
    }
});
