import { ReactNode } from 'react';
import { cn } from '../ui/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-white border border-gray-200',
  glass: 'bg-white/60 backdrop-blur-sm border border-purple-100/50',
  solid: 'bg-white border border-gray-200',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

export function Card({ 
  children, 
  className, 
  variant = 'glass',
  padding = 'lg' 
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl shadow-lg',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

