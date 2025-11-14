/**
 * Special Products Rotation Manager
 * Manages automatic rotation of special products based on seasonal occasions
 * Products rotate every 12 hours with localStorage persistence
 */

class SpecialProductsRotationManager {
    constructor() {
        this.ROTATION_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
        this.MAX_PRODUCTS = 25;
        this.STORAGE_KEY = 'specialProductsRotation';

        // Map occasion IDs to their product data sources
        this.occasionProductMap = {
            'halloween': 'specialOffersData', // Legacy format in window
            'thanksgiving': 'thanksgivingProducts',
            'secret-santa': 'specialOffersData', // Legacy format
            'secretsanta': 'specialOffersData', // Legacy format (alternative ID)
            'christmas': 'christmasProducts',
            'new-year': 'newYearProducts',
            'newyear': 'newYearProducts', // Alternative ID
            'valentines': 'valentinesDayProducts',
            'easter': 'easterProducts',
            'mothers-day': 'mothersdayProducts',
            'mothersday': 'mothersdayProducts', // Alternative ID
            'fathers-day': 'fathersdayProducts',
            'fathersday': 'fathersdayProducts', // Alternative ID
            'independence-day': 'independenceDayProducts',
            'independenceday': 'independenceDayProducts', // Alternative ID
            'default': 'defaultProducts'
        };
    }

    /**
     * Initialize the rotation manager
     * @returns {Array} Array of products to display
     */
    init() {
        console.log('[Special Products Rotation] ========================================');
        console.log('[Special Products Rotation] Initializing...');

        // Check if banner config is available
        if (typeof window.seasonalBannerConfig === 'undefined') {
            console.error('[Special Products Rotation] ERROR: seasonalBannerConfig not loaded!');
            return [];
        }

        // Get active occasion from seasonal banner config
        const activeBanner = this.getActiveOccasion();
        console.log('[Special Products Rotation] Active occasion:', activeBanner);

        // Check if rotation is needed
        const rotationData = this.getStoredRotation();
        console.log('[Special Products Rotation] Stored rotation data:', rotationData ? `Found (${rotationData.occasion})` : 'None');

        const needsRotation = this.shouldRotate(rotationData, activeBanner);
        console.log('[Special Products Rotation] Needs rotation:', needsRotation);

        if (needsRotation) {
            console.log('[Special Products Rotation] Generating new product set...');
            const products = this.generateNewRotation(activeBanner);
            console.log('[Special Products Rotation] ========================================');
            return products;
        } else {
            console.log('[Special Products Rotation] Using stored products:', rotationData.products.length, 'products');
            console.log('[Special Products Rotation] ========================================');
            return rotationData.products;
        }
    }

    /**
     * Get the currently active occasion from seasonal banner config
     * @returns {string} Active occasion ID
     */
    getActiveOccasion() {
        if (typeof seasonalBannerConfig !== 'undefined' && seasonalBannerConfig.getActiveBanner) {
            const banner = seasonalBannerConfig.getActiveBanner();
            return banner.id || 'default';
        }
        return 'default';
    }

    /**
     * Get stored rotation data from localStorage
     * @returns {Object|null} Stored rotation data or null
     */
    getStoredRotation() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('[Special Products Rotation] Error reading localStorage:', error);
        }
        return null;
    }

    /**
     * Check if rotation is needed
     * @param {Object|null} rotationData Stored rotation data
     * @param {string} currentOccasion Current active occasion
     * @returns {boolean} True if rotation is needed
     */
    shouldRotate(rotationData, currentOccasion) {
        if (!rotationData) {
            return true; // No stored data, need rotation
        }

        // Occasion changed, need rotation
        if (rotationData.occasion !== currentOccasion) {
            console.log('[Special Products Rotation] Occasion changed from', rotationData.occasion, 'to', currentOccasion);
            return true;
        }

        // Check if 12 hours have passed
        const now = Date.now();
        const timeSinceRotation = now - rotationData.timestamp;
        const rotationNeeded = timeSinceRotation >= this.ROTATION_INTERVAL;

        if (rotationNeeded) {
            console.log('[Special Products Rotation] 12 hours passed since last rotation');
        }

        return rotationNeeded;
    }

    /**
     * Generate new rotation with random products
     * @param {string} occasion Active occasion ID
     * @returns {Array} Array of selected products
     */
    generateNewRotation(occasion) {
        console.log('[Special Products Rotation] Generating rotation for:', occasion);

        const allProducts = this.getProductsForOccasion(occasion);
        console.log('[Special Products Rotation] Retrieved products:', allProducts ? allProducts.length : 0);

        if (!allProducts || allProducts.length === 0) {
            console.warn('[Special Products Rotation] ⚠ No products found for occasion:', occasion);
            console.log('[Special Products Rotation] Attempting fallback to default products...');

            // Fallback to default products if available
            const defaultProducts = this.getProductsForOccasion('default');
            if (defaultProducts && defaultProducts.length > 0) {
                console.log('[Special Products Rotation] ✓ Using default products:', defaultProducts.length);
                return this.selectAndStoreProducts(defaultProducts, 'default');
            }

            // Last resort: return empty array
            console.error('[Special Products Rotation] ✗ No products available at all!');
            return [];
        }

        return this.selectAndStoreProducts(allProducts, occasion);
    }

    /**
     * Get products for a specific occasion
     * @param {string} occasion Occasion ID
     * @returns {Array} Array of products
     */
    getProductsForOccasion(occasion) {
        console.log('[Special Products Rotation] Getting products for occasion:', occasion);

        const productSource = this.occasionProductMap[occasion];

        if (!productSource) {
            console.warn('[Special Products Rotation] Unknown occasion:', occasion);
            console.log('[Special Products Rotation] Available occasions:', Object.keys(this.occasionProductMap));
            return [];
        }

        console.log('[Special Products Rotation] Looking for product source:', productSource);

        // Check if product data is available in window
        if (typeof window[productSource] !== 'undefined') {
            const data = window[productSource];
            console.log('[Special Products Rotation] Found window.' + productSource, typeof data);

            // Handle modern format (object with products array)
            if (data && data.products && Array.isArray(data.products)) {
                console.log('[Special Products Rotation] ✓ Found', data.products.length, 'products for', occasion, '(modern format)');
                return data.products;
            }

            // Handle legacy format (direct array)
            if (Array.isArray(data)) {
                console.log('[Special Products Rotation] ✓ Found', data.length, 'products for', occasion, '(legacy format)');
                return data;
            }

            console.warn('[Special Products Rotation] Product source found but invalid format:', typeof data);
        } else {
            console.warn('[Special Products Rotation] Product source not found in window:', productSource);
            console.log('[Special Products Rotation] Available window properties:', Object.keys(window).filter(key => key.toLowerCase().includes('product')));
        }

        // Try to load from product rotation manager if available
        if (typeof ProductRotationManager !== 'undefined') {
            try {
                ProductRotationManager.init();
                if (window.specialOffersData && Array.isArray(window.specialOffersData)) {
                    console.log('[Special Products Rotation] Loaded from ProductRotationManager:', window.specialOffersData.length, 'products');
                    return window.specialOffersData;
                }
            } catch (error) {
                console.error('[Special Products Rotation] Error loading from ProductRotationManager:', error);
            }
        }

        console.error('[Special Products Rotation] No products found for occasion:', occasion);
        return [];
    }

    /**
     * Randomly select products and store in localStorage
     * @param {Array} products All available products
     * @param {string} occasion Current occasion
     * @returns {Array} Selected products
     */
    selectAndStoreProducts(products, occasion) {
        // Shuffle products
        const shuffled = this.shuffleArray([...products]);

        // Select up to MAX_PRODUCTS (or all if fewer available)
        const selected = shuffled.slice(0, Math.min(this.MAX_PRODUCTS, products.length));

        console.log('[Special Products Rotation] Selected', selected.length, 'products out of', products.length);

        // Store in localStorage
        const rotationData = {
            timestamp: Date.now(),
            occasion: occasion,
            products: selected
        };

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(rotationData));
            console.log('[Special Products Rotation] Stored rotation data in localStorage');
        } catch (error) {
            console.error('[Special Products Rotation] Error storing to localStorage:', error);
        }

        return selected;
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     * @param {Array} array Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Force a new rotation (useful for testing or manual refresh)
     */
    forceRotation() {
        console.log('[Special Products Rotation] Forcing new rotation...');
        localStorage.removeItem(this.STORAGE_KEY);
        return this.init();
    }

    /**
     * Get time until next rotation in milliseconds
     * @returns {number} Milliseconds until next rotation
     */
    getTimeUntilNextRotation() {
        const rotationData = this.getStoredRotation();
        if (!rotationData) {
            return 0;
        }

        const timeSinceRotation = Date.now() - rotationData.timestamp;
        const timeRemaining = this.ROTATION_INTERVAL - timeSinceRotation;

        return Math.max(0, timeRemaining);
    }

    /**
     * Get human-readable time until next rotation
     * @returns {string} Formatted time string
     */
    getTimeUntilNextRotationFormatted() {
        const ms = this.getTimeUntilNextRotation();
        const hours = Math.floor(ms / (60 * 60 * 1000));
        const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

        return `${hours}h ${minutes}m`;
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.SpecialProductsRotationManager = SpecialProductsRotationManager;
    window.specialProductsRotationManager = new SpecialProductsRotationManager();

    // Debug helper: Add to window for testing in console
    window.debugSpecialProducts = {
        forceRotation: () => window.specialProductsRotationManager.forceRotation(),
        getTimeRemaining: () => window.specialProductsRotationManager.getTimeUntilNextRotationFormatted(),
        getCurrentData: () => window.specialProductsRotationManager.getStoredRotation()
    };
}

// Export for backend use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SpecialProductsRotationManager };
}
