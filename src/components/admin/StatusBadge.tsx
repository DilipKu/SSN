import React from 'react';
import { cn } from '@/src/lib/utils';

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'stock' | 'payment' | 'general';
}

export default function StatusBadge({ status, type = 'general' }: StatusBadgeProps) {
  const getColors = () => {
    const s = status.toLowerCase();
    
    // Order Statuses
    if (s === 'pending' || s === 'processing') return 'bg-amber-50 text-amber-600 border-amber-200';
    if (s === 'delivered' || s === 'completed' || s === 'active') return 'bg-green-50 text-green-600 border-green-200';
    if (s === 'shipped') return 'bg-blue-50 text-blue-600 border-blue-200';
    if (s === 'cancelled' || s === 'failed' || s === 'out of stock') return 'bg-red-50 text-red-600 border-red-200';
    if (s === 'low stock') return 'bg-orange-50 text-orange-600 border-orange-200';
    
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
      getColors()
    )}>
      {status}
    </span>
  );
}
