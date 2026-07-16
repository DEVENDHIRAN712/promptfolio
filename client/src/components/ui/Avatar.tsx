import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name?: string;
  className?: string;
  sizeClass?: string;
  onClick?: () => void;
}

export const getInitials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return parts[0][0]?.toUpperCase() || '?';
};

const avatarColors = [
  'bg-[#EEF2FF] text-[#4F46E5] border-[#E0E7FF]', // Indigo
  'bg-[#ECFDF5] text-[#10B981] border-[#D1FAE5]', // Emerald
  'bg-[#FFFBEB] text-[#F59E0B] border-[#FEF3C7]', // Amber
  'bg-[#FDF2F8] text-[#EC4899] border-[#FCE7F3]', // Pink
  'bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]', // Green
  'bg-[#F5F3FF] text-[#7C3AED] border-[#EDE9FE]', // Purple
  'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]', // Slate
];

export const getAvatarColorClass = (name?: string): string => {
  if (!name) return avatarColors[0];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return avatarColors[sum % avatarColors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  className,
  sizeClass = 'w-8 h-8',
  onClick,
}) => {
  const [hasError, setHasError] = React.useState(false);
  const initials = getInitials(name);
  const colorClass = getAvatarColorClass(name);

  // Check if image is the default placeholder or looks generic, we should still allow it, but prioritize uploaded ones.
  const isValidSrc = src && src.trim() !== '' && !hasError;

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative shrink-0 rounded-lg overflow-hidden border flex items-center justify-center font-bold text-xs select-none transition-all duration-150',
        sizeClass,
        !isValidSrc && colorClass,
        onClick && 'cursor-pointer hover:opacity-90 active:scale-95',
        className
      )}
    >
      {isValidSrc ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-semibold tracking-tight">{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
