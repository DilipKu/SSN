import React from 'react';
import { cn } from '../../utils/cn';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export const Heading = React.forwardRef<HTMLElement, TypographyProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }>(
  ({ className, as, level = 2, children, ...props }, ref) => {
    const Component = as || (`h${level}` as React.ElementType);
    
    const sizes = {
      1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
      2: 'text-3xl md:text-4xl font-semibold',
      3: 'text-2xl md:text-3xl font-semibold',
      4: 'text-xl md:text-2xl font-medium',
      5: 'text-lg md:text-xl font-medium',
      6: 'text-base md:text-lg font-medium',
    };

    return (
      <Component
        ref={ref}
        className={cn('font-playfair text-text-brown', sizes[level], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Heading.displayName = 'Heading';

export const Text = React.forwardRef<HTMLParagraphElement, TypographyProps & { variant?: 'default' | 'muted' | 'lead' | 'large' | 'small' }>(
  ({ className, as: Component = 'p', variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'text-base text-text-brown',
      muted: 'text-sm text-text-brown/70',
      lead: 'text-xl text-text-brown/80',
      large: 'text-lg font-medium text-text-brown',
      small: 'text-sm font-medium leading-none text-text-brown',
    };

    return (
      <Component
        ref={ref}
        className={cn('font-inter', variants[variant], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Text.displayName = 'Text';
