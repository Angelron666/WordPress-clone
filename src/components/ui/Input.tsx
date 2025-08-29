import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      className = '',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const baseInputStyles = `
      bg-white border rounded px-3 py-2 text-wp-base
      focus:outline-none focus:ring-1 focus:ring-wordpress-blue focus:border-wordpress-blue
      transition-colors duration-200
    `;
    
    const errorInputStyles = error
      ? 'border-wordpress-error focus:ring-wordpress-error focus:border-wordpress-error'
      : 'border-wordpress-border';
      
    const widthStyles = fullWidth ? 'w-full' : '';
    
    const iconPaddingLeft = leftIcon ? 'pl-10' : '';
    const iconPaddingRight = rightIcon ? 'pr-10' : '';
    
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-wp-base font-medium mb-1 text-wordpress-darkgray">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`${baseInputStyles} ${errorInputStyles} ${iconPaddingLeft} ${iconPaddingRight} ${widthStyles} ${className}`}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {helperText && !error && (
          <p className="mt-1 text-wp-small text-gray-500">{helperText}</p>
        )}
        
        {error && (
          <p className="mt-1 text-wp-small text-wordpress-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;