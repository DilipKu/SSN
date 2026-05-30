import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export class PaymentService {
  private static RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

  static async loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = this.RAZORPAY_SCRIPT_URL;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  static async createRazorpayOrder(amount: number) {
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: { action: 'create_order', amount },
    });

    if (error) {
      console.error('Edge Function Error:', error);
      throw new Error('Failed to create Razorpay order');
    }

    return data;
  }

  static async verifyPayment(paymentDetails: RazorpayResponse) {
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: { action: 'verify_payment', ...paymentDetails },
    });

    if (error || data.status !== 'success') {
      console.error('Edge Function Error:', error || data);
      throw new Error('Payment verification failed');
    }

    return data;
  }

  static async processPayment(options: {
    amount: number;
    name: string;
    description: string;
    email: string;
    contact: string;
    onSuccess: (response: RazorpayResponse) => void;
    onError?: (error: any) => void;
  }) {
    try {
      const isScriptLoaded = await this.loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        return;
      }

      const order = await this.createRazorpayOrder(options.amount);

      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      };

      if (!razorpayOptions.key) {
        console.error('RAZORPAY_KEY_ID is missing from environment variables');
        toast.error('We are unable to initiate secure payment at this time. Please try again later or contact our support team.');
        return;
      }

      const fullRazorpayOptions = {
        ...razorpayOptions,
        amount: order.amount,
        currency: order.currency,
        name: options.name,
        description: options.description,
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          try {
            await this.verifyPayment(response);
            options.onSuccess(response);
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
            if (options.onError) options.onError(error);
          }
        },
        prefill: {
          name: options.name,
          email: options.email,
          contact: options.contact,
        },
        theme: {
          color: '#1a1a1a', // Match project theme
        },
      };

      const rzp = new (window as any).Razorpay(fullRazorpayOptions);
      rzp.on('payment.failed', (response: any) => {
        toast.error('Payment failed: ' + response.error.description);
        if (options.onError) options.onError(response.error);
      });
      rzp.open();
    } catch (error) {
      console.error('Razorpay Error:', error);
      toast.error('Could not initiate payment. Please try again.');
      if (options.onError) options.onError(error);
    }
  }
}
