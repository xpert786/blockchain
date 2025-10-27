import React from 'react';
import { getImageUrl } from '../utils/imageUtils';
import config from '../utils/config';

const ImageTest = () => {
  const testImages = [
    '/logo.png',
    'assets/img/bg-images.png',
    'assets/img/image 5746.png',
    'public/logo.png',
    'public/vite.svg'
  ];

  const testUrls = [
    config.getStaticUrl('logo.png'),
    config.getStaticUrl('assets/img/bg-images.png'),
    config.getImageUrl('/logo.png'),
    config.getImageUrl('assets/img/bg-images.png')
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Image URL Test</h1>
      
      {/* Config Info */}
      <div className="mb-8 p-4 bg-white rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Configuration</h2>
        <div className="space-y-2">
          <p><strong>Base URL:</strong> {config.baseUrl}</p>
          <p><strong>Static Base URL:</strong> {config.staticBaseUrl}</p>
          <p><strong>API Base URL:</strong> {config.apiBaseUrl}</p>
          <p><strong>Environment:</strong> {config.nodeEnv}</p>
          <p><strong>Production:</strong> {import.meta.env.PROD ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Test Images */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testImages.map((imagePath, index) => (
            <div key={index} className="bg-white p-4 rounded-lg">
              <h3 className="font-medium mb-2">Path: {imagePath}</h3>
              <p className="text-sm text-gray-600 mb-2">
                URL: {getImageUrl(imagePath)}
              </p>
              <img 
                src={getImageUrl(imagePath)} 
                alt={`Test ${index + 1}`}
                className="w-full h-32 object-cover rounded border"
                onError={(e) => {
                  e.target.style.border = '2px solid red';
                  e.target.alt = 'Image not found';
                }}
                onLoad={(e) => {
                  e.target.style.border = '2px solid green';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Test URLs */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generated URLs</h2>
        <div className="space-y-2">
          {testUrls.map((url, index) => (
            <div key={index} className="bg-white p-3 rounded">
              <p className="text-sm font-mono break-all">{url}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Environment Variables */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="bg-white p-4 rounded-lg">
          <pre className="text-sm overflow-auto">
            {JSON.stringify({
              VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
              VITE_STATIC_BASE_URL: import.meta.env.VITE_STATIC_BASE_URL,
              VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
              VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
              PROD: import.meta.env.PROD,
              DEV: import.meta.env.DEV,
              MODE: import.meta.env.MODE
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ImageTest;
