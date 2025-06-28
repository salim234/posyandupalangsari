import React from 'react';

// Use a generic `C` that is a React.ElementType
// `ButtonOwnProps` are the props specific to our Button component
type ButtonOwnProps<C extends React.ElementType> = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  as?: C;
  className?: string;
};

// `ButtonProps` will be a combination of our own props and the props
// of the component it will render (e.g. `button` or `Link`).
// `Omit` is used to prevent prop conflicts.
type ButtonProps<C extends React.ElementType> = ButtonOwnProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonOwnProps<C>>;

// The component is now generic. It can accept a component type `C`.
const Button = <C extends React.ElementType = 'button'>({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  as,
  ...props
}: ButtonProps<C>) => {
  const Component = as || 'button';

  const baseClasses = "inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:pointer-events-none transform hover:-translate-y-0.5";
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-200 shadow-lg shadow-primary-200/80',
    secondary: 'bg-secondary-400 text-yellow-900 hover:bg-secondary-500 focus:ring-secondary-200 shadow-lg shadow-secondary-200/80',
    ghost: 'bg-transparent text-primary-700 hover:bg-primary-100 focus:ring-primary-200 shadow-none',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <Component
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading || (props as any).disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </Component>
  );
};

export default Button;