<?php
/**
 * Amazon Affiliate Link Redirect Handler
 * Redirects users to their local Amazon marketplace with correct affiliate tag
 */

// Configuration
$AFFILIATE_TAGS = [
    'US' => 'giftonbudge0f-20',
    'IN' => 'giftonbudget-21'
];

$AMAZON_DOMAINS = [
    'US' => 'amazon.com',
    'IN' => 'amazon.in'
];

/**
 * Get user's country code based on IP
 */
function getUserCountry() {
    // Try to get IP address
    $ip = $_SERVER['REMOTE_ADDR'];

    // For testing, you can override:
    // $ip = '103.21.124.0'; // Example Indian IP

    // Skip localhost/private IPs
    if ($ip === '127.0.0.1' || $ip === '::1' || strpos($ip, '192.168.') === 0) {
        return 'IN'; // For localhost testing in India - change to 'US' if testing from other countries
    }

    // Use ip-api.com (free, no API key needed, 45 requests/minute)
    $url = "http://ip-api.com/json/{$ip}?fields=countryCode";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $response) {
        $data = json_decode($response, true);
        if (isset($data['countryCode'])) {
            return $data['countryCode'];
        }
    }

    // Fallback: Try to detect from browser headers
    if (isset($_SERVER['HTTP_CF_IPCOUNTRY'])) {
        // Cloudflare provides this
        return $_SERVER['HTTP_CF_IPCOUNTRY'];
    }

    // Default to US if detection fails
    return 'US';
}

/**
 * Expand shortened URL and extract ASIN
 */
function expandAndExtractASIN($shortUrl) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $shortUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);

    $response = curl_exec($ch);
    $finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    curl_close($ch);

    // Extract ASIN from the final URL
    $patterns = [
        '/\/dp\/([A-Z0-9]{10})/',
        '/\/gp\/product\/([A-Z0-9]{10})/',
        '/\/product\/([A-Z0-9]{10})/',
        '/\/ASIN\/([A-Z0-9]{10})/',
    ];

    foreach ($patterns as $pattern) {
        if (preg_match($pattern, $finalUrl, $matches)) {
            return $matches[1];
        }
    }

    return null;
}

/**
 * Build localized Amazon URL
 */
function buildAmazonUrl($asin, $countryCode, $affiliateTags, $amazonDomains) {
    $tag = $affiliateTags[$countryCode] ?? $affiliateTags['US'];
    $domain = $amazonDomains[$countryCode] ?? $amazonDomains['US'];

    return "https://www.{$domain}/dp/{$asin}?tag={$tag}";
}

// Main redirect logic
$url = $_GET['url'] ?? '';

if (empty($url)) {
    // No URL provided, redirect to homepage
    header('Location: /index.html');
    exit;
}

// Decode the URL
$url = urldecode($url);

// Get user's country
$country = getUserCountry();

// If user is not from India, redirect to original link
if ($country !== 'IN') {
    header("Location: {$url}");
    exit;
}

// For Indian users, try to convert to Amazon.in
try {
    $asin = expandAndExtractASIN($url);

    if ($asin) {
        // Build Amazon.in URL with Indian affiliate tag
        $indianUrl = buildAmazonUrl($asin, 'IN', $AFFILIATE_TAGS, $AMAZON_DOMAINS);
        header("Location: {$indianUrl}");
    } else {
        // Could not extract ASIN, redirect to original
        header("Location: {$url}");
    }
} catch (Exception $e) {
    // Error occurred, redirect to original URL
    header("Location: {$url}");
}

exit;
?>
