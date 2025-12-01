import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage Component
 * 
 * Implements lazy loading for images using Intersection Observer API.
 * Images are only loaded when they enter the viewport (with 50px margin).
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Loading placeholder
 * - Error handling
 * - Native lazy loading attribute as fallback
 * 
 * Usage:
 * ```tsx
 * <LazyImage
 *   src="/path/to/image.jpg"
 *   alt="Description"
 *   className="w-full h-auto"
 * />
 * ```
 */
export function LazyImage({
  src,
  alt,
  className,
  placeholderClassName,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load image immediately if IO not supported
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div
          className={cn(
            'absolute inset-0 bg-muted animate-pulse',
            placeholderClassName
          )}
          aria-hidden="true"
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          className={cn(
            'absolute inset-0 bg-muted flex items-center justify-center',
            placeholderClassName
          )}
          aria-label="Image failed to load"
        >
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy" // Native lazy loading as fallback
        decoding="async" // Async decoding for better performance
        {...props}
      />
    </div>
  );
}

export default LazyImage;
