// ========================================
// DEFAULT PRODUCTS - Fallback for off-season
// ========================================
// Used when no specific occasion is active
// ========================================

const defaultProducts = {
    occasion: 'default',
    config: {
        name: "Special Gift Deals",
        slug: "special-gift-deals",
        description: "Discover amazing gift deals for every occasion and budget",
        enabled: true,
        seoTitle: "Special Gift Deals",
        seoDescription: "Shop the best gift deals on Amazon - perfect gifts for every occasion and budget. Find unique gift ideas with fast shipping!",
        lastUpdated: new Date().toISOString()
    },
    products: [
        // Default/featured products will be loaded here
        // For now, this will show products from the last active occasion
    ]
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = defaultProducts;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.defaultProducts = defaultProducts;
}
