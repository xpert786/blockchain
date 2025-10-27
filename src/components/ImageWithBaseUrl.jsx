import React from 'react';
import { getImageUrl } from '../utils/imageUtils';

const ImageWithBaseUrl = ({ 
  src, 
  alt, 
  className = '', 
  fallback = '/assets/img/placeholder.png',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = React.useState(getImageUrl(src));
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(getImageUrl(fallback));
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithBaseUrl;
