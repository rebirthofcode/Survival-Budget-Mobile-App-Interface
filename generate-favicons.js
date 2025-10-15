// Simple Node.js script to generate favicon files from SVG
// This uses Canvas API to convert SVG to PNG

const fs = require('fs');
const { createCanvas } = require('canvas');

// Survival Budget Logo Drawing Function
function drawLogo(ctx, size) {
    const scale = size / 40; // Original SVG is 40x40

    // Scale context
    ctx.scale(scale, scale);

    // Draw background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 40, 40);

    // Draw rounded rectangle border
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(2, 2, 36, 36, 8);
    ctx.stroke();

    // Draw dollar sign
    ctx.fillStyle = '#FF6B35';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 20, 14);

    // Draw three lines (budget tiers)
    ctx.fillStyle = '#FF6B35';

    // First line (shortest)
    ctx.beginPath();
    ctx.roundRect(14, 22, 12, 2, 1);
    ctx.fill();

    // Second line (medium)
    ctx.beginPath();
    ctx.roundRect(12, 26, 16, 2, 1);
    ctx.fill();

    // Third line (longest)
    ctx.beginPath();
    ctx.roundRect(10, 30, 20, 2, 1);
    ctx.fill();
}

// Generate favicon at specific size
function generateFavicon(size, filename) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    drawLogo(ctx, size);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`public/${filename}`, buffer);
    console.log(`✓ Generated ${filename} (${size}x${size})`);
}

// Main execution
console.log('Generating Survival Budget favicons...\n');

try {
    // Check if public directory exists
    if (!fs.existsSync('public')) {
        fs.mkdirSync('public');
        console.log('✓ Created public directory\n');
    }

    // Generate different sizes
    generateFavicon(16, 'favicon-16.png');
    generateFavicon(32, 'favicon-32.png');
    generateFavicon(180, 'apple-touch-icon.png');
    generateFavicon(192, 'icon-192.png');
    generateFavicon(512, 'icon-512.png');

    console.log('\n✓ All favicons generated successfully!');
    console.log('Files created in public/ directory');
} catch (error) {
    console.error('Error generating favicons:', error.message);
    console.log('\nNote: This script requires the "canvas" package.');
    console.log('Please use the generate-favicons.html file instead.');
    console.log('Open it in a browser and download the images manually.');
}
