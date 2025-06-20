import React from 'react';
import Image from 'next/image'; // Added import

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const pixelSizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const currentPixelSize = pixelSizes[size];

  const getInitials = (nameString?: string) => { // Renamed 'name' to 'nameString' to avoid conflict
    if (!nameString) return '?';
    const names = nameString.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center bg-gray-300 text-gray-700 overflow-hidden relative ${sizeClasses[size]} ${className || ''}`}
      title={name}
    >
      {src ? (
        <Image
          src={src}
          alt={name || 'Avatar'}
          width={currentPixelSize}
          height={currentPixelSize}
          className="object-cover" // w-full h-full is implicitly handled by width/height on Image for non-fill layouts
        />
      ) : (
        <span className="font-semibold">{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
