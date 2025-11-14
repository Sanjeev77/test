// Shared Banner Functionality for Banner-1 and Banner-2
// This file contains common functions used by both banner pages

let allBannerProducts = [];
let currentBannerProducts = [];

// Initialize banner page
function initializeBannerPage() {
    console.log('Initializing banner page...');

    // Update SEO meta tags
    updateBannerSEOMetaTags();

    // Get configuration and products based on current page
    const isBanner1 = window.location.pathname.includes('banner-1') || window.location.pathname.includes('gift-ideas-for-her');
    const isBanner2 = window.location.pathname.includes('banner-2') || window.location.pathname.includes('birthday-gift-ideas');
    const config = isBanner1 ? window.banner1Config : window.banner2Config;
    const products = isBanner1 ? window.banner1Products : window.banner2Products;

    console.log('Banner Config:', config);
    console.log('Products Count:', products ? products.length : 0);

    // Load products
    allBannerProducts = products || [];

    // Ensure all products have priceValue field for filtering
    allBannerProducts.forEach(product => {
        if (!product.priceValue && product.price) {
            // Extract numeric value from price string (e.g., "$19.99" -> 19.99)
            const priceStr = product.price.replace('$', '').replace(',', '');
            product.priceValue = parseFloat(priceStr) || 0;
        }
    });

    console.log('Loaded products:', allBannerProducts.length);

    // Display initial products (all)
    filterBannerByBudget('all');
}

// Update SEO meta tags from configuration
function updateBannerSEOMetaTags() {
    const isBanner1 = window.location.pathname.includes('banner-1') || window.location.pathname.includes('gift-ideas-for-her');
    const isBanner2 = window.location.pathname.includes('banner-2') || window.location.pathname.includes('birthday-gift-ideas');
    const config = isBanner1 ? window.banner1Config : window.banner2Config;

    if (!config) {
        console.warn('Banner config not found');
        return;
    }

    console.log('Updating SEO with config:', config);

    // Update page title
    if (config.seoTitle) {
        document.title = config.seoTitle;
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && config.seoDescription) {
        metaDesc.setAttribute('content', config.seoDescription);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && config.seoKeywords) {
        metaKeywords.setAttribute('content', config.seoKeywords);
    }

    // Update page header elements
    const categoryNameElement = document.getElementById('category-name');
    if (categoryNameElement && config.name) {
        categoryNameElement.textContent = config.name;
    }

    const pageDescElement = document.getElementById('page-description');
    if (pageDescElement && config.description) {
        pageDescElement.textContent = config.description;
    }

    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    if (breadcrumbTitle) {
        breadcrumbTitle.textContent = config.name || 'Special Offers';
    }
}

// Filter products by budget
function filterBannerByBudget(budget) {
    console.log('Filtering banner products by budget:', budget);

    let filteredProducts = [...allBannerProducts];

    // Apply budget filter
    if (budget !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
            const price = product.priceValue;
            switch(budget) {
                case 'under-10':
                    return price < 10;
                case 'under-25':
                    return price >= 10 && price < 25;
                case 'under-50':
                    return price >= 25 && price < 50;
                case 'under-100':
                    return price >= 50 && price < 100;
                default:
                    return true;
            }
        });
    }

    console.log('Filtered products:', filteredProducts.length);

    // Sort by price (highest to lowest)
    filteredProducts.sort((a, b) => b.priceValue - a.priceValue);

    currentBannerProducts = filteredProducts;

    // Render products
    renderBannerProducts(filteredProducts);

    // Update active button
    document.querySelectorAll('.budget-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-budget="${budget}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Render banner products to the page
async function renderBannerProducts(products) {
    const container = document.getElementById('products-container');
    const noResults = document.getElementById('no-results');

    if (!container) {
        console.error('Products container not found');
        return;
    }

    if (products.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    // Convert affiliate links based on user's country
    if (window.batchConvertAffiliateLinks) {
        products = await window.batchConvertAffiliateLinks(products);
    }

    const html = products.map(product => createBannerProductCard(product)).join('');
    container.innerHTML = html;
}

// Create product card HTML
function createBannerProductCard(product) {
    const rating = product.rating || 0;
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    const starsHtml = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);

    return `
        <div class="product-card">
            ${product.featured ? '<span class="featured-badge">Featured</span>' : ''}
            <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                ${rating > 0 ? `
                <div class="product-rating">
                    <span class="stars">${starsHtml}</span>
                    <span class="rating-value">(${rating})</span>
                </div>
                ` : ''}
                <div class="product-price-section">
                    <div class="product-price">$${product.price}</div>
                    ${product.originalPrice ? `<div class="original-price">$${product.originalPrice}</div>` : ''}
                </div>
                <a href="${product.affiliateLink}" target="_blank" rel="noopener noreferrer" class="product-btn">
                    View on Amazon
                </a>
            </div>
        </div>
    `;
}

// Search functionality
function setupBannerSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase().trim();

        if (term === '') {
            renderBannerProducts(currentBannerProducts);
            return;
        }

        const results = currentBannerProducts.filter(product =>
            product.title.toLowerCase().includes(term)
        );

        console.log('Search results:', results.length, 'for term:', term);
        renderBannerProducts(results);
    });

    // Also add search button functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchInput.dispatchEvent(new Event('input'));
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Banner shared JS loaded');
    initializeBannerPage();
    setupBannerSearch();
});

// Export for use in HTML onclick handlers
window.filterBannerByBudget = filterBannerByBudget;
