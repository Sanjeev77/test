// Amazon Affiliate Configuration and Link Localization
// Routes affiliate links through server-side redirect for proper country detection

(function() {
    'use strict';

    // Server-side redirect path
    const REDIRECT_PATH = '/redirect.php';

    // Affiliate tags for different Amazon marketplaces
    const AFFILIATE_CONFIG = {
        'US': {
            domain: 'amazon.com',
            tag: 'giftonbudge0f-20'
        },
        'IN': {
            domain: 'amazon.in',
            tag: 'giftonbudget-21'
        },
        // Default fallback
        'DEFAULT': {
            domain: 'amazon.com',
            tag: 'giftonbudge0f-20'
        }
    };

    /**
     * Extract ASIN from various Amazon URL formats
     * Supports: /dp/ASIN, /gp/product/ASIN, /product/ASIN, etc.
     */
    function extractASIN(url) {
        if (!url) return null;

        // Common patterns for ASIN in Amazon URLs
        const patterns = [
            /\/dp\/([A-Z0-9]{10})/,
            /\/gp\/product\/([A-Z0-9]{10})/,
            /\/product\/([A-Z0-9]{10})/,
            /\/ASIN\/([A-Z0-9]{10})/,
            /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }

    /**
     * Build Amazon product URL with localized domain and affiliate tag
     */
    function buildLocalizedLink(asin, countryCode) {
        const config = AFFILIATE_CONFIG[countryCode] || AFFILIATE_CONFIG['DEFAULT'];
        return `https://www.${config.domain}/dp/${asin}?tag=${config.tag}`;
    }

    /**
     * Expand shortened amzn.to URL to get full URL (with ASIN)
     * Note: This uses a simple redirect following approach
     */
    async function expandShortLink(shortUrl) {
        try {
            // Create a temporary link and try to follow redirect
            const response = await fetch(shortUrl, {
                method: 'HEAD',
                redirect: 'follow'
            });

            if (response.url && response.url !== shortUrl) {
                return response.url;
            }
        } catch (error) {
            // CORS or network error - fallback to original
            console.warn('Could not expand short link:', error);
        }

        return shortUrl;
    }

    /**
     * Convert affiliate link to use server-side redirect
     * This ensures proper country detection and ASIN extraction
     *
     * ALWAYS routes through redirect.php - let server handle country detection
     * This avoids timing issues with async geolocation
     */
    window.convertAffiliateLink = async function(originalLink) {
        // Always route through server-side redirect
        // The server will detect country and redirect appropriately
        return `${REDIRECT_PATH}?url=${encodeURIComponent(originalLink)}`;
    };

    /**
     * Synchronous version - routes through server-side redirect
     * Use this when async/await is not feasible
     *
     * ALWAYS routes through redirect.php - let server handle country detection
     */
    window.convertAffiliateLinkSync = function(originalLink) {
        // Always route through server-side redirect
        return `${REDIRECT_PATH}?url=${encodeURIComponent(originalLink)}`;
    };

    /**
     * Batch convert multiple links (useful for product grids)
     *
     * ALWAYS wraps all links through redirect.php - let server handle country detection
     */
    window.batchConvertAffiliateLinks = async function(products) {
        // Wrap ALL links with redirect handler for all users
        // Server will decide whether to redirect based on country
        products.forEach(product => {
            if (product.affiliateLink) {
                product.affiliateLink = `${REDIRECT_PATH}?url=${encodeURIComponent(product.affiliateLink)}`;
            }
            if (product.link) {
                product.link = `${REDIRECT_PATH}?url=${encodeURIComponent(product.link)}`;
            }
        });

        return products;
    };

    console.log('Affiliate link converter initialized');

})();
