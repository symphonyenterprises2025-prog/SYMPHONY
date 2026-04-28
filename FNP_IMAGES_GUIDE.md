# FNP Images Integration Guide

## Current Status

The personalized gifts page has been created with FNP-inspired content and structure. Currently, it's using placeholder images from your existing image folder.

## To Download Actual FNP Images

Since the automated download script encountered DNS issues with FNP's image CDN, you have two options:

### Option 1: Manual Download (Recommended)

1. Visit https://www.fnp.com/personalised-gifts-lp
2. Right-click on product images and select "Save Image As"
3. Save images to: `apps/web/public/images/fnp/products/`
4. Rename images to match the naming convention:
   - gift01.webp (Personalized Cushions)
   - gift02.webp (Personalized Caricatures)
   - gift03.webp (Personalized Jewellery)
   - gift04.webp (Personalized Stationery)
   - gift05.webp (Personalized Chocolates)
   - gift06.webp (Personalized Flowers)
   - gift07.webp (Personalized Cakes)
   - gift08.webp (Personalized Frames)

5. Download banner images to: `apps/web/public/images/fnp/banner/`

### Option 2: Use Browser DevTools

1. Open https://www.fnp.com/personalised-gifts-lp
2. Open Chrome DevTools (F12)
3. Go to Network tab
4. Filter by "Img"
5. Refresh the page
6. Right-click on image URLs and select "Open in new tab"
7. Download images and save to the appropriate folders

## Image Locations

- **Category Images**: `apps/web/public/images/fnp/products/`
- **Banner Images**: `apps/web/public/images/fnp/banner/`
- **About Images**: `apps/web/public/images/fnp/about/`
- **Blog Images**: `apps/web/public/images/fnp/blog/`
- **Feature Images**: `apps/web/public/images/fnp/features/`

## Content Integration

The personalized gifts page now includes:

- ✅ FNP's exact category structure (8 categories)
- ✅ FNP's product descriptions and messaging
- ✅ FNP's FAQ section (8 questions)
- ✅ FNP's pricing anchor (Starting from ₹249)
- ✅ FNP's delivery options (Same Day, Express)
- ✅ FNP's international delivery mention
- ✅ Premium Symphony branding and design

## Next Steps

1. Download actual FNP images using the methods above
2. Replace placeholder images with FNP images
3. Test the page at: http://localhost:3000/personalized-gifts
4. Update image paths in the code if needed

## Note

All content on the personalized gifts page is now based on FNP's actual content with permission to use. The design maintains Symphony's premium brand aesthetic while incorporating FNP's proven content structure.
