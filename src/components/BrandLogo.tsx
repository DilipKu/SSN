import React from 'react';
import { cn } from '@/src/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  variant?: 'full' | 'emblem';
}

export default function BrandLogo({ 
  className, 
  size = 'md', 
  animated = true,
  variant = 'full'
}: BrandLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48 md:w-64 md:h-64'
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* Mandala Background Layer */}
      <svg 
        className={cn(
          "absolute inset-0 w-full h-full text-black/80",
          animated && "animate-[spin_60s_linear_infinite]"
        )} 
        viewBox="0 0 100 100"
      >
        <defs>
          <path id="mandala-petal-outer" d="M50,50 Q60,25 50,5 Q40,25 50,50" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path id="mandala-inner-detail" d="M50,35 Q55,30 50,25 Q45,30 50,35" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle id="mandala-dot" cx="50" cy="15" r="1" fill="currentColor" />
          
          {/* Gold Shimmer Gradient */}
          <linearGradient id="gold-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37">
              <animate attributeName="offset" values="-2; 2" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#FFF8E1">
              <animate attributeName="offset" values="-1; 3" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#D4AF37">
              <animate attributeName="offset" values="0; 4" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        
        {[...Array(12)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 50 50)`}>
            <use href="#mandala-petal-outer" />
            <use href="#mandala-inner-detail" />
            <use href="#mandala-dot" />
            <path d="M50,25 Q58,20 55,15" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <path d="M50,25 Q42,20 45,15" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </g>
        ))}
        <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      {/* Central Emblem Layer */}
      <div className={cn(
        "relative rounded-full bg-[#E63917] flex flex-col items-center justify-center shadow-2xl z-10 overflow-hidden border border-white/10",
        variant === 'full' ? "w-[62%] h-[62%]" : "w-full h-full"
      )}>
        {/* Gold Peacock Icon */}
        <div className="w-[60%] h-[60%] text-secondary mb-1 drop-shadow-md">
          <svg viewBox="0 0 24 24" fill="url(#gold-shimmer)">
            <path d="M12,2C12,2 14,4 14,7C14,10 12,12 12,12C12,12 10,10 10,7C10,4 12,2M12,13C14.5,13 16.5,14.5 17.5,16.6C17.8,17.3 18,18.1 18,19C18,21.2 16.2,23 14,23C11.8,23 10,21.2 10,19C10,18.1 10.2,17.3 10.5,16.6C11.5,14.5 13.5,13 16,13M12,15C10.3,15 9,16.3 9,18C9,19.7 10.3,21 12,21C13.7,21 15,19.7 15,18C15,16.3 13.7,15 12,15Z" />
            <path d="M12,6 Q15,8 14,12 Q13,15 15,18" fill="none" stroke="url(#gold-shimmer)" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>

        {/* Brand Text */}
        <div className="text-center leading-none -mt-1">
          <span className="text-secondary font-serif text-[15%] font-bold tracking-[0.05em] uppercase block">
            KIRDAAR
          </span>
          <span className="text-secondary font-serif italic text-[12%] tracking-wide block mt-0.5">
            Celebration
          </span>
        </div>

        {/* Subtle Shine Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none animate-[pulse_4s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
