import React from 'react';

interface AvatarProps {
  src?: string | null;
  name?: string; // Used for initials if src is not available
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center bg-gray-300 text-gray-700 overflow-hidden ${sizeClasses[size]} ${className || ''}`}
      title={name}
    >
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="object-cover w-full h-full" />
      ) : (
        <span className="font-semibold">{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
