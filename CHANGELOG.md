# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
