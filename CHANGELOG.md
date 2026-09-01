# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-08-31

### Added
- Integrated a dynamic hero carousel populated via `hero-carousel.json` to showcase store promotional banners.
- Added native touch and swipe gesture support for the hero carousel on mobile devices, allowing seamless slide transitions via touch dragging.
- Added a robust set of high-resolution computer imagery and store banner assets.

### Changed
- Migrated all legacy raster image formats (JPEG and PNG) to the modern **WebP** standard, ensuring superior compression alongside SVG vectors.
- Refactored the dynamic gallery loader to fetch from `gallery.json` and automatically render a randomized subset of items on each page load using a Fisher-Yates shuffle.
- Updated the dynamic testimonials loader to fetch from `testimonials.json` and display exactly 4 randomized customer reviews on every page reload.

### Optimized
- Refactored hero carousel image presentation using `object-contain` combined with responsive container height rules (`h-72 sm:h-80 md:h-96`) to ensure flawless image proportions and scaling across all viewports.
- Streamlined hero carousel captions to remain hidden during standard automated rotation and sliding, displaying descriptive text exclusively when expanding images inside the Lightbox modal.
- Optimized hero carousel navigation arrows by hiding them entirely on mobile screens (`hidden md:flex`) and restricting desktop display strictly to hover events (`group-hover:opacity-100`), eliminating persistent touch-state artifacts.

---

## [1.1.0] - 2026-08-26

### Added
- Integrated a universal, friendly viewing tip banner to guide users on mobile browsers when forced color inversion or dark mode adjustments might affect site aesthetics.
- Added an interactive browser-specific guidance system (featuring step-by-step instructions for Chrome, Firefox, Safari, and Samsung Internet via clean toggle tabs).
- Added session storage persistence for the viewing tip banner to ensure it displays at most once per visit when interacting with theme switches.

### Optimized
- Refactored the gallery section layout to a standard grid architecture, significantly enhancing layout stability and cross-compatibility with WebKit-based mobile browsers (Safari).
- Streamlined global CSS base layers (`color-scheme` directives and rendering rules) to maximize prevention of unintended browser color shifting.

---

## [1.0.3] - 2026-08-23

### Added
- Integrated a helpful, user-friendly notification banner in the Hero Section tailored for users browsing via Samsung Internet, advising them on correct color and theme settings ("Locais com luz").
- Added conditional session storage logic to dismiss the Samsung Internet notice gracefully and prevent repeat prompts during the same visit.

### Fixed
- Fixed an animation synchronization bug on the brand logo click event by utilizing the native `scrollend` API, ensuring smooth scrolling to the top completes entirely before triggering a clean page reload.

---

## [1.0.2] - 2026-08-22

### Fixed
- Fixed automatic color inversion and saturation shifting bugs caused by mobile browser native features (specifically Samsung Internet "Force Dark Mode").

### Added
- Native `color-scheme: light dark` declarations in both HTML meta tags and Tailwind CSS base layers to instruct browsers on proper theme handling.

---

## [1.0.1] - 2026-08-22

### Fixed
- Fixed critical FOUC (Flash of Unstyled Content) and theme-switching visual bugs on older browser engines (specifically Samsung Internet).
- Fixed an issue where pressing the mobile device's physical/system "Back" button while a gallery image lightbox was open caused the user to leave the page instead of closing the modal.

### Added
- Synchronous early-theme initialization script in the document `<head>` to prevent layout flashing.
- Robust fallback mechanisms utilizing the `matchMedia` API and `try/catch` wrappers for restricted storage environments (such as private browsing and WebViews).

### Optimized
- Enhanced JavaScript defensive programming with rigorous null-checking across DOM elements.
- Cleaned up global rendering transitions to prevent initial page-load animation hiccups on low-end or older mobile hardware.

---

## [1.0.0] - 2026-08-20

### Added
- Complete light and dark theme switcher with local storage persistence.
- Smooth "reveal on scroll" animation system.
- Curtain-style transition effect for the mobile hamburger menu.
- Direct WhatsApp integration with pre-filled scheduling messages.
- Real Google Business Profile customer reviews section.
- Interactive Google Maps embed with exact location and Plus Code.

### Changed
- Updated typography/fonts across the landing page.
- Changed the accent color of the "Nós resolvemos" text from purple to green.
- Made gallery photo captions visible by default on mobile screens for better UX.

### Optimized
- Reduced and optimized heavy visual effects on mobile devices for better performance.
- Production CSS build configuration via Tailwind CLI.
