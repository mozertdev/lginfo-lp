// Initialize Lucide icons on initial load
lucide.createIcons();

/* ==========================================================================
   Theme Switcher & User Guidance for Forced Browser Dark Modes
   ========================================================================== */

const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const forcedNotice = document.getElementById('forced-theme-notice');
const closeForcedNoticeBtn = document.getElementById('close-forced-notice');

/**
 * Applies the selected theme to the document root, persists preference,
 * and triggers a helpful warning banner once per session if forced browser
 * color-shifting might be affecting the view.
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

  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    console.warn('Theme preference could not be saved to localStorage:', error);
  }

  lucide.createIcons();

  // Trigger the guidance notice when the user explicitly interacts with the theme switch,
  // ensuring it only shows once per session.
  const hasSeenNotice = sessionStorage.getItem('forced_theme_notice_shown');
  if (forcedNotice && !hasSeenNotice) {
    setTimeout(() => {
      forcedNotice.classList.remove('hidden');
    }, 400); // Small delay to let the theme transition finish smoothly
  }
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

// Bind theme toggle event listeners
if (themeToggleDesktop) {
  themeToggleDesktop.addEventListener('click', toggleTheme);
}

if (themeToggleMobile) {
  themeToggleMobile.addEventListener('click', toggleTheme);
}

// Close and remember dismissal for the current session
if (closeForcedNoticeBtn && forcedNotice) {
  closeForcedNoticeBtn.addEventListener('click', () => {
    forcedNotice.classList.add('opacity-0', 'translate-y-[-10px]');
    setTimeout(() => {
        forcedNotice.remove();
    }, 300);
    sessionStorage.setItem('forced_theme_notice_shown', 'true');
  });
}

/* ==========================================================================
   Interactive Browser Guidance Tabs for Theme Notice
   ========================================================================== */

const browserTabBtns = document.querySelectorAll('.browser-tab-btn');
const instructionsContainer = document.getElementById('instructions-container');
const browserInstructions = document.querySelectorAll('.browser-instruction');

browserTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const targetInstruction = document.getElementById(targetId);

    if (instructionsContainer && instructionsContainer.classList.contains('hidden')) {
      instructionsContainer.classList.remove('hidden');
    }

    browserInstructions.forEach(instruction => {
      instruction.classList.add('hidden');
    });

    if (targetInstruction) {
      targetInstruction.classList.remove('hidden');
    }

    browserTabBtns.forEach(b => b.classList.remove('ring-2', 'ring-zinc-400', 'dark:ring-zinc-500', 'bg-zinc-200', 'dark:bg-zinc-700'));
    btn.classList.add('ring-2', 'ring-zinc-400', 'dark:ring-zinc-500', 'bg-zinc-200', 'dark:bg-zinc-700');
  });
});

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
 * Handles the brand logo interaction. Smoothly scrolls the viewport to the top
 * and cleanly reloads the page once the scroll animation finishes completely.
 *
 * @function handleBrandLogoClick
 * @param {MouseEvent} event - The click event object.
 * @returns {void}
 */
if (brandLogo) {
    brandLogo.addEventListener('click', (event) => {
        event.preventDefault();

        // Initiate smooth viewport translation to top coordinates
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        /**
         * Listens for the native scroll termination event, cleans up the listener,
         * and triggers a full page refresh to reset DOM states and IntersectionObservers.
         *
         * @function handleScrollEnd
         * @returns {void}
         */
        const handleScrollEnd = () => {
            window.removeEventListener('scrollend', handleScrollEnd);
            window.location.reload();
        };

        // Attach native scrollend event listener for precise synchronization
        window.addEventListener('scrollend', handleScrollEnd);
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
