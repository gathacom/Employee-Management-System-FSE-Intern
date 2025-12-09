import React from 'react';
import { Input } from '../atoms/Input';

export const FormField = ({ label, error, registration, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Input error={error} {...registration} {...props} />
      {error && (
        <span className="text-xs text-red-500">{error.message}</span>
      )}
    </div>
  );
};