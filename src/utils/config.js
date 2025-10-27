// Environment configuration utility
const config = {
  // Base URL for the application
  baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:5173',
  
  // API Base URL
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Static Assets Base URL
  staticBaseUrl: import.meta.env.VITE_STATIC_BASE_URL || 'http://localhost:5173',
  
  // Environment
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
  
  // Helper function to get full URL for static assets
  getStaticUrl: (path) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${config.staticBaseUrl}/${cleanPath}`;
  },
  
  // Helper function to get full URL for API endpoints
  getApiUrl: (endpoint) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${config.apiBaseUrl}/${cleanEndpoint}`;
  },
  
  // Helper function to get full URL for any path
  getUrl: (path) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${config.baseUrl}/${cleanPath}`;
  }
};

export default config;
