// Geolocation detection for Amazon affiliate link localization
// Detects user's country and caches result in localStorage

(function() {
    'use strict';

    // Cache key and expiry time (24 hours)
    const CACHE_KEY = 'userCountryCode';
    const CACHE_EXPIRY_KEY = 'userCountryCodeExpiry';
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Global variable to store country code
    window.userCountryCode = null;

    /**
     * Get cached country code if available and not expired
     */
    function getCachedCountry() {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

            if (cached && expiry) {
                const expiryTime = parseInt(expiry, 10);
                if (Date.now() < expiryTime) {
                    return cached;
                }
            }
        } catch (e) {
            console.warn('Error reading from localStorage:', e);
        }
        return null;
    }

    /**
     * Cache country code in localStorage
     */
    function cacheCountry(countryCode) {
        try {
            const expiry = Date.now() + CACHE_DURATION;
            localStorage.setItem(CACHE_KEY, countryCode);
            localStorage.setItem(CACHE_EXPIRY_KEY, expiry.toString());
        } catch (e) {
            console.warn('Error writing to localStorage:', e);
        }
    }

    /**
     * Detect country using browser timezone as fallback
     */
    function detectCountryByTimezone() {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            // India timezones
            if (timezone && timezone.includes('Kolkata') || timezone.includes('Calcutta')) {
                return 'IN';
            }
        } catch (e) {
            console.warn('Timezone detection failed:', e);
        }
        return 'US'; // Default to US
    }

    /**
     * Fetch country code using IP geolocation API
     */
    async function fetchCountryCode() {
        try {
            // Using ipapi.co - free tier allows 1000 requests per day
            const response = await fetch('https://ipapi.co/json/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            if (data && data.country_code) {
                return data.country_code;
            }
        } catch (error) {
            console.warn('IP geolocation API failed, using timezone fallback:', error);
        }

        // Fallback to timezone detection
        return detectCountryByTimezone();
    }

    /**
     * Initialize geolocation detection
     */
    async function initGeolocation() {
        // Check cache first
        const cachedCountry = getCachedCountry();
        if (cachedCountry) {
            window.userCountryCode = cachedCountry;
            console.log('User country (cached):', cachedCountry);
            return cachedCountry;
        }

        // Fetch from API
        const countryCode = await fetchCountryCode();
        window.userCountryCode = countryCode;
        cacheCountry(countryCode);
        console.log('User country (detected):', countryCode);
        return countryCode;
    }

    // Initialize immediately
    initGeolocation();

    // Export for use in other scripts
    window.getUserCountryCode = function() {
        return window.userCountryCode || 'US'; // Default to US if not yet detected
    };

})();
