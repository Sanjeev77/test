// ========================================
// PRODUCT ROTATION MANAGER - Automatic Product Loading
// ========================================
//
// This script automatically loads the correct products based on the current date
// Works in conjunction with banner-manager.js for complete automation
//
// Dependencies:
// - seasonal-banner-config.js (for dates and occasion info)
//
// ========================================

class ProductRotationManager {
    constructor() {
        this.currentOccasion = null;
        this.currentProducts = null;
        this.productCache = {};
        this.isInitialized = false;

        // Map occasion IDs to product file paths
        // Paths are relative to the HTML page (special-offers.html in pages/ folder)
        this.productFiles = {
            'valentines': '../js/products/valentines-products.js',
            'easter': '../js/products/easter-products.js',
            'mothers-day': '../js/products/mothersday-products.js',
            'fathers-day': '../js/products/fathersday-products.js',
            'independence-day': '../js/products/independenceday-products.js',
            'halloween': '../js/products/halloween-products.js',
            'thanksgiving': '../js/products/thanksgiving-products.js',
            'new-year': '../js/products/newyear-products.js',
            'secret-santa': '../js/products/secretsanta-products.js',
            'default': '../js/products/default-products.js'
        };
    }

    /**
     * Initialize the product rotation manager
     * Call this when DOM is ready
     */
    async init() {
        if (this.isInitialized) {
            console.warn('ProductRotationManager already initialized');
            return;
        }

        console.log('Initializing ProductRotationManager...');

        // Check if banner config is loaded
        if (typeof window.seasonalBannerConfig === 'undefined') {
            console.error('Banner config not loaded! Make sure seasonal-banner-config.js is included first.');
            return;
        }

        // Get active occasion based on current date
        const activeBanner = window.seasonalBannerConfig.getActiveBanner();
        this.currentOccasion = activeBanner.id;

        console.log(`Current occasion: ${this.currentOccasion} (${activeBanner.name})`);

        // Load products for current occasion
        await this.loadProducts(this.currentOccasion);

        // Mark as initialized
        this.isInitialized = true;

        // Log status
        this.logStatus();

        console.log('ProductRotationManager initialized successfully!');
    }

    /**
     * Load products for a specific occasion
     * @param {string} occasion - Occasion ID (e.g., 'halloween', 'christmas')
     */
    async loadProducts(occasion) {
        console.log(`Loading products for: ${occasion}`);

        // Check if products already loaded (instant - from <head> preload)
        const existingProducts = this.extractProducts(occasion);
        if (existingProducts && existingProducts.products && existingProducts.products.length > 0) {
            console.log(`✓ Products already loaded for ${occasion} (instant!)`);
            this.currentProducts = existingProducts;
            this.productCache[occasion] = existingProducts;
            this.makeProductsAvailable();
            return;
        }

        // Check cache
        if (this.productCache[occasion]) {
            console.log(`Using cached products for ${occasion}`);
            this.currentProducts = this.productCache[occasion];
            this.makeProductsAvailable();
            return;
        }

        // Get product file path
        const productFile = this.productFiles[occasion] || this.productFiles['default'];

        try {
            // Load the product script dynamically (only if not already loaded)
            await this.loadScript(productFile);

            // Get products from global scope
            const products = this.extractProducts(occasion);

            if (products) {
                this.currentProducts = products;
                this.productCache[occasion] = products;
                this.makeProductsAvailable();
                console.log(`✓ Loaded ${products.products ? products.products.length : 0} products for ${occasion}`);
            } else {
                console.warn(`No products found for ${occasion}, loading default`);
                if (occasion !== 'default') {
                    await this.loadProducts('default');
                }
            }
        } catch (error) {
            console.error(`Error loading products for ${occasion}:`, error);

            // Fallback to default products
            if (occasion !== 'default') {
                console.log('Falling back to default products');
                await this.loadProducts('default');
            }
        }
    }

    /**
     * Dynamically load a JavaScript file
     * @param {string} src - Script source path
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                console.log(`Script already loaded: ${src}`);
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = false;  // Load in order

            script.onload = () => {
                console.log(`✓ Script loaded: ${src}`);
                resolve();
            };

            script.onerror = () => {
                console.error(`✗ Failed to load script: ${src}`);
                reject(new Error(`Failed to load ${src}`));
            };

            document.head.appendChild(script);
        });
    }

    /**
     * Extract products from global scope based on occasion
     * @param {string} occasion - Occasion ID
     */
    extractProducts(occasion) {
        console.log(`Extracting products for occasion: ${occasion}`);

        // Check for special-offers.js format first (current Halloween)
        if (window.specialOffersData && occasion === 'halloween') {
            console.log(`Found ${window.specialOffersData.length} products in window.specialOffersData`);
            return {
                occasion: 'halloween',
                config: window.customCategoryConfig || {},
                products: window.specialOffersData
            };
        }

        // Try different variable names based on occasion
        const varNames = [
            `${occasion}Products`,  // e.g., halloweenProducts
            occasion.replace(/-/g, '') + 'Products',  // e.g., mothersday -> mothersdayProducts
            'specialOffersData'  // Fallback to existing structure
        ];

        for (const varName of varNames) {
            if (window[varName]) {
                console.log(`Found products in window.${varName}`);

                // Handle different data structures
                if (Array.isArray(window[varName])) {
                    // Old format: just an array
                    return {
                        occasion: occasion,
                        config: window.customCategoryConfig || {},
                        products: window[varName]
                    };
                } else if (window[varName].products) {
                    // New format: object with products array
                    return window[varName];
                }
            }
        }

        console.warn(`No products found for occasion: ${occasion}`);
        return null;
    }

    /**
     * Make products available globally for special-offers.html
     */
    makeProductsAvailable() {
        if (!this.currentProducts) {
            console.warn('makeProductsAvailable called but no currentProducts!');
            return;
        }

        // Make available in multiple formats for compatibility
        window.specialOffersData = this.currentProducts.products || [];
        window.customCategoryConfig = this.currentProducts.config || {};
        window.currentOccasionProducts = this.currentProducts;

        console.log(`✓ Products made available globally (${window.specialOffersData.length} products)`);

        // Dispatch custom event to notify page that products are ready
        window.dispatchEvent(new CustomEvent('productsLoaded', {
            detail: {
                occasion: this.currentOccasion,
                productCount: this.currentProducts.products.length
            }
        }));
    }

    /**
     * Get current occasion and product info
     */
    getStatus() {
        const banner = window.seasonalBannerConfig.getActiveBanner();
        const productCount = this.currentProducts && this.currentProducts.products ?
                           this.currentProducts.products.length : 0;

        return {
            occasion: {
                id: this.currentOccasion,
                name: banner.name,
                dates: `${banner.startDate ? banner.startDate.month + '/' + banner.startDate.day : 'default'}`
            },
            products: {
                count: productCount,
                loaded: !!this.currentProducts
            }
        };
    }

    /**
     * Log current status to console
     */
    logStatus() {
        const status = this.getStatus();
        console.log('--- Product Rotation Status ---');
        console.log(`Occasion: ${status.occasion.name} (${status.occasion.id})`);
        console.log(`Products: ${status.products.count} loaded`);
        console.log('------------------------------');
    }

    /**
     * Test loading products for a specific occasion
     * @param {string} occasion - Occasion ID to test
     */
    async testOccasion(occasion) {
        console.log(`Testing occasion: ${occasion}`);
        await this.loadProducts(occasion);
        this.currentOccasion = occasion;
        this.logStatus();

        // Trigger page update if function exists
        if (typeof filterAndDisplaySpecialOffers === 'function') {
            filterAndDisplaySpecialOffers('all');
        }
    }

    /**
     * Reset to current date's occasion
     */
    async reset() {
        console.log('Resetting to current date occasion...');
        const activeBanner = window.seasonalBannerConfig.getActiveBanner();
        await this.testOccasion(activeBanner.id);
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Create global instance
const productRotation = new ProductRotationManager();

// Auto-initialize immediately (don't wait for DOM)
// Products need to be ready ASAP for instant page load
(async function() {
    await productRotation.init();
})();

// Also listen for DOM ready as backup
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!productRotation.isInitialized) {
            productRotation.init();
        }
    });
}

// Make available globally for debugging
window.productRotation = productRotation;

// ========================================
// DEVELOPER TOOLS (Console Commands)
// ========================================

/**
 * Developer tools available in browser console:
 *
 * productRotation.logStatus()              - Show current products info
 * productRotation.testOccasion('christmas') - Load Christmas products
 * productRotation.testOccasion('thanksgiving') - Load Thanksgiving products
 * productRotation.reset()                  - Reset to current date
 *
 * Example:
 * > productRotation.testOccasion('christmas')
 * // Will load Christmas products and update page
 */

console.log('%cProduct Rotation Manager loaded! 🎁', 'color: #4ade80; font-weight: bold; font-size: 14px;');
console.log('%cTry these commands:', 'color: #94a3b8; font-size: 12px;');
console.log('%c  productRotation.logStatus()', 'color: #60a5fa; font-family: monospace;');
console.log('%c  productRotation.testOccasion("christmas")', 'color: #60a5fa; font-family: monospace;');
console.log('%c  productRotation.reset()', 'color: #60a5fa; font-family: monospace;');

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductRotationManager;
}
