// Banner 2 - Trending Deals - Collection 2
// These products appear in the Banner 2 section (Trending Deals - Collection 2)

const banner2Products = [];

// Make data available globally
if (typeof window !== 'undefined') {
    window.banner2Products = banner2Products;
}

// Export for backend use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { banner2Products };
}