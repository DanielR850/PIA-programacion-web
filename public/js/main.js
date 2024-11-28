document.addEventListener('DOMContentLoaded', () => {
    // Obtener todos los botones principales y los botones finales
    const mainButtons = document.querySelectorAll('.main-button');
    const subButtons = document.querySelectorAll('.sub-button');
    const infoBoxes = document.querySelectorAll('.info-box');

    // Función para mostrar/ocultar submenús
    mainButtons.forEach(mainButton => {
        mainButton.addEventListener('click', () => {
            const submenu = mainButton.nextElementSibling; // Submenú asociado al botón principal
            if (submenu && submenu.classList.contains('submenu')) {
                submenu.classList.toggle('active'); // Alternar la visibilidad del submenú
                submenu.style.display = submenu.classList.contains('active') ? 'block' : 'none';
            }
        });
    });

    // Función para mostrar la caja asociada al botón final
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
});
