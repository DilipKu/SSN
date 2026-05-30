import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem as CartItemType } from '@/src/types';
import { ProductService } from '@/src/services/ProductService';
import { toast } from 'sonner';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from './AuthContext';

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => Promise<void>;
  removeFromCart: (productId: string, size?: string, color?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 1. Initial Load: Load from LocalStorage or Supabase
  useEffect(() => {
    const initCart = async () => {
      if (user) {
        await fetchDatabaseCart();
      } else {
        const savedCart = localStorage.getItem('kirdaar_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
      }
      setIsInitialLoad(false);
    };
    initCart();
  }, [user]);

  // 2. Persist to LocalStorage for guests
  useEffect(() => {
    if (!user && !isInitialLoad) {
      localStorage.setItem('kirdaar_cart', JSON.stringify(cart));
    }
  }, [cart, user, isInitialLoad]);

  const fetchDatabaseCart = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(
          *,
          category:categories(name),
          images:product_images(url, display_order),
          occasions:product_occasions(occasion:occasions(name))
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart:', error);
      return;
    }

    const transformedCart: CartItem[] = data.map(item => ({
      ...(ProductService.transformProduct(item.product) as any),
      quantity: item.quantity,
      selectedSize: item.selected_size,
      selectedColor: item.selected_color
    }));
    setCart(transformedCart);
  };

  const syncCart = async () => {
    if (!user || cart.length === 0) return;
    
    // Simple strategy: Upload local items to DB
    for (const item of cart) {
      await supabase.from('cart_items').upsert({
        user_id: user.id,
        product_id: item.id,
        quantity: item.quantity,
        selected_size: item.selectedSize,
        selected_color: item.selectedColor
      }, { onConflict: 'user_id,product_id,selected_size,selected_color' });
    }
    await fetchDatabaseCart();
    localStorage.removeItem('kirdaar_cart');
  };

  const addToCart = async (product: Product, quantity: number, size?: string, color?: string) => {
    // 1. Stock Validation
    const existingItem = cart.find(item => 
      item.id === product.id && 
      item.selectedSize === size && 
      item.selectedColor === color
    );
    
    const currentQuantityInCart = existingItem?.quantity || 0;
    const requestedTotal = currentQuantityInCart + quantity;

    if (requestedTotal > product.stock) {
      const remaining = product.stock - currentQuantityInCart;
      if (remaining <= 0) {
        toast.error(`Apologies, no more units of ${product.name} are available in this configuration.`);
      } else {
        toast.error(`You can only add ${remaining} more of this masterpiece to your collection.`);
      }
      return;
    }

    if (user) {
      const { error } = await supabase.from('cart_items').upsert({
        user_id: user.id,
        product_id: product.id,
        quantity: requestedTotal, // Use total quantity
        selected_size: size,
        selected_color: color
      }, { onConflict: 'user_id,product_id,selected_size,selected_color' });

      if (error) {
        toast.error('Failed to update cart in database');
        return;
      }
      await fetchDatabaseCart();
    } else {
      setCart(prev => {
        const existingItemIndex = prev.findIndex(item => 
          item.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color
        );

        if (existingItemIndex > -1) {
          const newCart = [...prev];
          newCart[existingItemIndex].quantity = requestedTotal;
          return newCart;
        }
        return [...prev, { ...product, quantity, selectedSize: size, selectedColor: color }];
      });
    }
    toast.success(`${product.name} added to your collection`);
  };

  const removeFromCart = async (productId: string, size?: string, color?: string) => {
    if (user) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .match({ 
          user_id: user.id, 
          product_id: productId,
          selected_size: size,
          selected_color: color
        });

      if (error) {
        toast.error('Failed to remove item');
        return;
      }
      await fetchDatabaseCart();
    } else {
      setCart(prev => prev.filter(item => 
        !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
      ));
    }
    toast.info('Item removed from cart');
  };

  const updateQuantity = async (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity < 1) return;

    // 1. Stock Validation
    const item = cart.find(i => 
      i.id === productId && i.selectedSize === size && i.selectedColor === color
    );
    
    if (item && quantity > item.stock) {
      toast.error(`Only ${item.stock} units are available for this masterpiece.`);
      return;
    }
    
    if (user) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .match({ 
          user_id: user.id, 
          product_id: productId,
          selected_size: size,
          selected_color: color
        });

      if (error) {
        toast.error('Failed to update quantity');
        return;
      }
      await fetchDatabaseCart();
    } else {
      setCart(prev => prev.map(item => 
        (item.id === productId && item.selectedSize === size && item.selectedColor === color)
          ? { ...item, quantity } 
          : item
      ));
    }
  };

  const clearCart = async () => {
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    }
    setCart([]);
    localStorage.removeItem('kirdaar_cart');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      totalItems,
      totalPrice,
      syncCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
