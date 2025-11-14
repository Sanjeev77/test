// ========================================
// FATHER'S DAY GIFTS PRODUCTS
// ========================================
// Occasion: Father's Day Gifts
// Active Dates: June 1 - June 15
// Export from backend admin to populate this file
// ========================================

const fathersdayProducts = {
    occasion: 'fathersday',
    config: {
        name: "Father's Day Gifts",
        slug: "fathersday",
        description: "Discover amazing father's day gifts for everyone on your list!",
        enabled: true,
        seoTitle: "Father's Day Gifts",
        seoDescription: "Shop the best father's day gifts on Amazon - perfect gifts with fast shipping!",
        lastUpdated: new Date().toISOString()
    },
    products: [
        // Products will be added when you export from backend admin
        // Use Custom Category tab → Select "Father's Day Gifts" → Add Products → Export
    ]
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = fathersdayProducts;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.fathersdayProducts = fathersdayProducts;
}
