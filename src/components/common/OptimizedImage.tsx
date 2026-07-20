import { useState, type ReactNode } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  isVideo?: boolean;
  fallback?: ReactNode;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  isVideo = false,
  fallback
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-400 ${className}`}>
        <ImageIcon className="w-10 h-10" aria-hidden="true" />
      </div>
    );
  }

  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={className}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
