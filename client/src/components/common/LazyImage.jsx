import { useState } from 'react';

const DefaultFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-brand-surfaceHover gap-2">
    <svg className="w-8 h-8 text-brand-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  </div>
);

/**
 * Drop-in <img> replacement that:
 * - Shows a pulsing skeleton until the image has loaded
 * - Fades the image in smoothly once loaded
 * - Falls back to a placeholder icon if the src is missing or fails to load
 */
const LazyImage = ({ src, alt, className = '', fallback, ...rest }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {fallback || <DefaultFallback />}
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-brand-surfaceHover animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />
    </div>
  );
};

export default LazyImage;
