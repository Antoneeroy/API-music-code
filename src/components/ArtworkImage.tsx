import React, { useState } from 'react';
import { Music2 } from 'lucide-react';

interface ArtworkImageProps {
  src: string | null;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscRing?: boolean;
}

export const ArtworkImage: React.FC<ArtworkImageProps> = ({
  src,
  alt,
  className = '',
  size = 'md',
  showDiscRing = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16'
  };

  // If artwork is null or failed loading, show default placeholder icon
  if (!src || imageError) {
    return (
      <div
        className={`relative flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/60 overflow-hidden text-neutral-400 select-none ${className}`}
        aria-label={`${alt} (No artwork, default placeholder)`}
        role="img"
      >
        {/* Subtle vinyl groove texture background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-400 via-neutral-700 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
          <Music2 className={`${iconSizes[size]} text-amber-500/80 stroke-[1.75]`} />
          {size === 'xl' && (
            <span className="mt-2 text-[11px] font-medium tracking-wider text-neutral-400 uppercase">
              No Artwork
            </span>
          )}
        </div>
        {showDiscRing && (
          <div className="absolute inset-0 rounded-full border border-neutral-600/30 pointer-events-none" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-neutral-900 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-800/80 animate-pulse flex items-center justify-center">
          <Music2 className={`${iconSizes[size]} text-neutral-600`} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setImageError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
