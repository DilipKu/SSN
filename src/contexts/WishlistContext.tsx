import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/src/types';
import { toast } from 'sonner';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[]; // Array of product IDs
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      const saved = localStorage.getItem('kirdaar_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
      return;
    }

    setWishlist(data.map(item => item.product_id));
  };

  const toggleWishlist = async (productId: string) => {
    const isCurrentlyIn = wishlist.includes(productId);

    if (user) {
      if (isCurrentlyIn) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .match({ user_id: user.id, product_id: productId });
        
        if (error) {
          toast.error('Failed to remove from wishlist');
          return;
        }
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: user.id, product_id: productId });
        
        if (error) {
          toast.error('Failed to add to wishlist');
          return;
        }
      }
      await fetchWishlist();
    } else {
      setWishlist(prev => {
        const newWishlist = isCurrentlyIn 
          ? prev.filter(id => id !== productId) 
          : [...prev, productId];
        localStorage.setItem('kirdaar_wishlist', JSON.stringify(newWishlist));
        return newWishlist;
      });
    }

    toast.success(isCurrentlyIn ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
