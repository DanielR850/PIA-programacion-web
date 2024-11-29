document.addEventListener("DOMContentLoaded", () => {
    // Selecciona todos los botones de la clase 'dropbtn'
    const dropdownButtons = document.querySelectorAll(".dropbtn");

    dropdownButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            // Evita que el clic se propague al documento (evitar que se cierre el menú cuando se hace clic en el botón)
            event.stopPropagation();

            // Obtén el menú desplegable asociado
            const dropdownContent = button.nextElementSibling;

            // Alterna la visibilidad del menú correspondiente
            const isVisible = dropdownContent.style.display === "block";
            if (isVisible) {
                dropdownContent.style.display = "none"; // Si está visible, se oculta
            } else {
                // Oculta todos los demás menús antes de mostrar el actual
                const allDropdowns = document.querySelectorAll(".dropdown-content");
                allDropdowns.forEach((dropdown) => {
                    dropdown.style.display = "none";
                });

                // Muestra el menú actual
                dropdownContent.style.display = "block";
            }
        });
    });

    // Cierra todos los menús si se hace clic fuera de ellos
    document.addEventListener("click", () => {
        const allDropdowns = document.querySelectorAll(".dropdown-content");
        allDropdowns.forEach((dropdown) => {
            dropdown.style.display = "none";
        });
    });

    const backButton = document.getElementById('back-button');
    if (backButton) {
      backButton.addEventListener('click', function () {
        location.href = 'Pantalla-Home-De-Bailarines.html';
      });
    }
});

