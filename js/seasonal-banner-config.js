// ========================================
// SEASONAL BANNER CONFIGURATION
// ========================================
//
// This file manages automatic banner rotation based on dates
// Add/edit holiday banners here - system auto-detects and switches
//
// HOW TO ADD NEW HOLIDAY:
// 1. Add new object to seasonalBanners array below
// 2. Create banner images (desktop & mobile) in /images/banners/
// 3. System automatically rotates based on dates!
//
// ========================================

const seasonalBanners = [
    {
        id: 'valentines',
        name: 'Valentine\'s Day Gifts',
        priority: 10,
        startDate: { month: 1, day: 21 },    // January 21
        endDate: { month: 2, day: 14 },      // February 14
        title: 'Valentine\'s Day Gifts',
        subtitle: 'Show your love with perfect romantic gifts!',
        ctaText: 'Shop Valentine Gifts',
        link: 'pages/valentines-day-gifts.html',
        images: {
            desktop: 'images/banners/valentines-desktop.jpg',
            mobile: 'images/banners/valentines-mobile.jpg'
        },
        overlayColor: 'rgba(236, 72, 153, 0.2)'  // Pink tint
    },
    {
        id: 'easter',
        name: 'Easter Gifts',
        priority: 10,
        startDate: { month: 2, day: 15 },    // February 15
        endDate: { month: 4, day: 20 },      // April 20
        title: 'Easter Gift Collection',
        subtitle: 'Celebrate spring with delightful Easter gifts!',
        ctaText: 'Shop Easter Gifts',
        link: 'pages/easter-gifts.html',
        images: {
            desktop: 'images/banners/easter-desktop.jpg',
            mobile: 'images/banners/easter-mobile.jpg'
        },
        overlayColor: 'rgba(167, 243, 208, 0.2)'  // Light green tint
    },
    {
        id: 'mothers-day',
        name: 'Mother\'s Day Gifts',
        priority: 10,
        startDate: { month: 4, day: 21 },    // April 21
        endDate: { month: 5, day: 11 },      // May 11 (2nd Sunday of May)
        title: 'Mother\'s Day Gifts',
        subtitle: 'Show mom how much you care with perfect gifts!',
        ctaText: 'Shop Mother\'s Day',
        link: 'pages/mothers-day-gifts.html',
        images: {
            desktop: 'images/banners/mothersday-desktop.jpg',
            mobile: 'images/banners/mothersday-mobile.jpg'
        },
        overlayColor: 'rgba(249, 168, 212, 0.2)'  // Pink tint
    },
    {
        id: 'fathers-day',
        name: 'Father\'s Day Gifts',
        priority: 10,
        startDate: { month: 5, day: 12 },    // May 12
        endDate: { month: 6, day: 15 },      // June 15 (3rd Sunday of June)
        title: 'Father\'s Day Gifts',
        subtitle: 'Find the perfect gift for dad!',
        ctaText: 'Shop Father\'s Day',
        link: 'pages/fathers-day-gifts.html',
        images: {
            desktop: 'images/banners/fathersday-desktop.jpg',
            mobile: 'images/banners/fathersday-mobile.jpg'
        },
        overlayColor: 'rgba(59, 130, 246, 0.2)'  // Blue tint
    },
    {
        id: 'independence-day',
        name: 'Independence Day Gifts',
        priority: 10,
        startDate: { month: 6, day: 16 },    // June 16
        endDate: { month: 7, day: 4 },       // July 4
        title: 'Independence Day Gifts',
        subtitle: 'Celebrate freedom with patriotic gifts!',
        ctaText: 'Shop July 4th Gifts',
        link: 'pages/independence-day-gifts.html',
        images: {
            desktop: 'images/banners/independenceday-desktop.jpg',
            mobile: 'images/banners/independenceday-mobile.jpg'
        },
        overlayColor: 'rgba(220, 38, 38, 0.2)'  // Red, white & blue
    },
    {
        id: 'halloween',
        name: 'Halloween Gifts',
        priority: 10,
        startDate: { month: 7, day: 5 },     // July 5
        endDate: { month: 10, day: 31 },     // October 31
        title: 'Halloween Deals & Gifts',
        subtitle: '2025 Amazon\'s top Halloween gifts for everyone on your list!',
        ctaText: 'Shop Halloween Gifts',
        link: 'pages/halloween-gifts.html',
        images: {
            desktop: 'images/banners/halloween-desktop.jpg',
            mobile: 'images/banners/halloween-mobile.jpg'
        },
        overlayColor: 'rgba(255, 140, 0, 0.2)'  // Orange tint
    },
    {
        id: 'thanksgiving',
        name: 'Thanksgiving Gifts',
        priority: 10,
        startDate: { month: 11, day: 1 },    // November 1
        endDate: { month: 11, day: 28 },     // November 28 (4th Thursday)
        title: 'Thanksgiving Gifts & Decor',
        subtitle: 'Celebrate gratitude with thoughtful gifts!',
        ctaText: 'Shop Thanksgiving Gifts',
        link: 'pages/thanksgiving-gifts.html',
        images: {
            desktop: 'images/banners/thanksgiving-desktop.jpg',
            mobile: 'images/banners/thanksgiving-mobile.jpg'
        },
        overlayColor: 'rgba(217, 119, 6, 0.2)'  // Autumn orange
    },
    {
        id: 'secret-santa',
        name: 'Secret Santa Gifts',
        priority: 10,
        startDate: { month: 11, day: 29 },   // November 29
        endDate: { month: 12, day: 25 },     // December 25
        title: 'Secret Santa Gift Guide',
        subtitle: 'Find perfect Secret Santa gifts for your exchange!',
        ctaText: 'Shop Secret Santa Gifts',
        link: 'pages/secret-santa-gifts.html',
        images: {
            desktop: 'images/banners/secret-santa-desktop.jpg',
            mobile: 'images/banners/secret-santa-mobile.jpg'
        },
        overlayColor: 'rgba(220, 38, 38, 0.2)'  // Red tint
    },
    {
        id: 'new-year',
        name: 'New Year Gifts',
        priority: 10,
        startDate: { month: 12, day: 26 },   // December 26
        endDate: { month: 1, day: 20 },      // January 20 (crosses year boundary)
        title: 'New Year Gifts & Celebrations',
        subtitle: 'Start the year with thoughtful gifts!',
        ctaText: 'Shop New Year Gifts',
        link: 'pages/new-year-gifts.html',
        images: {
            desktop: 'images/banners/newyear-desktop.jpg',
            mobile: 'images/banners/newyear-mobile.jpg'
        },
        overlayColor: 'rgba(147, 51, 234, 0.2)'  // Purple tint
    }
];

// Default banner (shown when no seasonal banner is active)
const defaultBanner = {
    id: 'default',
    name: 'Special Offers',
    title: 'Amazing Gift Deals',
    subtitle: 'Discover perfect gifts for every occasion and budget!',
    ctaText: 'Shop Special Gifts',
    link: 'pages/special-offers.html',
    images: {
        desktop: 'images/banner-desktop.jpg',    // Your current images
        mobile: 'images/banner-mobile.jpg'
    },
    overlayColor: 'rgba(0, 0, 0, 0.3)'
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Check if current date is within banner's active period
 * Handles year boundary crossing (e.g., Dec 27 - Jan 10)
 */
function isBannerActive(banner, currentDate = new Date()) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;  // JavaScript months are 0-indexed
    const day = currentDate.getDate();

    const start = banner.startDate;
    const end = banner.endDate;

    // Check if banner period crosses year boundary
    const crossesYear = (start.month > end.month) ||
                       (start.month === end.month && start.day > end.day);

    if (crossesYear) {
        // Example: Dec 27 - Jan 10
        // Active if: (month >= 12 && day >= 27) OR (month <= 1 && day <= 10)
        const afterStart = (month > start.month) ||
                          (month === start.month && day >= start.day);
        const beforeEnd = (month < end.month) ||
                         (month === end.month && day <= end.day);

        return afterStart || beforeEnd;
    } else {
        // Normal case: same year period
        const afterStart = (month > start.month) ||
                          (month === start.month && day >= start.day);
        const beforeEnd = (month < end.month) ||
                         (month === end.month && day <= end.day);

        return afterStart && beforeEnd;
    }
}

/**
 * Get active banner based on current date
 * Returns highest priority banner if multiple are active
 */
function getActiveBanner(currentDate = new Date()) {
    // Find all active banners
    const activeBanners = seasonalBanners.filter(banner =>
        isBannerActive(banner, currentDate)
    );

    if (activeBanners.length === 0) {
        console.log('No active seasonal banner, using default');
        return defaultBanner;
    }

    // Sort by priority (highest first)
    activeBanners.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const selectedBanner = activeBanners[0];
    console.log(`Active banner: ${selectedBanner.name} (${selectedBanner.id})`);

    return selectedBanner;
}

/**
 * Get upcoming banner (next scheduled after current)
 */
function getUpcomingBanner(currentDate = new Date()) {
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    // Find banners with future start dates
    const upcomingBanners = seasonalBanners.filter(banner => {
        const start = banner.startDate;
        return (start.month > month) || (start.month === month && start.day > day);
    });

    if (upcomingBanners.length === 0) {
        // All banners are in the past, get first one of next year
        return seasonalBanners.sort((a, b) => {
            if (a.startDate.month !== b.startDate.month) {
                return a.startDate.month - b.startDate.month;
            }
            return a.startDate.day - b.startDate.day;
        })[0];
    }

    // Sort by start date (earliest first)
    upcomingBanners.sort((a, b) => {
        if (a.startDate.month !== b.startDate.month) {
            return a.startDate.month - b.startDate.month;
        }
        return a.startDate.day - b.startDate.day;
    });

    return upcomingBanners[0];
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        seasonalBanners,
        defaultBanner,
        getActiveBanner,
        isBannerActive,
        getUpcomingBanner
    };
}

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.seasonalBannerConfig = {
        seasonalBanners,
        defaultBanner,
        getActiveBanner,
        isBannerActive,
        getUpcomingBanner
    };
}
