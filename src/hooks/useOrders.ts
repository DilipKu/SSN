import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Order } from '../types';

export function useUserOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data as unknown as Order[]);
      } catch (error) {
        console.error('Error fetching user orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();

    // Subscribe to status changes for this user's orders
    const subscription = supabase
      .channel(`user_orders_${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders',
        filter: `user_id=eq.${userId}`
      }, fetchOrders)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return { orders, loading };
}

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data as unknown as Order[]);
      } catch (error) {
        console.error('Error fetching all orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllOrders();
  }, []);

  return { orders, loading };
}
