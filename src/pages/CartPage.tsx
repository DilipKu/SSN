import React, { useState, useEffect } from 'react';
import { useCart } from '@/src/contexts/CartContext';
import { Button } from '@/src/components/ui/button';
import { Separator } from '@/src/components/ui/separator';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useWishlist } from '@/src/contexts/WishlistContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { ProductService } from '@/src/services/ProductService';
import { supabase } from '@/src/lib/supabase';
import { Heart, Plus, Loader2 } from 'lucide-react';
import { Product } from '@/src/types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart, addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && wishlist.length > 0) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
    }
  }, [user, wishlist]);

  const fetchWishlistItems = async () => {
    try {
      setLoadingWishlist(true);
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          product_id,
          products (
            *,
            category:categories(name),
            images:product_images(url, display_order),
            occasions:product_occasions(occasion:occasions(name))
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      const items = data?.map((item: any) => item.products).filter(Boolean) || [];
      setWishlistItems(items.map(p => ProductService.transformProduct(p)));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const moveToCart = async (product: Product) => {
    addToCart(product);
    await toggleWishlist(product.id);
    toast.success(`${product.name} moved to collection`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your collection is empty');
      return;
    }
    navigate('/checkout');
  };


  return (
    <div className="min-h-screen pt-32 pb-20 bg-beige/5">
      <div className="container mx-auto px-4">
        {cart.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-beige/10 rounded-full flex items-center justify-center mb-8">
              <ShoppingBag className="h-10 w-10 text-primary/40" />
            </div>
            <h1 className="text-4xl font-serif text-primary mb-4">Your Collection is Empty</h1>
            <p className="text-muted-foreground mb-10 max-w-md text-center">
              Every royal journey begins with a single masterpiece. Explore our collections to find your Kirdaar.
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90 text-white h-14 px-10 rounded-none uppercase tracking-widest text-xs font-bold">
                Explore Collections
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart Items */}
          <div className="flex-grow space-y-8">
            <div className="flex items-center justify-between border-b border-muted pb-6">
              <h1 className="text-4xl font-serif text-primary">Your Collection</h1>
              <span className="text-sm uppercase tracking-widest font-bold text-muted-foreground">{totalItems} Masterpieces</span>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex flex-col sm:flex-row gap-6 p-6 bg-white shadow-sm border border-primary/5 group"
                  >
                    <div className="w-full sm:w-32 aspect-[3/4] overflow-hidden bg-muted flex items-center justify-center">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-muted-foreground/20" />
                      )}
                    </div>

                    <div className="flex-grow flex flex-col justify-between py-2">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-serif text-primary">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-primary transition-colors p-2"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                          <span>Category: {item.category}</span>
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-6">
                        <div className="flex items-center border border-muted h-10 px-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)} className="p-2 text-muted-foreground hover:text-primary">-</button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => {
                              if (item.stock !== null && item.quantity >= item.stock) {
                                toast.error(`Royal Archive contains only ${item.stock} units of ${item.name}.`);
                                return;
                              }
                              updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor);
                            }} 
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-xl font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] space-y-8">
            <div className="bg-white p-8 shadow-2xl border border-primary/5 space-y-8 sticky top-32">
              <h2 className="text-2xl font-serif text-primary border-b border-muted pb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground uppercase tracking-widest font-bold">Subtotal</span>
                  <span className="font-bold">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground uppercase tracking-widest font-bold">Shipping</span>
                  <span className="text-secondary font-bold uppercase tracking-widest">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground uppercase tracking-widest font-bold">Taxes</span>
                  <span className="font-bold">Calculated at checkout</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-serif text-primary uppercase tracking-widest">Total</span>
                  <span className="text-2xl font-bold">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-none font-bold uppercase tracking-widest text-xs shadow-xl"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                <Link to="/">
                  <Button variant="ghost" className="w-full h-12 rounded-none text-muted-foreground hover:text-primary uppercase tracking-widest text-[10px] font-bold">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-secondary" />
                  Secure Checkout with Razorpay
                </div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  <Truck className="h-4 w-4 text-secondary" />
                  Global Express Delivery
                </div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  <RotateCcw className="h-4 w-4 text-secondary" />
                  Easy 7-Day Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Section */}
        {wishlistItems.length > 0 && (
          <div className="mt-32 space-y-12">
            <div className="flex items-center justify-between border-b border-muted pb-6">
              <div className="flex items-center gap-4">
                <Heart className="h-8 w-8 text-secondary fill-secondary/10" />
                <h2 className="text-3xl font-serif text-primary">From Your Wishlist</h2>
              </div>
              <Link to="/dashboard/wishlist" className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary hover:text-primary transition-colors">
                View All Archives
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {wishlistItems.slice(0, 4).map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group bg-white border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                  <Link to={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden relative">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ShoppingBag className="h-10 w-10 text-primary/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Link>

                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-secondary">{product.category}</p>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-primary line-clamp-1">{product.name}</h3>
                      <p className="text-base font-bold text-primary">₹{product.price.toLocaleString()}</p>
                    </div>

                    <Button 
                      onClick={() => moveToCart(product)}
                      className="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white rounded-none h-12 uppercase tracking-widest text-[9px] font-bold transition-all duration-300 gap-2"
                    >
                      <Plus className="h-3 w-3" /> Move to Collection
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
