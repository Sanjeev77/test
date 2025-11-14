// Special Products - Circular Icons Section
// These products appear in the Circular icons section below hero banner

const specialProductsData = [
    {
        "title": "RJVW Christmas Hat, Santa Hat for Kids & Baby, Xmas Hat,Unisex Velvet Classic Santa Claus Hat for New Year Party",
        "price": "5.59",
        "rating": 4.6,
        "affiliateLink": "https://amzn.to/47kgKts",
        "image": "https://m.media-amazon.com/images/I/61qPoxYk6zL._AC_SX679_.jpg",
        "category": "special-products",
        "featured": false,
        "id": 1761066264418
    },
    {
        "title": "36 LED Cherry Blossom Sparkly Fairy Spirit Tree Lights, DIY Artificial Tree Battery/USB Operated, Tabletop Tree Lamp for Bedroom Christmas Indoor Room Decor Night Lights (Warm White)",
        "price": "16.98",
        "rating": 4.3,
        "affiliateLink": "https://amzn.to/4oBT3UJ",
        "image": "https://m.media-amazon.com/images/I/71qNBx73zeL._AC_SL1500_.jpg",
        "category": "special-products",
        "featured": false,
        "id": 1761066366704
    },
    {
        "title": "60 Pcs from Santa Tag Stickers Christmas Gift Name Labels for Holiday Festive Gift Wrapping Party Favors",
        "price": "6.95",
        "rating": 4.8,
        "affiliateLink": "https://amzn.to/475O6O4",
        "image": "https://m.media-amazon.com/images/I/81F8SRhA7yL._AC_SL1500_.jpg",
        "category": "special-products",
        "featured": false,
        "id": 1761066446408
    },
    {
        "title": "Suzile 36 Pcs Christmas Wooden Ornaments Vintage Christmas Tree Decorations Santa Claus Ornaments for Tree Wreaths Xmas Hanging Wood Cutouts Decor for Farmhouse Home Winter Holiday Party Favors",
        "price": "12.99",
        "rating": 4.3,
        "affiliateLink": "https://amzn.to/3Why9Op",
        "image": "https://m.media-amazon.com/images/I/91WB6OTMqfL._AC_SL1500_.jpg",
        "category": "special-products",
        "featured": false,
        "id": 1761066482861
    },
    {
        "title": "Snowman Christmas Decorations Indoor Christmas Door Decorations Winter Decor Winter Wreath Snowman Wall Decor Wooden Front Door Hanger Welcome Sign for Front Door Porch Wall Indoor Home Decor",
        "price": "7.99",
        "rating": 4.8,
        "affiliateLink": "https://amzn.to/4hotILl",
        "image": "https://m.media-amazon.com/images/I/71jrtD78DaL._AC_SL1500_.jpg",
        "category": "special-products",
        "featured": false,
        "id": 1761066604667
    },
    {
        "title": "Merry Christmas Wreath Hanging Sign for Front Door, Wooden Welcome Wreaths Sign with Bow for Holiday Rustic Farmhouse Outdoor Wall Window Decor (Merry Christmas)",
        "price": "18.99",
        "rating": 4.2,
        "affiliateLink": "https://amzn.to/43rCTF5",
        "image": "https://m.media-amazon.com/images/I/71vCHcqWZgL._AC_SL1500_.jpg",
        "category": "special-products",
        "featured": false,
        "id": 1761066633137
    },
    {
        "title": "9Ft Pre-Lit Christmas Garland, Plug in, Green, 50 Clear Lights, Fireplace Stairs Mantle Door Indoor Outdoor, Decorated with Pine Cones",
        "price": "49.99",
        "rating": 4.4,
        "affiliateLink": "https://amzn.to/3JaXI0M",
        "image": "https://m.media-amazon.com/images/I/814pRP4X7qL._AC_SL1500_.jpg",
        "category": "special-products",
        "featured": false,
        "id": 1761066708967
    },
    {
        "title": "30Pcs Christmas Decorations Mini Christmas Trees, Artificial Christmas Tree Bottle Brush Trees with Wooden Base for Christmas Decor Christmas Party Home Table Craft",
        "price": "15.97",
        "rating": 4.4,
        "affiliateLink": "https://amzn.to/47f66Ef",
        "image": "https://m.media-amazon.com/images/I/91Vxfx5UzGL._AC_SL1500_.jpg",
        "category": "special-products",
        "featured": false,
        "id": 1761066764471
    },
    {
        "title": "Santa Claus Face Glass Christmas Tree Ornament, 5 Inch",
        "price": "15.95",
        "rating": 4.6,
        "affiliateLink": "https://amzn.to/4orAdPN",
        "image": "https://m.media-amazon.com/images/I/413drA56IEL._AC_SL1000_.jpg",
        "category": "special-products",
        "featured": false,
        "id": 1761066845891
    },
    {
        "title": "Hallmark Christmas Gift Bag Assortment (8 Bags: 3 Small 6\", 3 Medium 9\", 2 Large 13\") White and Sage Green with Rustic Snowman, Plaid, Evergreen Tree for Christmas, Winter Weddings, Birthdays",
        "price": "12.70",
        "rating": 4.8,
        "affiliateLink": "https://amzn.to/4hlZgl7",
        "image": "https://m.media-amazon.com/images/I/81-RpQdwVxL._AC_SL1500_.jpg",
        "category": "special-products",
        "featured": false,
        "id": 1761066881658
    }
];

// Make data available globally
if (typeof window !== 'undefined') {
    window.specialProductsData = specialProductsData;
}

// Export for backend use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { specialProductsData };
}