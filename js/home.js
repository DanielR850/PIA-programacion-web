// Footer toggle
const toggleFooterButton = document.getElementById('toggleFooter');
const footerContent = document.getElementById('footerContent');

toggleFooterButton.addEventListener('click', () => {
    const isHidden = footerContent.style.display === 'none';
    footerContent.style.display = isHidden ? 'block' : 'none';
    toggleFooterButton.textContent = isHidden ? '⬇' : '⬆';
});

// Gallery navigation
const galleryContainer = document.querySelector('.gallery-container');
const prevGalleryButton = document.getElementById('prevGallery');
const nextGalleryButton = document.getElementById('nextGallery');

prevGalleryButton.addEventListener('click', () => {
    galleryContainer.scrollBy({ left: -200, behavior: 'smooth' });
});

nextGalleryButton.addEventListener('click', () => {
    galleryContainer.scrollBy({ left: 200, behavior: 'smooth' });
});

// Footer carousel navigation
const carousel = document.querySelector('.carousel');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

prevButton.addEventListener('click', () => {
    carousel.scrollBy({ left: -200, behavior: 'smooth' });
});

nextButton.addEventListener('click', () => {
    carousel.scrollBy({ left: 200, behavior: 'smooth' });
});

