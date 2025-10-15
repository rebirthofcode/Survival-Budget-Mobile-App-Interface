# Favicon Setup for Survival Budget

## Quick Method (Recommended)

1. Open `resize-favicon.html` in your web browser (double-click the file)
2. The tool will automatically load your existing `favicon.png` (63x63)
3. Click each "Download" button to save all required sizes:
   - `favicon-16.png` (16x16) - Browser favicon
   - `favicon-32.png` (32x32) - Browser favicon
   - `apple-touch-icon.png` (180x180) - iOS home screen
   - `icon-192.png` (192x192) - Android PWA
   - `icon-512.png` (512x512) - PWA splash screen
4. Save all downloaded files to this `public/` folder
5. Done! Your favicons are ready to use.

## Alternative Methods

### Option 1: Online Tool
1. Visit https://realfavicongenerator.net/
2. Upload `favicon.png` or `favicon.svg` from this folder
3. Download the generated package
4. Extract files to this folder

### Option 2: Command Line (if you have ImageMagick)
```bash
magick favicon.png -resize 16x16 favicon-16.png
magick favicon.png -resize 32x32 favicon-32.png
magick favicon.png -resize 180x180 apple-touch-icon.png
magick favicon.png -resize 192x192 icon-192.png
magick favicon.png -resize 512x512 icon-512.png
```

## Files in this folder

### Current Files
- `favicon.png` - Original favicon (63x63)
- `favicon.svg` - Vector version of the Survival Budget logo
- `manifest.json` - PWA manifest file
- `resize-favicon.html` - Browser-based image resizer tool

### Required Files (Generate using the tool above)
- `favicon-16.png` - 16x16 PNG (for browsers)
- `favicon-32.png` - 32x32 PNG (for browsers)
- `apple-touch-icon.png` - 180x180 PNG (for iOS home screen)
- `icon-192.png` - 192x192 PNG (for Android PWA)
- `icon-512.png` - 512x512 PNG (for PWA splash screen)

## Notes

- The `index.html` file has been updated to reference all these favicons
- The app is configured as a Progressive Web App (PWA)
- Users can install the app to their home screen on mobile devices
- All favicon links will work once you generate the PNG files using the tool above
