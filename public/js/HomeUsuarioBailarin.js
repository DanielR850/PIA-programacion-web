document.addEventListener("DOMContentLoaded", () => {
    // Selecciona todos los botones de la clase 'dropbtn'
    const dropdownButtons = document.querySelectorAll(".dropbtn");

    dropdownButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            // Evita que el evento se propague
            event.stopPropagation();

            // Oculta todos los menús desplegables antes de mostrar el actual
            const allDropdowns = document.querySelectorAll(".dropdown-content");
            allDropdowns.forEach((dropdown) => {
                if (dropdown !== button.nextElementSibling) {
                    dropdown.style.display = "none";
                }
            });

            // Alterna la visibilidad del menú correspondiente
            const dropdownContent = button.nextElementSibling;
            dropdownContent.style.display =
                dropdownContent.style.display === "block" ? "none" : "block";
        });
    });

    // Cierra los menús desplegables si se hace clic fuera de ellos
    document.addEventListener("click", () => {
        const allDropdowns = document.querySelectorAll(".dropdown-content");
        allDropdowns.forEach((dropdown) => {
            dropdown.style.display = "none";
        });
    });
});

