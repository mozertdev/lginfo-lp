/**
 * Main Client-Side Script
 * Handles UI interactions, mobile navigation, theme switching, and the gallery lightbox modal.
 */

// Initialize Lucide icons
lucide.createIcons();

/* ==========================================================================
   Theme Switcher (Dark/Light Mode)
   ========================================================================== */
const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');

/**
 * Applies the selected theme and updates icons.
 * @param {string} theme - 'dark' or 'light'
 */
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }

    lucide.createIcons();
}

/**
 * Initializes theme based on localStorage or OS preference.
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (systemPrefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

initTheme();

/**
 * Toggles current theme state.
 */
function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

if (themeToggleDesktop) themeToggleDesktop.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

/* ==========================================================================
   Mobile Navigation Menu (Curtain Animation)
   ========================================================================== */
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const brandLogo = document.getElementById('brand-logo');

/**
 * Closes the mobile menu with a curtain effect.
 */
function closeMobileMenu() {
    mobileMenu.classList.remove('max-h-96', 'opacity-100');
    mobileMenu.classList.add('max-h-0', 'opacity-0');

    const icon = menuBtn.querySelector('i');
    if (icon) {
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    }
}

/**
 * Toggles mobile menu visibility.
 */
menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('max-h-96');
    const icon = menuBtn.querySelector('i');

    if (isOpen) {
        closeMobileMenu();
    } else {
        mobileMenu.classList.remove('max-h-0', 'opacity-0');
        mobileMenu.classList.add('max-h-96', 'opacity-100');

        if (icon) {
            icon.setAttribute('data-lucide', 'x');
            lucide.createIcons();
        }
    }
});

mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

/**
 * Logo click handler: Scrolls to top and reloads the page.
 */
if (brandLogo) {
    brandLogo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            window.location.reload();
        }, 500);
    });
}

/* ==========================================================================
   Gallery Lightbox Modal
   ========================================================================== */
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
    if (!imageModal) return;
    imageModal.classList.add('hidden');
    imageModal.classList.remove('flex');
    modalImg.src = '';
    modalCaption.textContent = '';
}

if (closeModal) closeModal.addEventListener('click', closeGalleryModal);

if (imageModal) {
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeGalleryModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeGalleryModal();
    }
});

/* ==========================================================================
   Scroll Observer
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal-scroll").forEach(el => {
        observer.observe(el);
    });
});
