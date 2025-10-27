import config from './config';

// Helper function to get full URL for static images
export const getImageUrl = (imagePath) => {
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Return full URL with base URL
  return `${config.staticBaseUrl}/${cleanPath}`;
};

// Helper function to get full URL for assets
export const getAssetUrl = (assetPath) => {
  return getImageUrl(assetPath);
};

// Example usage:
// const logoUrl = getImageUrl('/assets/img/logo.png');
// const bgImageUrl = getImageUrl('assets/img/bg-images.png');
