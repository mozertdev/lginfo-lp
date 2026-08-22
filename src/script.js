/**
 * @file Main Client-Side Script
 * @description Handles UI interactions, mobile navigation, theme switching, and the gallery lightbox modal.
 * @version 1.0.2
 */

// Initialize Lucide icons on initial load
lucide.createIcons();

/* ==========================================================================
   Theme Switcher (Dark/Light Mode)
   ========================================================================== */

const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');

/**
 * Applies the selected theme to the document root and safely persists the preference.
 * Synchronizes Lucide icons to reflect the current state.
 *
 * @function setTheme
 * @param {'dark'|'light'} theme - The target theme to apply.
 * @returns {void}
 */
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Safely attempt storage persistence, handling restricted browser modes (e.g., Samsung Internet private)
    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.warn('Theme preference could not be saved to localStorage:', error);
    }

    // Refresh icons to adapt to the new theme context if necessary
    lucide.createIcons();
}

/**
 * Toggles the current application theme state between light and dark.
 *
 * @function toggleTheme
 * @returns {void}
 */
function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
}

// Bind theme toggle event listeners with robust null-checking
if (themeToggleDesktop) {
    themeToggleDesktop.addEventListener('click', toggleTheme);
}

if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
}

/* ==========================================================================
   Mobile Navigation Menu (Curtain Animation)
   ========================================================================== */

const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const brandLogo = document.getElementById('brand-logo');

/**
 * Closes the mobile navigation menu using a smooth curtain collapse effect
 * and resets the toggle button icon to 'menu'.
 *
 * @function closeMobileMenu
 * @returns {void}
 */
function closeMobileMenu() {
    if (!mobileMenu || !menuBtn) return;

    mobileMenu.classList.remove('max-h-96', 'opacity-100');
    mobileMenu.classList.add('max-h-0', 'opacity-0');

    const icon = menuBtn.querySelector('i');
    if (icon) {
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    }
}

/**
 * Event listener for toggling mobile menu visibility state.
 */
if (menuBtn && mobileMenu) {
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
}

// Bind close event to all individual mobile navigation links
mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

/**
 * Brand Logo Interaction: Smooth scrolls to the top of the viewport
 * followed by a controlled page reload to clear application state.
 */
if (brandLogo) {
    brandLogo.addEventListener('click', (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            window.location.reload();
        }, 400);
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

/**
 * Closes the gallery lightbox modal, flushes cached source contents,
 * and cleans up the history state if triggered via back button.
 *
 * @function closeGalleryModal
 * @param {boolean} [isPopState=false] - Flag to prevent redundant history popping.
 * @returns {void}
 */
function closeGalleryModal(isPopState = false) {
    if (!imageModal || imageModal.classList.contains('hidden')) return;

    imageModal.classList.add('hidden');
    imageModal.classList.remove('flex');

    if (modalImg) modalImg.src = '';
    if (modalCaption) modalCaption.textContent = '';

    // If closed manually (button, backdrop, escape), remove the pushed history state
    if (!isPopState && window.history.state && window.history.state.modalOpen) {
        window.history.back();
    }
}

// Bind click events to gallery cards to trigger the lightbox modal
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img && modalImg && imageModal) {
            modalImg.src = img.src;
            modalCaption.textContent = img.alt || 'Technical support gallery image';

            imageModal.classList.remove('hidden');
            imageModal.classList.add('flex');

            // Push a fake history state so the mobile 'Back' button closes the modal instead of leaving the page
            window.history.pushState({ modalOpen: true }, '');
        }
    });
});

// Modal closing triggers (Button, Backdrop click, and Keyboard Escape)
if (closeModal) {
    closeModal.addEventListener('click', () => closeGalleryModal(false));
}

if (imageModal) {
    imageModal.addEventListener('click', (event) => {
        if (event.target === imageModal) {
            closeGalleryModal(false);
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeGalleryModal(false);
    }
});

/**
 * Listen for browser back button (popstate) to gracefully close the modal
 * on mobile devices instead of navigating away.
 */
window.addEventListener('popstate', () => {
    closeGalleryModal(true);
});

/* ==========================================================================
   Scroll Reveal Observer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);

    document.querySelectorAll('.reveal-scroll').forEach(element => {
        observer.observe(element);
    });
});
