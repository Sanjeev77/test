// ========================================
// SPECIAL OFFERS PAGE - UI Functions
// ========================================
//
// This file contains the UI logic for special-offers.html
// Product data is loaded dynamically by product-rotation-manager.js
// based on the current seasonal occasion
//
// ========================================

// Note: Product data (specialOffersData) is loaded by product-rotation-manager.js
// and made available globally via window.specialOffersData
// Global variables for special offers page
let allSpecialOffers = [];
let currentSpecialOffers = [];
let filteredSpecialOffers = [];

// Initialize special offers page
function initializeSpecialOffersPage() {
    console.log('Initializing special offers page...');

    // Update SEO meta tags and page content if custom config is available
    updateSEOMetaTags();
    updatePageContent();

    // Get DOM elements
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search');

    if (!productsContainer) {
        console.error('Products container not found!');
        return;
    }

    // Load special offers data
    loadSpecialOffers();

    // Set up search functionality
    if (searchInput) {
        searchInput.addEventListener('input', handleSpecialOffersSearch);
    }

    // Display all special offers initially
    filterAndDisplaySpecialOffers('all');
}

// Load special offers from all available data
function loadSpecialOffers() {
    console.log('Loading special offers...');

    // Start with our special offers data
    allSpecialOffers = [...specialOffersData];

    // If allProductsData is available, add products marked as special offers
    if (typeof allProductsData !== 'undefined') {
        const mainSpecialOffers = allProductsData.filter(product =>
            product.specialOffer || product.featured || product.discount
        );
        allSpecialOffers = [...allSpecialOffers, ...mainSpecialOffers];
    }

    // Ensure all products have priceValue for sorting
    allSpecialOffers.forEach(product => {
        if (!product.priceValue) {
            product.priceValue = parseFloat(product.price) || 0;
        }
    });

    console.log('Loaded special offers:', allSpecialOffers.length);
}

// Update SEO meta tags with custom category configuration
function updateSEOMetaTags() {
    if (typeof customCategoryConfig !== 'undefined' && customCategoryConfig) {
        console.log('Updating SEO meta tags with custom configuration');

        // Update page title (browser tab)
        if (customCategoryConfig.seoTitle) {
            document.title = customCategoryConfig.seoTitle + ' | Gift On Budget';
        } else if (customCategoryConfig.name) {
            document.title = customCategoryConfig.name + ' | Gift On Budget';
        }

        // Update meta description
        if (customCategoryConfig.seoDescription) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', customCategoryConfig.seoDescription);
            }
        } else if (customCategoryConfig.description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', customCategoryConfig.description);
            }
        }

        // Update Open Graph title
        if (customCategoryConfig.seoTitle || customCategoryConfig.name) {
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) {
                ogTitle.setAttribute('content', customCategoryConfig.seoTitle || customCategoryConfig.name);
            }
        }

        // Update Open Graph description
        if (customCategoryConfig.seoDescription || customCategoryConfig.description) {
            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription) {
                ogDescription.setAttribute('content', customCategoryConfig.seoDescription || customCategoryConfig.description);
            }
        }

        console.log('SEO meta tags updated successfully');
    }
}

// Update page content (H1, description, breadcrumb)
function updatePageContent() {
    if (typeof customCategoryConfig !== 'undefined' && customCategoryConfig) {
        console.log('Updating page content elements');

        // Update breadcrumb title
        const breadcrumbTitle = document.getElementById('breadcrumb-title');
        if (breadcrumbTitle && customCategoryConfig.name) {
            breadcrumbTitle.textContent = customCategoryConfig.name;
        }

        // Update main category name (H1)
        const categoryNameElement = document.getElementById('category-name');
        if (categoryNameElement && customCategoryConfig.name) {
            categoryNameElement.textContent = customCategoryConfig.name;
        }

        // Update page description (use Description field, not SEO Description)
        const pageDescription = document.getElementById('page-description');
        if (pageDescription) {
            if (customCategoryConfig.description) {
                pageDescription.textContent = customCategoryConfig.description;
            } else if (customCategoryConfig.seoDescription) {
                pageDescription.textContent = customCategoryConfig.seoDescription;
            }
        }

        console.log('Page content updated successfully');
    }
}

// Filter and display special offers
function filterAndDisplaySpecialOffers(budget) {
    console.log('Filtering special offers by budget:', budget);

    if (allSpecialOffers.length === 0) {
        loadSpecialOffers();
    }

    let filteredOffers = [...allSpecialOffers];

    // Apply budget filter
    if (budget !== 'all') {
        filteredOffers = filteredOffers.filter(product => {
            switch(budget) {
                case 'under-10':
                    return product.priceValue < 10;
                case 'under-25':
                    return product.priceValue >= 10 && product.priceValue < 25;
                case 'under-50':
                    return product.priceValue >= 25 && product.priceValue < 50;
                case 'under-100':
                    return product.priceValue >= 50 && product.priceValue < 100;
                default:
                    return true;
            }
        });
    }

    // Sort by price (highest to lowest)
    filteredOffers.sort((a, b) => b.priceValue - a.priceValue);

    // Store current filtered offers
    currentSpecialOffers = filteredOffers;
    filteredSpecialOffers = [...filteredOffers];

    console.log('Filtered special offers:', filteredOffers.length);

    // Render the products
    renderSpecialOffers(filteredOffers);
}

// Handle search functionality
function handleSpecialOffersSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (searchTerm === '') {
        // Show all current special offers if search is empty
        renderSpecialOffers(currentSpecialOffers);
        return;
    }

    // Filter current special offers by search term
    const searchResults = currentSpecialOffers.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );

    renderSpecialOffers(searchResults);
}

// Render special offers products
function renderSpecialOffers(offers) {
    console.log('Rendering special offers:', offers.length);

    const productsContainer = document.getElementById('products-container');
    const noResults = document.getElementById('no-results');

    if (!productsContainer) {
        console.error('Products container not found!');
        return;
    }

    if (offers.length === 0) {
        console.log('No special offers to display');
        productsContainer.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    // Generate product cards HTML
    const productsHTML = offers.map(product => createSpecialOfferCard(product)).join('');
    productsContainer.innerHTML = productsHTML;

    console.log('Successfully rendered', offers.length, 'special offers');
}

// Create special offer product card
function createSpecialOfferCard(product) {
    const stars = '★'.repeat(Math.floor(product.rating)) +
                 (product.rating % 1 >= 0.5 ? '☆' : '') +
                 '☆'.repeat(5 - Math.ceil(product.rating));

    // Only show special offer badge if product has discount info or is marked as special offer
    const specialOfferBadge = product.discount ?
        `<div class="special-offer-badge">${product.discount} OFF</div>` :
        (product.specialOffer ? `<div class="special-offer-badge">Special Offer</div>` : '');

    // Only show original price if it exists
    const originalPriceDisplay = product.originalPrice ?
        `<span class="original-price">$${product.originalPrice}</span>` : '';

    // Use appropriate class for price styling
    const priceClass = product.originalPrice ? 'current-price' : 'product-price';

    return `
        <div class="product-card ${specialOfferBadge ? 'special-offer-card' : ''}" data-id="${product.id}" data-affiliate-link="${product.affiliateLink}" onclick="handleProductCardClick(event, '${product.affiliateLink}')" style="cursor: pointer;">
            ${specialOfferBadge}
            <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy" onclick="handleProductImageClick(event, '${product.affiliateLink}')">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating" style="color: #ff9900; margin-bottom: 0.5rem;">
                    ${stars} (${product.rating})
                </div>
                <div class="${originalPriceDisplay ? 'product-price' : 'product-price'}">
                    ${originalPriceDisplay}
                    <span class="${priceClass}">$${product.price}</span>
                </div>
                <a href="${product.affiliateLink}" target="_blank" rel="noopener" class="product-btn">
                    View on Amazon
                </a>
            </div>
        </div>
    `;
}

// Handle product card click - fallback function if not defined elsewhere
function handleProductCardClick(event, affiliateLink) {
    if (event.target.tagName === 'A') {
        return; // Let the link handle its own click
    }
    window.open(affiliateLink, '_blank', 'noopener');
}

// Handle product image click - fallback function if not defined elsewhere
function handleProductImageClick(event, affiliateLink) {
    event.stopPropagation();
    window.open(affiliateLink, '_blank', 'noopener');
}

// Make functions available globally for HTML onclick handlers
if (typeof window !== 'undefined') {
    window.initializeSpecialOffersPage = initializeSpecialOffersPage;
    window.filterAndDisplaySpecialOffers = filterAndDisplaySpecialOffers;
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { specialOffersData, initializeSpecialOffersPage, filterAndDisplaySpecialOffers };
}