// Simple script to create placeholder icons
// Run this in a browser console or Node.js environment

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

function createIcon(size, filename) {
    canvas.width = size;
    canvas.height = size;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw background
    ctx.fillStyle = '#4285f4';
    ctx.fillRect(0, 0, size, size);
    
    // Draw "AI" text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AI', size / 2, size / 2);
    
    // Convert to data URL
    const dataURL = canvas.toDataURL('image/png');
    
    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    link.click();
}

// Create icons
createIcon(16, 'icon16.png');
createIcon(48, 'icon48.png');
createIcon(128, 'icon128.png');
