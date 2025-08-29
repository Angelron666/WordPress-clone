import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'link' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-wp rounded focus:outline-none transition-colors duration-200 inline-flex items-center justify-center';
  
  const variantStyles = {
    primary: 'bg-wordpress-blue hover:bg-wordpress-darkblue text-white',
    secondary: 'bg-wordpress-gray hover:bg-gray-200 text-wordpress-darkgray',
    danger: 'bg-wordpress-error hover:bg-red-600 text-white',
    success: 'bg-wordpress-success hover:bg-green-600 text-white',
    link: 'bg-transparent hover:underline text-wordpress-blue p-0',
    outline: 'bg-transparent border border-current hover:bg-wordpress-gray text-wordpress-blue',
  };
  
  const sizeStyles = {
    small: 'text-wp-small px-2 py-1',
    medium: 'text-wp-base px-4 py-2',
    large: 'text-wp-medium px-6 py-2.5',
  };
  
  const disabledStyles = disabled || isLoading
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;