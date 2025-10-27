// Test script to verify image URLs
import { getImageUrl } from './src/utils/imageUtils.js';
import config from './src/utils/config.js';

console.log('=== Image URL Test ===');
console.log('Environment:', import.meta.env.MODE);
console.log('Production:', import.meta.env.PROD);
console.log('Base URL:', config.baseUrl);
console.log('Static Base URL:', config.staticBaseUrl);
console.log('');

const testPaths = [
  '/logo.png',
  'assets/img/bg-images.png',
  'assets/img/image 5746.png',
  'public/logo.png',
  'public/vite.svg'
];

console.log('=== Generated URLs ===');
testPaths.forEach((path, index) => {
  const url = getImageUrl(path);
  console.log(`${index + 1}. ${path} -> ${url}`);
});

console.log('');
console.log('=== Environment Variables ===');
console.log('VITE_BASE_URL:', import.meta.env.VITE_BASE_URL);
console.log('VITE_STATIC_BASE_URL:', import.meta.env.VITE_STATIC_BASE_URL);
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('VITE_NODE_ENV:', import.meta.env.VITE_NODE_ENV);
