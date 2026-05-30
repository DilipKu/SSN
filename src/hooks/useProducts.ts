import React, { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, images:product_images(*), category:categories(*)');

        if (error) throw error;
        setProducts(data as unknown as Product[]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    // Subscribe to changes
    const subscription = supabase
      .channel('products_all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { products, loading };
}

export function useCategoryProducts(categoryId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    async function fetchCategoryProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, images:product_images(*), category:categories(*)')
          .eq('category_id', categoryId);

        if (error) throw error;
        setProducts(data as unknown as Product[]);
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [categoryId]);

  return { products, loading };
}
