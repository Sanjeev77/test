// ========================================
// MOTHER'S DAY GIFTS PRODUCTS
// ========================================
// Occasion: Mother's Day Gifts
// Active Dates: April 25 - May 11
// Export from backend admin to populate this file
// ========================================

const mothersdayProducts = {
    occasion: 'mothersday',
    config: {
        name: "Mother's Day Gifts",
        slug: "mothersday",
        description: "Discover amazing mother's day gifts for everyone on your list!",
        enabled: true,
        seoTitle: "Mother's Day Gifts",
        seoDescription: "Shop the best mother's day gifts on Amazon - perfect gifts with fast shipping!",
        lastUpdated: new Date().toISOString()
    },
    products: [
        // Products will be added when you export from backend admin
        // Use Custom Category tab → Select "Mother's Day Gifts" → Add Products → Export
    ]
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mothersdayProducts;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.mothersdayProducts = mothersdayProducts;
}
