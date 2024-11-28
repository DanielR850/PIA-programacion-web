document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('.dropbtn');
    const content = dropdown.querySelector('.dropdown-content');

    button.addEventListener('click', () => {
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) {
        content.style.display = 'none';
      }
    });
  });

  const dropdownButton = document.querySelector('.contact-us-button');
  const dropdownMenu = document.querySelector('.wide-dropdown-menu');

  dropdownButton?.addEventListener('click', (event) => {
    event.preventDefault();
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', (event) => {
    const isClickInside = dropdownButton?.contains(event.target) || dropdownMenu?.contains(event.target);
    if (!isClickInside) {
      dropdownMenu.style.display = 'none';
    }
  });

  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', function () {
      location.href = 'Home.html';
    });
  }
});

