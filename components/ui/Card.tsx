import React from 'react';

// Props for CardHeader, CardContent, CardFooter
interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

// Own props for the main Card component
type CardOwnProps<C extends React.ElementType> = {
  children: React.ReactNode;
  className?: string;
  as?: C;
};

// Combined props for the main Card component
type CardProps<C extends React.ElementType> = CardOwnProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof CardOwnProps<C>>;


const Card = <C extends React.ElementType = 'div'>({ children, className = '', as, ...props }: CardProps<C>) => {
  const Component = as || 'div';
  return (
    <Component className={`bg-white rounded-3xl shadow-lg overflow-hidden ${className}`} {...props}>
      {children}
    </Component>
  );
};

export const CardHeader: React.FC<CardSectionProps> = ({ children, className = '' }) => {
  return <div className={`p-6 border-b border-slate-100 ${className}`}>{children}</div>;
};

export const CardContent: React.FC<CardSectionProps> = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<CardSectionProps> = ({ children, className = '' }) => {
  return <div className={`p-6 bg-slate-50/50 border-t border-slate-100 ${className}`}>{children}</div>;
}


export default Card;