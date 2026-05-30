import { supabase } from '@/src/lib/supabase';
import { CartItem, Address } from '@/src/types';

export const OrderService = {
  // 1. Create a new order
  async createOrder(params: {
    userId: string;
    items: CartItem[];
    totalAmount: number;
    shippingAddress: Address;
    paymentStatus?: string;
    paymentMethod?: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySignature?: string;
    consent?: any;
  }) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: params.userId,
        total_amount: params.totalAmount,
        shipping_address: params.shippingAddress,
        payment_id: params.razorpayPaymentId, // Mapping to existing schema
        status: 'Pending',
        payment_status: params.paymentStatus || 'Unpaid'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = params.items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      selected_size: item.selectedSize,
      selected_color: item.selectedColor
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Rollback order if items fail (Supabase doesn't have transactions in JS yet, but this is a safeguard)
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    return order;
  },

  // 2. Fetch order history
  async getOrderHistory(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(
            *,
            images:product_images(url, display_order)
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 3. Fetch a single order by ID
  async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(
            *,
            images:product_images(url, display_order)
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  },

  // 4. Update order status (Admin only)
  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) throw error;
    return data;
  },
  
  // 5. Cancel order
  async cancelOrder(orderId: string, reason?: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status: 'Cancelled', 
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
