// ========================================
// BANNER MANAGER - Automatic Seasonal Banner Rotation
// ========================================
//
// This script automatically updates the hero banner based on:
// - Current date
// - Seasonal banner configuration
// - Device type (mobile/desktop)
//
// Dependencies:
// - seasonal-banner-config.js (must be loaded first)
//
// ========================================

class BannerManager {
    constructor() {
        this.currentBanner = null;
        this.bannerSection = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the banner manager
     * Call this when DOM is ready
     */
    init() {
        if (this.isInitialized) {
            console.warn('BannerManager already initialized');
            return;
        }

        console.log('Initializing BannerManager...');

        // Check if config is loaded
        if (typeof window.seasonalBannerConfig === 'undefined') {
            console.error('Banner config not loaded! Make sure seasonal-banner-config.js is included.');
            return;
        }

        // Get banner section element
        this.bannerSection = document.querySelector('.hero-banner-new');
        if (!this.bannerSection) {
            console.error('Banner section not found! Looking for .hero-banner-new');
            return;
        }

        // Get active banner based on current date
        this.currentBanner = window.seasonalBannerConfig.getActiveBanner();

        // Update banner content
        this.updateBanner();

        // Mark as initialized
        this.isInitialized = true;

        // Log status
        this.logStatus();

        console.log('BannerManager initialized successfully!');
    }

    /**
     * Update all banner elements with current banner data
     */
    updateBanner() {
        if (!this.currentBanner || !this.bannerSection) {
            console.error('Cannot update banner: missing banner data or section');
            return;
        }

        console.log(`Updating banner to: ${this.currentBanner.name}`);

        // Update link
        this.updateLink();

        // Update images
        this.updateImages();

        // Update text content
        this.updateText();

        // Update overlay color (optional)
        this.updateOverlayColor();

        // Add banner ID as data attribute for styling
        this.bannerSection.setAttribute('data-banner-id', this.currentBanner.id);
    }

    /**
     * Update the banner link
     */
    updateLink() {
        const link = this.bannerSection.querySelector('.hero-banner-link');
        if (link && this.currentBanner.link) {
            link.setAttribute('href', this.currentBanner.link);
        }
    }

    /**
     * Update banner images (responsive - desktop & mobile)
     */
    updateImages() {
        // Update picture sources
        const mobileSource = this.bannerSection.querySelector('source[media*="max-width"]');
        const desktopSource = this.bannerSection.querySelector('source[media*="min-width"]');
        const img = this.bannerSection.querySelector('.hero-banner-img');

        if (mobileSource && this.currentBanner.images.mobile) {
            mobileSource.setAttribute('srcset', this.currentBanner.images.mobile);
        }

        if (desktopSource && this.currentBanner.images.desktop) {
            desktopSource.setAttribute('srcset', this.currentBanner.images.desktop);
        }

        if (img) {
            img.setAttribute('src', this.currentBanner.images.desktop);
            img.setAttribute('alt', this.currentBanner.title);

            // Preload images for better performance
            this.preloadImage(this.currentBanner.images.desktop);
            this.preloadImage(this.currentBanner.images.mobile);
        }
    }

    /**
     * Update text content (title, subtitle, CTA button)
     */
    updateText() {
        // Update title
        const title = this.bannerSection.querySelector('.hero-title-new');
        if (title && this.currentBanner.title) {
            title.textContent = this.currentBanner.title;
        }

        // Update subtitle
        const subtitle = this.bannerSection.querySelector('.hero-subtitle-new');
        if (subtitle && this.currentBanner.subtitle) {
            subtitle.textContent = this.currentBanner.subtitle;
        }

        // Update CTA button text
        const ctaBtn = this.bannerSection.querySelector('.hero-cta-btn');
        if (ctaBtn && this.currentBanner.ctaText) {
            const btnInner = ctaBtn.querySelector('.btn-inner');
            if (btnInner) {
                btnInner.textContent = this.currentBanner.ctaText;
            } else {
                ctaBtn.textContent = this.currentBanner.ctaText;
            }
        }
    }

    /**
     * Update overlay color (optional styling)
     */
    updateOverlayColor() {
        const overlay = this.bannerSection.querySelector('.hero-overlay');
        if (overlay && this.currentBanner.overlayColor) {
            // Store original background if not already stored
            if (!overlay.hasAttribute('data-original-bg')) {
                const computedStyle = window.getComputedStyle(overlay);
                overlay.setAttribute('data-original-bg', computedStyle.backgroundColor);
            }

            // Apply custom overlay color
            overlay.style.backgroundColor = this.currentBanner.overlayColor;
        }
    }

    /**
     * Preload image for better performance
     */
    preloadImage(src) {
        if (!src) return;

        const img = new Image();
        img.src = src;
    }

    /**
     * Get information about current and upcoming banners
     */
    getStatus() {
        const upcoming = window.seasonalBannerConfig.getUpcomingBanner();

        return {
            current: {
                id: this.currentBanner.id,
                name: this.currentBanner.name,
                title: this.currentBanner.title
            },
            upcoming: upcoming ? {
                id: upcoming.id,
                name: upcoming.name,
                startDate: `${upcoming.startDate.month}/${upcoming.startDate.day}`
            } : null
        };
    }

    /**
     * Log current status to console (useful for debugging)
     */
    logStatus() {
        const status = this.getStatus();
        console.log('--- Banner Status ---');
        console.log(`Current: ${status.current.name} (${status.current.id})`);
        if (status.upcoming) {
            console.log(`Upcoming: ${status.upcoming.name} starts ${status.upcoming.startDate}`);
        } else {
            console.log('Upcoming: None scheduled');
        }
        console.log('-------------------');
    }

    /**
     * Force banner update (useful for testing)
     * @param {Date} date - Optional date to test with
     */
    forceUpdate(date = null) {
        console.log('Forcing banner update...');

        if (date) {
            console.log(`Testing with date: ${date.toLocaleDateString()}`);
            this.currentBanner = window.seasonalBannerConfig.getActiveBanner(date);
        } else {
            this.currentBanner = window.seasonalBannerConfig.getActiveBanner();
        }

        this.updateBanner();
        this.logStatus();
    }

    /**
     * Test banner with specific date
     * Useful for previewing future banners
     * @param {number} month - Month (1-12)
     * @param {number} day - Day (1-31)
     */
    testDate(month, day) {
        const year = new Date().getFullYear();
        const testDate = new Date(year, month - 1, day);
        console.log(`Testing banner for ${month}/${day}/${year}`);
        this.forceUpdate(testDate);
    }

    /**
     * Reset to current date banner
     */
    reset() {
        console.log('Resetting banner to current date...');
        this.forceUpdate();
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Create global instance
const bannerManager = new BannerManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        bannerManager.init();
    });
} else {
    // DOM already loaded
    bannerManager.init();
}

// Make available globally for debugging
window.bannerManager = bannerManager;

// ========================================
// DEVELOPER TOOLS (Console Commands)
// ========================================

/**
 * Developer tools available in browser console:
 *
 * bannerManager.logStatus()           - Show current banner info
 * bannerManager.testDate(10, 15)      - Test October 15 banner
 * bannerManager.testDate(12, 20)      - Test December 20 banner
 * bannerManager.reset()               - Reset to today's banner
 * bannerManager.forceUpdate()         - Manually refresh banner
 *
 * Example:
 * > bannerManager.testDate(12, 15)
 * // Will show Christmas banner
 */

console.log('%cBanner Manager loaded! 🎉', 'color: #4ade80; font-weight: bold; font-size: 14px;');
console.log('%cTry these commands:', 'color: #94a3b8; font-size: 12px;');
console.log('%c  bannerManager.logStatus()', 'color: #60a5fa; font-family: monospace;');
console.log('%c  bannerManager.testDate(12, 25)', 'color: #60a5fa; font-family: monospace;');
console.log('%c  bannerManager.reset()', 'color: #60a5fa; font-family: monospace;');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BannerManager;
}
