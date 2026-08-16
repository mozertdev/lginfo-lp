/**
 * Main Client-Side Script
 * Handles UI interactions, mobile navigation, and the gallery lightbox modal.
 */

// Initialize Lucide icons
lucide.createIcons();

/* =================================================_
   Mobile Navigation Menu
   ================================================= */
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Toggle mobile menu visibility
menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Automatically close the mobile menu when a navigation link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

/* =================================================_
   Gallery Lightbox Modal
   ================================================= */
const galleryItems = document.querySelectorAll('.gallery-item');
const imageModal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const closeModal = document.getElementById('close-modal');

// Open modal and bind image source and caption on click
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
            modalImg.src = img.src;
            modalCaption.textContent = img.alt || 'Technical support gallery image';

            imageModal.classList.remove('hidden');
            imageModal.classList.add('flex');
        }
    });
});

/**
 * Closes the gallery lightbox modal and resets states.
 */
function closeGalleryModal() {
    imageModal.classList.add('hidden');
    imageModal.classList.remove('flex');
    modalImg.src = '';
    modalCaption.textContent = '';
}

// Event listeners for closing the modal
closeModal.addEventListener('click', closeGalleryModal);

imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        closeGalleryModal();
    }
});

// Close modal on 'Escape' key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeGalleryModal();
    }
});
