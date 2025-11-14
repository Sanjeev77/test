// Main JavaScript file for budget pages functionality

// Global variables
let allProducts = [];
let currentProducts = [];
let filteredProducts = [];

// Initialize budget page with specific price range
function initializeBudgetPage(budget) {
    console.log('Initializing budget page for:', budget);

    // Ensure allProductsData is available
    if (typeof allProductsData === 'undefined') {
        console.error('allProductsData is not available');
        displayErrorMessage('Product data failed to load');
        return;
    }

    // Get DOM elements
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search');

    if (!productsContainer) {
        console.error('Products container not found!');
        displayErrorMessage('Page initialization failed');
        return;
    }

    // Load and filter products
    loadProducts();
    filterAndDisplayProducts(budget);

    // Set up search functionality
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Load products from allProductsData
function loadProducts() {
    console.log('Loading products...');

    // Get all products and ensure they have priceValue
    allProducts = allProductsData.map(product => ({
        ...product,
        priceValue: product.priceValue || parseFloat(product.price) || 0
    }));

    console.log('Loaded products:', allProducts.length);
}

// Initialize category page with specific category
function initializeCategoryPage(category) {
    console.log('Initializing category page for:', category);

    // Debug: Check if allProductsData exists and log its length
    const dataSource = typeof allProductsData !== 'undefined' ? allProductsData : window.allProductsData;
    console.log('allProductsData exists:', typeof allProductsData !== 'undefined');
    console.log('window.allProductsData exists:', typeof window.allProductsData !== 'undefined');
    console.log('Using data source:', dataSource ? 'Found' : 'Not found');

    if (dataSource) {
        console.log('Total products in allProductsData:', dataSource.length);

        // Debug: Count products by category
        const categoryCounts = {};
        dataSource.forEach(product => {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        });
        console.log('Products by category:', categoryCounts);
    }

    // Ensure allProductsData is available (check both global and window)
    if (typeof allProductsData === 'undefined' && typeof window.allProductsData === 'undefined') {
        console.error('allProductsData is not available');
        displayErrorMessage('Product data failed to load');
        return;
    }

    // Use whichever is available
    if (typeof allProductsData === 'undefined' && typeof window.allProductsData !== 'undefined') {
        allProductsData = window.allProductsData;
        console.log('Using window.allProductsData as fallback');
    }

    // Get DOM elements
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search');

    if (!productsContainer) {
        console.error('Products container not found!');
        displayErrorMessage('Page initialization failed');
        return;
    }

    // Load and filter products by category
    loadProducts();
    filterAndDisplayByCategory(category);

    // Set up search functionality
    if (searchInput) {
        searchInput.addEventListener('input', () => handleCategorySearch(category));
    }
}

// Filter and display products by category
function filterAndDisplayByCategory(category) {
    console.log('Filtering products by category:', category);

    // Filter products by category
    currentProducts = allProducts.filter(product =>
        product.category === category
    );

    console.log(`Found ${currentProducts.length} products in ${category} category`);

    // Sort by price (lowest to highest)
    currentProducts.sort((a, b) => a.priceValue - b.priceValue);

    // Display products
    renderProducts(currentProducts);
}

// Handle search within category
function handleCategorySearch(category) {
    const searchInput = document.getElementById('search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    console.log('Category search term:', searchTerm);

    if (searchTerm === '') {
        // If no search term, show all products in category
        filterAndDisplayByCategory(category);
        return;
    }

    // Filter category products by search term
    const categoryProducts = allProducts.filter(product =>
        product.category === category
    );

    const searchResults = categoryProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    // Sort by price (lowest to highest)
    searchResults.sort((a, b) => a.priceValue - b.priceValue);

    console.log(`Found ${searchResults.length} search results in ${category}`);
    renderProducts(searchResults);
}

// Filter category by budget (for budget filter buttons)
function filterCategoryByBudget(budget) {
    console.log('Filtering category by budget:', budget);

    // Get current category from URL or page context
    const pathName = window.location.pathname;
    const pageName = pathName.split('/').pop().replace('.html', '');

    // Map page names to categories
    const categoryMap = {
        'appliances': 'appliances',
        'baby-essentials': 'baby',
        'electronics': 'electronics',
        'fashion': 'fashion',
        'beauty': 'beauty',
        'automotive': 'automotive',
        'home-kitchen': 'home-kitchen',
        'health-personal-care': 'health-personal-care',
        'pet-supplies': 'pet-supplies',
        'sports-outdoors': 'sports-outdoors',
        'toys-games': 'toys-games',
        'books': 'books',
        'diaries': 'diaries',
        // Gift Categories
        'housewarming-gifts': 'housewarming-gifts',
        'anniversary-gifts': 'anniversary-gifts',
        'retirement-gifts': 'retirement-gifts',
        'birthday-gifts-for-her': 'birthday-gifts-for-her',
        'birthday-gifts-for-him': 'birthday-gifts-for-him',
        'gifts-for-coworkers': 'gifts-for-coworkers',
        'gifts-for-new-moms': 'gifts-for-new-moms',
        'bridal-shower-gifts': 'bridal-shower-gifts',
        'baby-shower-gifts': 'baby-shower-gifts',
        'flower-delivery': 'flower-delivery',
        'gift-baskets': 'gift-baskets',
        'photo-gifts': 'photo-gifts',
        'birthday-gifts-for-him': 'birthday-gifts-for-him',
        'birthday-gifts-for-girlfriends': 'birthday-gifts-for-girlfriends',
        'birthday-gifts-for-moms': 'birthday-gifts-for-moms',
        'birthday-gifts-for-dads': 'birthday-gifts-for-dads',
        'birthday-gifts-for-grandparents': 'birthday-gifts-for-grandparents',
        'birthday-gifts-for-someone-who-has-everything': 'birthday-gifts-for-someone-who-has-everything',
        'birthday-gifts-for-couples': 'birthday-gifts-for-couples',
        'birthday-gifts-for-best-friends': 'birthday-gifts-for-best-friends',
        'personalized-birthday-gifts': 'personalized-birthday-gifts'
    };

    const category = categoryMap[pageName] || pageName;

    // First filter by category
    let categoryProducts = allProducts.filter(product =>
        product.category === category
    );

    // Then filter by budget if not 'all'
    if (budget !== 'all') {
        categoryProducts = categoryProducts.filter(product => {
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

    // Sort by price (lowest to highest)
    categoryProducts.sort((a, b) => a.priceValue - b.priceValue);

    console.log(`Found ${categoryProducts.length} products for ${category} with budget ${budget}`);
    renderProducts(categoryProducts);

    // Update active button
    updateBudgetButtons(budget);
}

// Update budget filter buttons
function updateBudgetButtons(activeBudget) {
    const budgetButtons = document.querySelectorAll('.budget-btn');
    budgetButtons.forEach(button => {
        const buttonBudget = button.getAttribute('data-budget');
        if (buttonBudget === activeBudget) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Filter and display products based on budget
function filterAndDisplayProducts(budget) {
    console.log('Filtering products by budget:', budget);

    if (allProducts.length === 0) {
        loadProducts();
    }

    let filteredProducts = [...allProducts];

    // Apply budget filter
    if (budget !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
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

    // Sort by price (lowest to highest)
    filteredProducts.sort((a, b) => a.priceValue - b.priceValue);

    // Store current filtered products
    currentProducts = filteredProducts;

    console.log('Filtered products:', filteredProducts.length);

    // Render the products
    renderProducts(filteredProducts);
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (searchTerm === '') {
        // Show all current products if search is empty
        renderProducts(currentProducts);
        return;
    }

    // Filter current products by search term
    const searchResults = currentProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );

    renderProducts(searchResults);
}

// Render products
async function renderProducts(products) {
    console.log('Rendering products:', products.length);

    const productsContainer = document.getElementById('products-container');
    const noResults = document.getElementById('no-results');

    if (!productsContainer) {
        console.error('Products container not found!');
        return;
    }

    if (products.length === 0) {
        console.log('No products to display');
        productsContainer.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    // Convert affiliate links based on user's country
    if (window.batchConvertAffiliateLinks) {
        products = await window.batchConvertAffiliateLinks(products);
    }

    // Generate product cards HTML
    const productsHTML = products.map(product => createProductCard(product)).join('');
    productsContainer.innerHTML = productsHTML;

    console.log('Successfully rendered', products.length, 'products');
}

// Create product card HTML
function createProductCard(product) {
    const stars = '★'.repeat(Math.floor(product.rating)) +
                 (product.rating % 1 >= 0.5 ? '☆' : '') +
                 '☆'.repeat(5 - Math.ceil(product.rating));

    // Handle special offer badge if product has discount info
    const specialOfferBadge = product.discount ?
        `<div class="special-offer-badge">${product.discount} OFF</div>` :
        (product.specialOffer ? `<div class="special-offer-badge">Special Offer</div>` : '');

    // Handle original price display
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
                <div class="product-price">
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

// Handle product card click
function handleProductCardClick(event, affiliateLink) {
    if (event.target.tagName === 'A') {
        return; // Let the link handle its own click
    }
    window.open(affiliateLink, '_blank', 'noopener');
}

// Handle product image click
function handleProductImageClick(event, affiliateLink) {
    event.stopPropagation();
    window.open(affiliateLink, '_blank', 'noopener');
}

// Display error message
function displayErrorMessage(message) {
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        productsContainer.innerHTML = `
            <div style="background: #ffebee; color: #c62828; padding: 20px; border-radius: 8px; text-align: center;">
                <h3>Error</h3>
                <p>${message}</p>
                <p>Please try refreshing the page.</p>
            </div>
        `;
    }
}

// Global variable for current search results
let currentSearchResults = [];

// Initialize main page search functionality
function initializeMainPageSearch() {
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category-select');
    const backButton = document.getElementById('back-to-main');
    const mainContent = document.querySelector('.ads-layout');
    const searchResultsSection = document.getElementById('search-results-section');

    if (!searchButton || !searchInput || !categorySelect) {
        console.log('Search elements not found on this page');
        return;
    }

    // Load products if not loaded
    if (allProducts.length === 0) {
        loadProducts();
    }

    // Search button click
    searchButton.addEventListener('click', function() {
        performMainSearch();
    });

    // Enter key in search input
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performMainSearch();
        }
    });

    // Budget filter buttons
    const budgetButtons = document.querySelectorAll('#search-results-section .budget-btn');
    budgetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const budget = this.getAttribute('data-budget');
            filterSearchByBudget(budget);
        });
    });

    // Back button
    if (backButton) {
        backButton.addEventListener('click', function() {
            searchResultsSection.style.display = 'none';
            if (mainContent) mainContent.style.display = 'flex';
            // Hide mobile ads if needed
            const mobileTop = document.querySelector('.mobile-ad-top');
            const mobileBottom = document.querySelector('.mobile-ad-bottom');
            if (mobileTop) mobileTop.style.display = 'block';
            if (mobileBottom) mobileBottom.style.display = 'block';
        });
    }

    function performMainSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categorySelect.value;

        let filteredProducts = [...allProducts];

        // Filter by category if not 'all'
        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product =>
                product.category === selectedCategory
            );
        }

        // Filter by search term (title or category)
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                product.title.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }

        // Sort by price (lowest to highest)
        filteredProducts.sort((a, b) => a.priceValue - b.priceValue);

        // Store current search results
        currentSearchResults = filteredProducts;

        // Render results
        renderProducts(filteredProducts);

        // Show search results, hide main content
        if (mainContent) mainContent.style.display = 'none';
        searchResultsSection.style.display = 'block';

        // Hide mobile ads
        const mobileTop = document.querySelector('.mobile-ad-top');
        const mobileBottom = document.querySelector('.mobile-ad-bottom');
        if (mobileTop) mobileTop.style.display = 'none';
        if (mobileBottom) mobileBottom.style.display = 'none';

        // Reset budget filter to 'all'
        updateSearchBudgetButtons('all');
    }
}

// Filter search results by budget
function filterSearchByBudget(budget) {
    console.log('Filtering search results by budget:', budget);

    let filteredResults = [...currentSearchResults];

    // Apply budget filter if not 'all'
    if (budget !== 'all') {
        filteredResults = filteredResults.filter(product => {
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

    // Sort by price (lowest to highest)
    filteredResults.sort((a, b) => a.priceValue - b.priceValue);

    console.log(`Found ${filteredResults.length} search results for budget ${budget}`);
    renderProducts(filteredResults);

    // Update active button
    updateSearchBudgetButtons(budget);
}

// Update search budget filter buttons
function updateSearchBudgetButtons(activeBudget) {
    const budgetButtons = document.querySelectorAll('#search-results-section .budget-btn');
    budgetButtons.forEach(button => {
        const buttonBudget = button.getAttribute('data-budget');
        if (buttonBudget === activeBudget) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Initialize main page search if on index.html
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    document.addEventListener('DOMContentLoaded', initializeMainPageSearch);
    document.addEventListener('DOMContentLoaded', loadSpecialProductIcons);
    document.addEventListener('DOMContentLoaded', initializeSpecialProductsNavigation);
}

// Load Special Product Icons for Homepage
function loadSpecialProductIcons() {
    console.log('Loading special product icons...');

    const container = document.getElementById('special-products-icons');

    if (!container) {
        console.log('Special products icons container not found on this page');
        return;
    }

    let specialProducts = [];

    // Load from Special Products Rotation Manager (automated system)
    if (typeof window.specialProductsRotationManager !== 'undefined') {
        console.log('Loading from Special Products Rotation Manager...');
        try {
            specialProducts = window.specialProductsRotationManager.init();
            console.log(`Rotation Manager returned ${specialProducts.length} products`);
        } catch (error) {
            console.error('Error loading from Rotation Manager:', error);
        }
    } else {
        console.error('Special Products Rotation Manager not found!');
    }

    // If no products loaded, show error message
    if (specialProducts.length === 0) {
        console.error('No product data available from rotation manager');
        container.innerHTML = '<p style="text-align: center; color: #6c757d;">Unable to load products. Please refresh the page.</p>';
        return;
    }

    console.log(`Found ${specialProducts.length} special products`);

    // Generate product icons HTML
    const iconsHTML = specialProducts.map(product => createSpecialProductIcon(product)).join('');
    container.innerHTML = iconsHTML;

    console.log('Successfully loaded special product icons');
}

// Create special product icon HTML
function createSpecialProductIcon(product) {
    return `
        <div class="special-product-item" onclick="window.open('${product.affiliateLink}', '_blank', 'noopener')">
            <div class="special-product-icon">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="special-product-name">${product.title}</div>
            <div class="special-product-price">$${product.price}</div>
        </div>
    `;
}

// Initialize navigation for special products carousel
function initializeSpecialProductsNavigation() {
    const leftArrow = document.getElementById('special-products-left');
    const rightArrow = document.getElementById('special-products-right');
    const carousel = document.getElementById('special-products-icons');

    if (!leftArrow || !rightArrow || !carousel) {
        console.log('Navigation elements not found');
        return;
    }

    // Scroll amount (adjust based on item width + gap)
    const scrollAmount = 300;

    // Auto-scroll configuration
    let animationFrameId = null;
    let isPaused = false;
    let isManualScrolling = false;
    let scrollDirection = 1; // 1 for right, -1 for left
    const scrollSpeed = 0.8; // Pixels per frame (adjusted for smooth, moderate speed)
    const pauseDuration = 5000; // Pause for 5 seconds on user interaction
    let lastTimestamp = 0;
    let manualScrollTimeout = null;

    // Left arrow click
    leftArrow.addEventListener('click', () => {
        pauseAutoScroll();
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    // Right arrow click
    rightArrow.addEventListener('click', () => {
        pauseAutoScroll();
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Update arrow states on scroll
    function updateArrowStates() {
        const isAtStart = carousel.scrollLeft <= 0;
        const isAtEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1;

        leftArrow.disabled = isAtStart;
        rightArrow.disabled = isAtEnd;
    }

    // Smooth continuous auto-scroll function using requestAnimationFrame
    function autoScroll(timestamp) {
        if (isPaused || isManualScrolling) {
            animationFrameId = null;
            return;
        }

        // Initialize timestamp on first run
        if (!lastTimestamp) lastTimestamp = timestamp;

        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        const currentScroll = carousel.scrollLeft;

        // Check if we've reached the end (scrolling right)
        if (scrollDirection === 1 && currentScroll >= maxScroll - 1) {
            scrollDirection = -1; // Reverse to left
        }
        // Check if we've reached the start (scrolling left)
        else if (scrollDirection === -1 && currentScroll <= 1) {
            scrollDirection = 1; // Reverse to right
        }

        // Direct scrollLeft manipulation for smoothest performance
        carousel.scrollLeft += scrollSpeed * scrollDirection;

        // Continue the animation loop
        animationFrameId = requestAnimationFrame(autoScroll);
    }

    // Start auto-scroll
    function startAutoScroll() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        lastTimestamp = 0; // Reset timestamp
        animationFrameId = requestAnimationFrame(autoScroll);
    }

    // Stop auto-scroll
    function stopAutoScroll() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        lastTimestamp = 0;
    }

    // Pause auto-scroll temporarily
    function pauseAutoScroll() {
        isPaused = true;
        stopAutoScroll();

        // Resume after pause duration
        setTimeout(() => {
            isPaused = false;
            startAutoScroll();
        }, pauseDuration);
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        pauseAutoScroll();
    });

    // Pause on touch/click
    carousel.addEventListener('touchstart', (e) => {
        pauseAutoScroll();
    }, { passive: true });

    carousel.addEventListener('click', (e) => {
        // Only pause if clicking on the carousel itself, not on product links
        if (!e.target.closest('a')) {
            pauseAutoScroll();
        }
    });

    // Handle manual scroll detection with debouncing
    let userScrolling = false;
    carousel.addEventListener('scroll', () => {
        // Only update arrow states, don't interfere with auto-scroll
        updateArrowStates();
    }, { passive: true });

    // Detect user interaction (wheel, touch, trackpad)
    carousel.addEventListener('wheel', () => {
        if (!userScrolling) {
            userScrolling = true;
            isManualScrolling = true;
            stopAutoScroll();
        }

        if (manualScrollTimeout) {
            clearTimeout(manualScrollTimeout);
        }

        manualScrollTimeout = setTimeout(() => {
            userScrolling = false;
            isManualScrolling = false;
            if (!isPaused) {
                startAutoScroll();
            }
        }, 1000);
    }, { passive: true });

    carousel.addEventListener('touchstart', () => {
        if (!userScrolling) {
            userScrolling = true;
            isManualScrolling = true;
            stopAutoScroll();
        }
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        if (manualScrollTimeout) {
            clearTimeout(manualScrollTimeout);
        }

        manualScrollTimeout = setTimeout(() => {
            userScrolling = false;
            isManualScrolling = false;
            if (!isPaused) {
                startAutoScroll();
            }
        }, 1000);
    }, { passive: true });

    // Initial state
    updateArrowStates();

    // Start auto-scroll after a short delay
    setTimeout(() => {
        startAutoScroll();
    }, 1000);

    // Update on window resize
    window.addEventListener('resize', updateArrowStates);

    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoScroll();
        } else {
            if (!isPaused) {
                startAutoScroll();
            }
        }
    });
}

// Footer Toggle Functionality for Mobile
document.addEventListener('DOMContentLoaded', function() {
    const footerHeadings = document.querySelectorAll('.footer-heading');

    footerHeadings.forEach(heading => {
        heading.addEventListener('click', function() {
            // Only toggle on mobile (max-width: 768px)
            if (window.innerWidth <= 768) {
                const parentColumn = this.closest('.footer-column');
                if (parentColumn) {
                    parentColumn.classList.toggle('active');

                    // Toggle the + and - icon
                    const toggleIcon = this.querySelector('.footer-toggle');
                    if (toggleIcon) {
                        toggleIcon.textContent = parentColumn.classList.contains('active') ? '-' : '+';
                    }
                }
            }
        });
    });

    // Remove active class on desktop resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const footerColumns = document.querySelectorAll('.footer-column');
            footerColumns.forEach(column => {
                column.classList.remove('active');

                // Reset toggle icons to +
                const toggleIcon = column.querySelector('.footer-toggle');
                if (toggleIcon) {
                    toggleIcon.textContent = '+';
                }
            });
        }
    });
});