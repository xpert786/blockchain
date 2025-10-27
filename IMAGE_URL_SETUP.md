# Image URL Configuration Setup

## Overview
This setup ensures all static images use absolute URLs with proper base URL configuration for both development and production environments.

## Files Modified/Created

### 1. Configuration Files
- `src/utils/config.js` - Main configuration utility
- `src/utils/imageUtils.js` - Image URL helper functions
- `vite.config.js` - Updated with proper base path

### 2. Components Updated
- `src/pages/auth/Login.jsx` - Background image
- `src/components/Header.jsx` - Logo image
- `src/pages/managerPanel/ManagerLayout.jsx` - Logo image

### 3. Test Files
- `src/components/ImageTest.jsx` - Test component
- `test-images.js` - Test script
- Added `/test-images` route in App.jsx

## Environment Variables

Create `.env` file in project root:

```env
# Development
VITE_BASE_URL=http://localhost:5173
VITE_STATIC_BASE_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

For production:
```env
# Production
VITE_BASE_URL=https://yourdomain.com/blockchain-frontend
VITE_STATIC_BASE_URL=https://yourdomain.com/blockchain-frontend
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_NODE_ENV=production
```

## Usage Examples

### 1. Using getImageUrl helper
```javascript
import { getImageUrl } from '../utils/imageUtils';

// In component
const imageUrl = getImageUrl('/assets/img/logo.png');
// Result: http://localhost:5173/assets/img/logo.png (dev)
// Result: https://yourdomain.com/blockchain-frontend/assets/img/logo.png (prod)
```

### 2. Using config directly
```javascript
import config from '../utils/config';

// Get static URL
const staticUrl = config.getStaticUrl('assets/img/logo.png');

// Get API URL
const apiUrl = config.getApiUrl('users/login/');
```

### 3. Using ImageWithBaseUrl component
```jsx
import ImageWithBaseUrl from '../components/ImageWithBaseUrl';

<ImageWithBaseUrl 
  src="/assets/img/logo.png" 
  alt="Logo" 
  className="w-16 h-16"
/>
```

## Testing

### 1. Visual Test
Visit `/test-images` route to see:
- All configuration values
- Generated URLs for different image paths
- Actual image loading with error handling
- Environment variables display

### 2. Console Test
Run the test script:
```bash
npm run test:images
```

### 3. Manual Test
Check browser network tab to verify:
- Images load with correct absolute URLs
- No 404 errors for static assets
- Proper base URL in production builds

## Production Deployment

### 1. Update Environment Variables
```env
VITE_BASE_URL=https://yourdomain.com/blockchain-frontend
VITE_STATIC_BASE_URL=https://yourdomain.com/blockchain-frontend
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_NODE_ENV=production
```

### 2. Build and Deploy
```bash
npm run build
# Deploy dist/ folder to your server
```

### 3. Server Configuration
Ensure your server serves static files from the correct path:
- Static files should be accessible at `/blockchain-frontend/assets/`
- API endpoints should be at `/api/`

## Troubleshooting

### Common Issues

1. **404 Errors for Images**
   - Check if `.env` file exists and has correct values
   - Verify `VITE_STATIC_BASE_URL` is set correctly
   - Ensure images exist in `public/` or `src/assets/` folders

2. **Wrong URLs in Production**
   - Update environment variables for production
   - Check `vite.config.js` base path configuration
   - Verify server configuration matches the base path

3. **Images Not Loading**
   - Check browser console for errors
   - Verify image paths are correct
   - Test with `/test-images` route

### Debug Steps

1. Check configuration values:
```javascript
import config from './src/utils/config';
console.log('Static Base URL:', config.staticBaseUrl);
console.log('Environment:', config.nodeEnv);
```

2. Test image URL generation:
```javascript
import { getImageUrl } from './src/utils/imageUtils';
console.log('Generated URL:', getImageUrl('/logo.png'));
```

3. Check environment variables:
```javascript
console.log('VITE_STATIC_BASE_URL:', import.meta.env.VITE_STATIC_BASE_URL);
```

## Benefits

- ✅ **No more 404 errors** for static files
- ✅ **Environment-specific URLs** for different deployments
- ✅ **Centralized configuration** management
- ✅ **Easy production deployment** setup
- ✅ **Fallback handling** for missing images
- ✅ **Consistent URL generation** across the app
