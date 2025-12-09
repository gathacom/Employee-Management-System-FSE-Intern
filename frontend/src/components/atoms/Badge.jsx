import React from 'react';
import { clsx } from 'clsx';

const variants = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800',
};

export const Badge = ({ status = 'default', children }) => {
  const variant = variants[status.toLowerCase()] || variants.default;
  
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', variant)}>
      {children || status}
    </span>
  );
};