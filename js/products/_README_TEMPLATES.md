# Product Templates - How to Populate

This folder contains product files for each occasion.

## Current Status

| Occasion | File | Status | How to Populate |
|----------|------|--------|-----------------|
| Halloween | special-offers.js (parent folder) | ✅ Active (94 products) | Already populated |
| Valentine's Day | valentines-products.js | ⏳ Empty template | Export from backend |
| Easter | easter-products.js | ⏳ Create & export | Export from backend |
| Mother's Day | mothersday-products.js | ⏳ Create & export | Export from backend |
| Father's Day | fathersday-products.js | ⏳ Create & export | Export from backend |
| Independence Day | independenceday-products.js | ⏳ Create & export | Export from backend |
| Thanksgiving | thanksgiving-products.js | ⏳ Create & export | Export from backend |
| Christmas | christmas-products.js | ⏳ Create & export | Export from backend |
| New Year | newyear-products.js | ⏳ Create & export | Export from backend |

## How to Add Products

### Method 1: Using Backend Admin (Recommended)

1. Open backend admin
2. Go to "Custom Category" tab
3. Select occasion from dropdown
4. Add products for that occasion
5. Click "Export" → Saves to correct file automatically

### Method 2: Manual Creation

Copy this template and replace values:

```javascript
const {occasion}Products = {
    occasion: '{occasion-id}',
    config: {
        name: "{Occasion Name}",
        slug: "{occasion-slug}",
        description: "{Brief description}",
        enabled: true,
        seoTitle: "{SEO Title}",
        seoDescription: "{SEO Description}",
        lastUpdated: new Date().toISOString()
    },
    products: [
        {
            "title": "Product Title",
            "price": "19.99",
            "rating": 4.5,
            "affiliateLink": "https://amzn.to/xxxxx",
            "image": "https://m.media-amazon.com/images/...",
            "category": "{occasion}",
            "featured": false,
            "id": Date.now(),
            "isCustomCategory": true,
            "priceValue": 19.99
        }
        // Add more products...
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {occasion}Products;
}

if (typeof window !== 'undefined') {
    window.{occasion}Products = {occasion}Products;
}
```

## File Naming Convention

- Occasion ID: lowercase, hyphenated (e.g., `mothers-day`)
- File name: occasion ID + `-products.js` (e.g., `mothers-day-products.js`)
- Variable name: camelCase + `Products` (e.g., `mothersdayProducts`)

## Testing

After creating/updating a product file, test it:

```javascript
// Open special-offers.html
// Press F12 → Console
productRotation.testOccasion('thanksgiving');
// Should load your products
```

## Important Notes

- Halloween currently uses `../special-offers.js` (will migrate later)
- Each file should export products in the format shown above
- Product rotation manager automatically loads the correct file
- Files are cached after first load for performance
