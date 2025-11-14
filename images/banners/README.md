# Banner Images Guide

This folder contains all seasonal banner images for the automatic banner rotation system.

## Image Requirements

### Desktop Banners
- **Size**: 1920px × 600px (recommended)
- **Format**: JPG or PNG
- **File size**: < 500KB (optimize for web)
- **Aspect ratio**: 16:5

### Mobile Banners
- **Size**: 800px × 600px (recommended)
- **Format**: JPG or PNG
- **File size**: < 300KB (optimize for web)
- **Aspect ratio**: 4:3

## Required Banner Images

Create the following image pairs (desktop + mobile) for each occasion:

### 1. Valentine's Day
- ⏳ `valentines-desktop.jpg` (1920×600px)
- ⏳ `valentines-mobile.jpg` (800×600px)
- Colors: Pink, red, white
- Themes: Hearts, roses, romantic couples, love

### 2. Easter
- ⏳ `easter-desktop.jpg` (1920×600px)
- ⏳ `easter-mobile.jpg` (800×600px)
- Colors: Pastel colors (pink, blue, yellow, green)
- Themes: Easter eggs, bunnies, spring flowers

### 3. Mother's Day
- ⏳ `mothersday-desktop.jpg` (1920×600px)
- ⏳ `mothersday-mobile.jpg` (800×600px)
- Colors: Pink, purple, white
- Themes: Flowers (roses, tulips), elegant, appreciation

### 4. Father's Day
- ⏳ `fathersday-desktop.jpg` (1920×600px)
- ⏳ `fathersday-mobile.jpg` (800×600px)
- Colors: Blue, gray, brown
- Themes: Tools, ties, masculine elements, dad activities

### 5. Independence Day
- ⏳ `independenceday-desktop.jpg` (1920×600px)
- ⏳ `independenceday-mobile.jpg` (800×600px)
- Colors: Red, white, blue
- Themes: American flag, fireworks, patriotic, July 4th

### 6. Halloween
- ✅ `halloween-desktop.jpg` (1920×600px)
- ✅ `halloween-mobile.jpg` (800×600px)
- Colors: Orange, black, purple
- Themes: Pumpkins, bats, spooky elements

### 7. Thanksgiving
- ⏳ `thanksgiving-desktop.jpg` (1920×600px) ← **NEXT PRIORITY!**
- ⏳ `thanksgiving-mobile.jpg` (800×600px) ← **NEXT PRIORITY!**
- Colors: Orange, brown, autumn tones
- Themes: Turkey, autumn leaves, harvest, gratitude

### 8. Christmas
- ⏳ `christmas-desktop.jpg` (1920×600px)
- ⏳ `christmas-mobile.jpg` (800×600px)
- Colors: Red, green, gold, white
- Themes: Christmas trees, gifts, snow, festive decorations

### 9. New Year
- ⏳ `newyear-desktop.jpg` (1920×600px)
- ⏳ `newyear-mobile.jpg` (800×600px)
- Colors: Gold, silver, purple, black
- Themes: Fireworks, champagne, celebrations, party

## Where to Get Banner Images

### Option 1: Create Custom Banners
- Use Canva (free): https://www.canva.com/
- Use Photoshop or GIMP
- Hire designer on Fiverr or Upwork

### Option 2: Free Stock Photos
- Unsplash: https://unsplash.com/
- Pexels: https://www.pexels.com/
- Pixabay: https://pixabay.com/

Search terms:
- "Halloween gifts banner"
- "Christmas shopping banner"
- "Valentine's day banner"

### Option 3: AI-Generated Images
- DALL-E: https://openai.com/dall-e-2
- Midjourney: https://www.midjourney.com/
- Stable Diffusion

Prompts:
- "Wide banner image for Halloween gift shopping website, festive, high quality, 16:5 aspect ratio"
- "Christmas shopping banner with gifts and decorations, professional, wide format"

## Design Tips

1. **Keep Text Readable Area Clear**: The banner has text overlay, so keep the center area relatively uncluttered

2. **Use High Contrast**: Ensure good contrast between background and text overlay

3. **Optimize Images**:
   ```bash
   # Use tools like:
   - TinyPNG (https://tinypng.com/)
   - ImageOptim (Mac)
   - Squoosh (https://squoosh.app/)
   ```

4. **Test on Mobile**: Always check how mobile version looks on actual devices

5. **Brand Consistency**: Keep colors and style consistent with your Gift On Budget brand

## Fallback Images

The system uses these fallback images when no seasonal banner is active:
- `../banner-desktop.jpg` (already exists)
- `../banner-mobile.jpg` (already exists)

## Adding New Holiday Banners

1. Create the banner images (desktop + mobile)
2. Save them in this folder with naming convention: `{holiday}-desktop.jpg` and `{holiday}-mobile.jpg`
3. Add configuration in `/js/seasonal-banner-config.js`
4. Images will automatically load based on date!

## Current Status

| Occasion | Desktop | Mobile | Active Dates | Status |
|----------|---------|---------|--------------|--------|
| Valentine's Day | ⏳ | ⏳ | Jan 25 - Feb 14 | Pending |
| Easter | ⏳ | ⏳ | Mar 20 - Apr 20 | Pending |
| Mother's Day | ⏳ | ⏳ | Apr 25 - May 11 | Pending |
| Father's Day | ⏳ | ⏳ | Jun 1 - Jun 15 | Pending |
| Independence Day | ⏳ | ⏳ | Jun 25 - Jul 4 | Pending |
| Halloween | ✅ | ✅ | Oct 1 - Oct 31 | **Active Now** |
| Thanksgiving | ⏳ | ⏳ | Nov 15 - Nov 28 | **Next Priority!** |
| Christmas | ⏳ | ⏳ | Nov 29 - Dec 25 | Pending |
| New Year | ⏳ | ⏳ | Dec 26 - Jan 15 | Pending |

✅ = Ready | ⏳ = Needs to be created
