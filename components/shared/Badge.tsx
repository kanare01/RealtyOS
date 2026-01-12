import React from 'react';

type BadgeColor = 'green' | 'yellow' | 'red' | 'blue' | 'gray';

interface BadgeProps {
  color: BadgeColor;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ color, children }) => {
  const colorClasses: Record<BadgeColor, string> = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  const baseClasses = 'px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block';

  return (
    <span className={`${baseClasses} ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

export default Badge;