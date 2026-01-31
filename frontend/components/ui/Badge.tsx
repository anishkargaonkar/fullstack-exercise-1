import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'red';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
