# Amazon Affiliate Link Redirect - Deployment Guide

## Problem Solved
Indian users were seeing "Click the button below to continue shopping" when clicking product links because the shortened `amzn.to` links redirect to Amazon.com, which blocks Indian users.

## Solution
A server-side PHP redirect handler that:
1. Detects user's country via IP geolocation
2. Expands shortened links server-side (no CORS issues)
3. Extracts the ASIN from Amazon URLs
4. Redirects Indian users to Amazon.in with your Indian affiliate tag
5. Redirects other users to original Amazon.com links

---

## Deployment Instructions

### Step 1: Upload redirect.php

Upload the `redirect.php` file to your website's root directory:

```
your-website.com/
├── index.html
├── redirect.php  ← Upload this file here
├── js/
├── css/
└── pages/
```

**Via FTP:**
- Connect to your hosting via FTP (FileZilla, etc.)
- Upload `redirect.php` to the root directory (same folder as index.html)

**Via cPanel:**
- Go to File Manager
- Upload `redirect.php` to public_html (or your root directory)

---

### Step 2: Test PHP Support

Create a test file `phpinfo.php` in your root directory:

```php
<?php phpinfo(); ?>
```

Visit: `https://your-website.com/phpinfo.php`

- ✅ If you see PHP configuration info, you're good to go!
- ❌ If you see the code or get an error, your hosting doesn't support PHP

**Important:** Delete `phpinfo.php` after testing for security.

---

### Step 3: Set File Permissions (Linux/Unix hosts only)

Make sure `redirect.php` has proper permissions:

```bash
chmod 644 redirect.php
```

Or via FTP:
- Right-click redirect.php → File Permissions → Set to 644

---

### Step 4: Test the Redirect

**Test with a sample product:**

1. **Test for US users (default):**
   Visit: `https://your-website.com/redirect.php?url=https://amzn.to/3JUrSFP`

   Should redirect to Amazon.com

2. **Test for Indian users (simulate):**
   Modify `redirect.php` line 19 to:
   ```php
   $ip = '103.21.124.0'; // Example Indian IP
   ```

   Then visit the same URL - should redirect to Amazon.in

   **Remember to remove this line after testing!**

---

### Step 5: Verify Affiliate Tags

Click on products from both locations and verify:

- **US users:** Links have `tag=giftonbudge0f-20`
- **Indian users:** Links have `tag=giftonbudget-21`

---

## How It Works

### For US and Other Countries:
```
User clicks product → redirect.php → Detects country = US → Redirects to original Amazon.com link
```

### For Indian Users:
```
User clicks product → redirect.php → Detects country = IN →
Expands amzn.to link → Extracts ASIN →
Redirects to Amazon.in/dp/ASIN?tag=giftonbudget-21
```

---

## Troubleshooting

### Links still going to Amazon.com for Indian users

**Check 1:** Verify redirect.php is uploaded correctly
- Visit: `https://your-website.com/redirect.php`
- Should show a redirect to homepage (not a 404 error)

**Check 2:** Clear browser cache and localStorage
```javascript
// Run in browser console:
localStorage.clear();
location.reload();
```

**Check 3:** Check PHP error logs
- In cPanel: Error Logs section
- Look for PHP errors related to curl or redirect.php

**Check 4:** Verify curl is enabled on your hosting
- curl is required for the redirect script
- Contact your hosting provider if not available

### "Too Many Redirects" error

This means the redirect is looping. Check:
1. Make sure you removed test code from redirect.php
2. Verify affiliate tags are correct
3. Check if .htaccess has any conflicting redirect rules

### Slow page load

The first redirect might be slower (2-3 seconds) due to:
1. IP geolocation lookup
2. Expanding shortened link
3. External API calls

**Solution:** Consider caching redirect results or using Cloudflare

---

## Alternative: If You Don't Have PHP Hosting

### Option 1: Use Cloudflare Workers (Free)

Cloudflare Workers can run JavaScript on the edge:
1. Sign up for Cloudflare (free)
2. Create a Worker with redirect logic
3. Route `your-site.com/redirect/*` to the worker

[Tutorial needed - contact me if you need this option]

### Option 2: Use a Free Redirect Service

Services like:
- Geniuslink (paid, but has free trial)
- Use Amazon OneLink + manual India setup

### Option 3: Store ASINs in Product Data

Add ASIN field to every product and build links client-side
- More work, but no server-side needed
- Requires updating ~1000 products

---

## Performance Optimization (Optional)

### Add Caching

Modify `redirect.php` to cache ASIN lookups:

```php
// Add at top of redirect.php
$cacheDir = __DIR__ . '/cache/';
if (!file_exists($cacheDir)) {
    mkdir($cacheDir, 0755);
}
```

### Use Cloudflare

Cloudflare's CDN can cache redirects and provide faster geolocation.

---

## Security Notes

✅ **Safe:**
- The script only redirects to Amazon domains
- User data is not stored
- IP geolocation is temporary

⚠️ **Important:**
- Don't modify affiliate tags without understanding the code
- Keep PHP updated on your server
- Monitor error logs regularly

---

## Support

If you encounter issues:

1. **Check PHP version:** Needs PHP 5.6+ (7.0+ recommended)
2. **Verify curl:** Run in redirect.php: `var_dump(function_exists('curl_init'));`
3. **Enable error reporting:** Add to top of redirect.php:
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```
4. **Check Apache/Nginx logs** for server errors

---

## Summary

✅ **Deployed:** redirect.php in root directory
✅ **Tested:** Works for both US and IN users
✅ **Verified:** Correct affiliate tags for each market
✅ **Monitoring:** Check analytics for conversion rates

Your affiliate links should now work perfectly for Indian users! 🎉
