const { createCanvas } = require('canvas');
const fs = require('fs');

function makeIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#4f46e5';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'white';
  ctx.font = 'bold ' + (size * 0.5) + 'px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('H', size/2, size/2);
  return canvas.toBuffer('image/png');
}

fs.writeFileSync('public/icons/icon-192.png', makeIcon(192));
fs.writeFileSync('public/icons/icon-512.png', makeIcon(512));
console.log('Icons created!');