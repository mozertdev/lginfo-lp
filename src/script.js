// Initialize Lucide icons on initial load
lucide.createIcons();

/* ==========================================================================
   Theme Switcher & User Guidance for Forced Browser Dark Modes
   ========================================================================== */

const themeToggleDesktop = document.getElementById("theme-toggle-desktop");
const themeToggleMobile = document.getElementById("theme-toggle-mobile");
const forcedNotice = document.getElementById("forced-theme-notice");
const closeForcedNoticeBtn = document.getElementById("close-forced-notice");

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
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    console.warn("Theme preference could not be saved to localStorage:", error);
  }

  lucide.createIcons();

  // Trigger the guidance notice when the user explicitly interacts with the theme switch,
  // ensuring it only shows once per session.
  const hasSeenNotice = sessionStorage.getItem("forced_theme_notice_shown");
  if (forcedNotice && !hasSeenNotice) {
    setTimeout(() => {
      forcedNotice.classList.remove("hidden");
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
  const isDark = document.documentElement.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
}

// Bind theme toggle event listeners
if (themeToggleDesktop) {
  themeToggleDesktop.addEventListener("click", toggleTheme);
}

if (themeToggleMobile) {
  themeToggleMobile.addEventListener("click", toggleTheme);
}

// Close and remember dismissal for the current session
if (closeForcedNoticeBtn && forcedNotice) {
  closeForcedNoticeBtn.addEventListener("click", () => {
    forcedNotice.classList.add("opacity-0", "translate-y-[-10px]");
    setTimeout(() => {
      forcedNotice.remove();
    }, 300);
    sessionStorage.setItem("forced_theme_notice_shown", "true");
  });
}

/* ==========================================================================
   Interactive Browser Guidance Tabs for Theme Notice
   ========================================================================== */

const browserTabBtns = document.querySelectorAll(".browser-tab-btn");
const instructionsContainer = document.getElementById("instructions-container");
const browserInstructions = document.querySelectorAll(".browser-instruction");

browserTabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const targetInstruction = document.getElementById(targetId);

    if (
      instructionsContainer &&
      instructionsContainer.classList.contains("hidden")
    ) {
      instructionsContainer.classList.remove("hidden");
    }

    browserInstructions.forEach((instruction) => {
      instruction.classList.add("hidden");
    });

    if (targetInstruction) {
      targetInstruction.classList.remove("hidden");
    }

    browserTabBtns.forEach((b) =>
      b.classList.remove(
        "ring-2",
        "ring-zinc-400",
        "dark:ring-zinc-500",
        "bg-zinc-200",
        "dark:bg-zinc-700",
      ),
    );
    btn.classList.add(
      "ring-2",
      "ring-zinc-400",
      "dark:ring-zinc-500",
      "bg-zinc-200",
      "dark:bg-zinc-700",
    );
  });
});

/* ==========================================================================
   Mobile Navigation Menu (Curtain Animation)
   ========================================================================== */

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");
const brandLogo = document.getElementById("brand-logo");

/**
 * Closes the mobile navigation menu using a smooth curtain collapse effect
 * and resets the toggle button icon to 'menu'.
 *
 * @function closeMobileMenu
 * @returns {void}
 */
function closeMobileMenu() {
  if (!mobileMenu || !menuBtn) return;

  mobileMenu.classList.remove("max-h-96", "opacity-100");
  mobileMenu.classList.add("max-h-0", "opacity-0");

  const icon = menuBtn.querySelector("i");
  if (icon) {
    icon.setAttribute("data-lucide", "menu");
    lucide.createIcons();
  }
}

/**
 * Event listener for toggling mobile menu visibility state.
 */
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("max-h-96");
    const icon = menuBtn.querySelector("i");

    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileMenu.classList.remove("max-h-0", "opacity-0");
      mobileMenu.classList.add("max-h-96", "opacity-100");

      if (icon) {
        icon.setAttribute("data-lucide", "x");
        lucide.createIcons();
      }
    }
  });
}

// Bind close event to all individual mobile navigation links
mobileLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
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
  brandLogo.addEventListener("click", (event) => {
    event.preventDefault();

    // Initiate smooth viewport translation to top coordinates
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    /**
     * Listens for the native scroll termination event, cleans up the listener,
     * and triggers a full page refresh to reset DOM states and IntersectionObservers.
     *
     * @function handleScrollEnd
     * @returns {void}
     */
    const handleScrollEnd = () => {
      window.removeEventListener("scrollend", handleScrollEnd);
      window.location.reload();
    };

    // Attach native scrollend event listener for precise synchronization
    window.addEventListener("scrollend", handleScrollEnd);
  });
}

/* ==========================================================================
   Gallery Lightbox Modal
   ========================================================================== */

const galleryItems = document.querySelectorAll(".gallery-item");
const imageModal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const modalCaption = document.getElementById("modal-caption");
const closeModal = document.getElementById("close-modal");

/**
 * Closes the gallery lightbox modal, flushes cached source contents,
 * and cleans up the history state if triggered via back button.
 *
 * @function closeGalleryModal
 * @param {boolean} [isPopState=false] - Flag to prevent redundant history popping.
 * @returns {void}
 */
function closeGalleryModal(isPopState = false) {
  if (!imageModal || imageModal.classList.contains("hidden")) return;

  imageModal.classList.add("hidden");
  imageModal.classList.remove("flex");

  if (modalImg) modalImg.src = "";
  if (modalCaption) modalCaption.textContent = "";

  // If closed manually (button, backdrop, escape), remove the pushed history state
  if (!isPopState && window.history.state && window.history.state.modalOpen) {
    window.history.back();
  }
}

// Bind click events to gallery cards to trigger the lightbox modal
galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    if (img && modalImg && imageModal) {
      modalImg.src = img.src;
      modalCaption.textContent = img.alt || "Technical support gallery image";

      imageModal.classList.remove("hidden");
      imageModal.classList.add("flex");

      // Push a fake history state so the mobile 'Back' button closes the modal instead of leaving the page
      window.history.pushState({ modalOpen: true }, "");
    }
  });
});

// Modal closing triggers (Button, Backdrop click, and Keyboard Escape)
if (closeModal) {
  closeModal.addEventListener("click", () => closeGalleryModal(false));
}

if (imageModal) {
  imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) {
      closeGalleryModal(false);
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeGalleryModal(false);
  }
});

/**
 * Listen for browser back button (popstate) to gracefully close the modal
 * on mobile devices instead of navigating away.
 */
window.addEventListener("popstate", () => {
  closeGalleryModal(true);
});

/* ==========================================================================
   Scroll Reveal Observer
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.15,
  };

  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(revealCallback, observerOptions);

  document.querySelectorAll(".reveal-scroll").forEach((element) => {
    observer.observe(element);
  });
});

/* ==========================================================================
Dynamic Hero Carousel Controller with Touch/Swipe Support
========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const track = document.getElementById("hero-carousel-track");
  const dotsContainer = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");

  if (!track || !dotsContainer) return;

  try {
    const response = await fetch("./src/hero-carousel.json");
    if (!response.ok)
      throw new Error("Erro ao carregar os dados do carrossel da hero.");

    const slides = await response.json();
    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    const intervalTime = 5000; // 5 segundos por slide

    /**
     * Renders the slides and dots markup without captions during standard rotation
     */
    const renderCarousel = () => {
      track.innerHTML = slides
        .map(
          (slide, index) => `
        <div class="absolute inset-0 transition-opacity duration-700 ease-in-out ${index === 0 ? "opacity-100 z-10" : "opacity-0 z-0"} carousel-slide" data-index="${index}">
          <img
            src="${slide.src}"
            alt="${slide.alt}"
            class="w-full h-full object-contain select-none cursor-pointer"
          />
        </div>
      `,
        )
        .join("");

      dotsContainer.innerHTML = slides
        .map(
          (_, index) => `
        <button
          aria-label="Ir para o slide ${index + 1}"
          class="w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === 0 ? "bg-blue-600 w-6" : "bg-white/50 hover:bg-white"}"
          data-index="${index}"
        ></button>
      `,
        )
        .join("");
    };

    renderCarousel();

    const slideElements = track.querySelectorAll(".carousel-slide");
    const dotElements = dotsContainer.querySelectorAll("button");

    /**
     * Updates the active slide and resets the autoplay timer
     * @param {number} newIndex
     */
    const goToSlide = (newIndex) => {
      currentIndex = (newIndex + slides.length) % slides.length;

      slideElements.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.remove("opacity-0", "z-0");
          slide.classList.add("opacity-100", "z-10");
        } else {
          slide.classList.remove("opacity-100", "z-10");
          slide.classList.add("opacity-0", "z-0");
        }
      });

      dotElements.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.remove("bg-white/50", "w-2.5");
          dot.classList.add("bg-blue-600", "w-6");
        } else {
          dot.classList.remove("bg-blue-600", "w-6");
          dot.classList.add("bg-white/50", "w-2.5");
        }
      });
    };

    /**
     * Restarts the automated timer loop (resets standard timing to 0)
     */
    const resetAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, intervalTime);
    };

    // Event Listeners for manual controls
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
        resetAutoplay();
      });
    }

    dotElements.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        goToSlide(idx);
        resetAutoplay();
      });
    });

    // Touch / Swipe Event Listeners for Mobile Navigation
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50; // Minimum pixels required to register a swipe

    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    track.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
      },
      { passive: true },
    );

    /**
     * Evaluates horizontal touch distance to change slides via swipe
     */
    const handleSwipeGesture = () => {
      if (touchEndX < touchStartX - minSwipeDistance) {
        // Swipe Left -> Next Slide
        goToSlide(currentIndex + 1);
        resetAutoplay();
      } else if (touchEndX > touchStartX + minSwipeDistance) {
        // Swipe Right -> Previous Slide
        goToSlide(currentIndex - 1);
        resetAutoplay();
      }
    };
    // Touch / Swipe Event Listeners

    // Click on slide opens image in the Lightbox modal and displays description/caption
    track.addEventListener("click", (e) => {
      // Prevents modal from firing if gesture was an intended swipe or drag
      if (Math.abs(touchEndX - touchStartX) > 10) return;

      const activeSlideImg = slideElements[currentIndex].querySelector("img");
      const imageModal = document.getElementById("image-modal");
      const modalImg = document.getElementById("modal-img");
      const modalCaption = document.getElementById("modal-caption");

      if (activeSlideImg && modalImg && imageModal) {
        modalImg.src = activeSlideImg.src;
        modalCaption.textContent =
          slides[currentIndex].caption ||
          slides[currentIndex].alt ||
          "LG Info Banner";
        imageModal.classList.remove("hidden");
        imageModal.classList.add("flex");
        window.history.pushState({ modalOpen: true }, "");
      }
    });

    // Initialize first autoplay cycle
    resetAutoplay();
  } catch (error) {
    console.warn("Não foi possível carregar o carrossel da hero:", error);
  }
});

/* ==========================================================================
Dynamic Services Loader
========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const servicesContainer = document.getElementById("services-grid");
  if (!servicesContainer) return;
  try {
    const response = await fetch("./src/services.json");
    if (!response.ok)
      throw new Error("Erro ao carregar os dados dos serviços.");
    const services = await response.json();

    // Render services markup for all items present in the JSON with group hover support
    servicesContainer.innerHTML = services
      .map((service) => {
        return `
                <div class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 md:hover:border-blue-600 dark:md:hover:border-blue-500/40 md:hover:-translate-y-1 reveal-scroll shadow-sm dark:shadow-none">
                    <div>
                        <div class="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500 mb-6 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-white transition-all duration-300">
                            <i data-lucide="${service.icon}" class="w-6 h-6"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                            ${service.title}
                        </h3>
                        <p class="hyphens-auto text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            ${service.description}
                        </p>
                    </div>
                </div>
                `;
      })
      .join("");

    // Re-initialize Lucide icons for dynamically added elements
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

    // Re-observe elements for Scroll Reveal
    initDynamicServicesObserver();
  } catch (error) {
    console.warn("Não foi possível carregar os serviços dinâmicos:", error);
  }
});

/**
 * Re-initializes the IntersectionObserver for dynamically injected service elements
 */
function initDynamicServicesObserver() {
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.15,
  };

  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(revealCallback, observerOptions);
  document
    .querySelectorAll("#services-grid .reveal-scroll")
    .forEach((element) => {
      observer.observe(element);
    });
}

/* ==========================================================================
Dynamic Benefits Loader
========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const benefitsContainer = document.getElementById("benefits-grid");
  if (!benefitsContainer) return;
  try {
    const response = await fetch("./src/benefits.json");
    if (!response.ok)
      throw new Error("Erro ao carregar os dados dos benefícios.");
    const benefits = await response.json();

    // Render benefits markup for all items present in the JSON with group hover support
    benefitsContainer.innerHTML = benefits
      .map((benefit) => {
        return `
                <div class="group flex items-start space-x-4 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 transition-all duration-300 md:hover:border-blue-600 dark:md:hover:border-blue-500/50 md:hover:translate-x-1 reveal-scroll shadow-sm dark:shadow-none">
                    <div class="flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-500 transition-all duration-300 group-hover:scale-110">
                        <i data-lucide="${benefit.icon}" class="w-6 h-6"></i>
                    </div>
                    <p class="hyphens-auto text-sm sm:text-base leading-relaxed">
                        <span class="text-blue-600 dark:text-blue-400 font-semibold">
                            ${benefit.boldTitle}
                        </span>
                        ${benefit.description}
                    </p>
                </div>
                `;
      })
      .join("");

    // Re-initialize Lucide icons for dynamically added elements
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

    // Re-observe elements for Scroll Reveal
    initDynamicBenefitsObserver();
  } catch (error) {
    console.warn("Não foi possível carregar os benefícios dinâmicos:", error);
  }
});

/**
 * Re-initializes the IntersectionObserver for dynamically injected benefit elements
 */
function initDynamicBenefitsObserver() {
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.15,
  };

  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(revealCallback, observerOptions);
  document
    .querySelectorAll("#benefits-grid .reveal-scroll")
    .forEach((element) => {
      observer.observe(element);
    });
}

/* ==========================================================================
Dynamic Gallery Loader & Randomizer
========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const galleryContainer = document.getElementById("dynamic-gallery");
  if (!galleryContainer) return;

  try {
    const response = await fetch("./src/gallery.json");
    if (!response.ok) throw new Error("Failed to load gallery data.");

    let items = await response.json();

    // Shuffle array randomly using Fisher-Yates algorithm
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    // Limit and select the desired display quantity (e.g., 6 items)
    const displayCount = Math.min(6, items.length);
    const selectedItems = items.slice(0, displayCount);

    // Generate corresponding HTML markup for each item
    galleryContainer.innerHTML = selectedItems
      .map(
        (item) => `
      <div class="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl cursor-pointer gallery-item reveal-scroll">
          <div class="aspect-[4/3] w-full overflow-hidden">
              <img
                  src="${item.src}"
                  alt="${item.alt}"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
              />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 pointer-events-none">
              <span class="text-white font-medium text-sm">${item.caption}</span>
          </div>
      </div>
    `,
      )
      .join("");

    // Re-bind Lightbox events and scroll observer for the newly injected items
    initDynamicGalleryInteractions();
  } catch (error) {
    console.warn("Unable to load dynamic gallery:", error);
  }
});

/**
 * Re-initializes event listeners and observers for the dynamically generated gallery items.
 *
 * @private
 * @function initDynamicGalleryInteractions
 */
function initDynamicGalleryInteractions() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const imageModal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const modalCaption = document.getElementById("modal-caption");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (img && modalImg && imageModal) {
        modalImg.src = img.src;
        modalCaption.textContent = img.alt || "Technical support gallery image";
        imageModal.classList.remove("hidden");
        imageModal.classList.add("flex");
        window.history.pushState({ modalOpen: true }, "");
      }
    });
  });

  // Re-observe elements for Scroll Reveal animation
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.15,
  };

  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(revealCallback, observerOptions);
  document.querySelectorAll(".reveal-scroll").forEach((element) => {
    observer.observe(element);
  });
}

/* ==========================================================================
Dynamic Testimonials Loader
========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
  const testimonialsContainer = document.getElementById("dynamic-testimonials");
  if (!testimonialsContainer) return;

  try {
    const response = await fetch("./src/testimonials.json");
    if (!response.ok)
      throw new Error("Erro ao carregar os dados dos depoimentos.");

    let testimonials = await response.json();

    // Fisher-Yates shuffle to randomize testimonials order on page load
    for (let i = testimonials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [testimonials[i], testimonials[j]] = [testimonials[j], testimonials[i]];
    }

    // Limit the array to only 4 randomized testimonials
    const selectedTestimonials = testimonials.slice(0, 4);

    // Render testimonials markup
    testimonialsContainer.innerHTML = selectedTestimonials
      .map((item) => {
        const starsHtml = Array.from(
          { length: item.rating },
          () => `
        <i data-lucide="star" class="w-4 h-4 fill-amber-500 dark:fill-amber-400"></i>
      `,
        ).join("");

        return `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 md:hover:border-blue-600 dark:md:hover:border-blue-500/40 md:hover:-translate-y-1 reveal-scroll shadow-sm dark:shadow-none">
            <div class="space-y-4">
                <div class="flex text-amber-500 dark:text-amber-400 space-x-1">
                    ${starsHtml}
                </div>
                <p class="hyphens-auto text-slate-700 dark:text-slate-300 text-sm italic">
                    "${item.content}"
                </p>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
                ${item.name}
            </div>
        </div>
      `;
      })
      .join("");

    // Re-initialize Lucide icons for dynamically added elements
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

    // Re-observe elements for Scroll Reveal
    initDynamicTestimonialsObserver();
  } catch (error) {
    console.warn("Não foi possível carregar os depoimentos dinâmicos:", error);
  }
});

/**
 * Re-initializes the IntersectionObserver for dynamically injected testimonial elements
 */
function initDynamicTestimonialsObserver() {
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.15,
  };

  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(revealCallback, observerOptions);
  document
    .querySelectorAll("#dynamic-testimonials .reveal-scroll")
    .forEach((element) => {
      observer.observe(element);
    });
}
