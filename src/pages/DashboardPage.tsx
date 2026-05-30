import React, { useEffect, useState } from 'react';
import { ProductService } from '@/src/services/ProductService';
import { OrderService } from '@/src/services/OrderService';
import { supabase } from '@/src/lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  ChevronRight,
  Package,
  Calendar,
  CreditCard,
  Loader2,
  MapPin,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Separator } from '@/src/components/ui/separator';
import { Badge } from '@/src/components/ui/badge';
import { useAuth } from '@/src/contexts/AuthContext';
import { cn } from '@/src/lib/utils';
import { toast } from 'sonner';
import { Select } from '@/src/components/ui/select';
import { INDIAN_STATES, STATE_CITIES } from '@/src/constants/locations';
import ProductCard from '@/src/components/luxury/ProductCard';

export default function DashboardPage() {
  const { user, signOut, loading: authLoading, refreshProfile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [profileState, setProfileState] = useState(user?.state || '');
  const [profileCity, setProfileCity] = useState(user?.city || '');
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfileState(user.state || '');
      setProfileCity(user.city || '');
    }
  }, [user]);

  // Determine active screen from URL
  const activeTab = (pathname === '/dashboard' || pathname === '/dashboard/') ? 'orders' : pathname.split('/').pop() || 'orders';

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      if (activeTab === 'orders') {
        fetchUserOrders();
        fetchNewArrivals();
      } else if (activeTab === 'wishlist') {
        fetchWishlistItems();
      } else {
        // Settings tab doesn't need additional fetching
        setIsLoading(false);
      }
    }
  }, [user, authLoading, navigate, activeTab]);

  const fetchUserOrders = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await OrderService.getOrderHistory(user.id);
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWishlistItems = async () => {
    try {
      setIsLoading(true);
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
      // Transform the products using ProductService
      const items = data?.map((item: any) => item.products).filter(Boolean) || [];
      setWishlistItems(items.map(p => ProductService.transformProduct(p)));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNewArrivals = async () => {
    try {
      const data = await ProductService.getProducts({ isNewArrival: true });
      setNewArrivals(data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
    }
  };

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const profileUpdates = {
        id: user.id,
        email: user.email, // Include email to satisfy NOT NULL constraint
        display_name: formData.get('display_name') as string,
        phone_number: formData.get('phone') as string, // Map phone to phone_number
        updated_at: new Date().toISOString(),
      };

      const addressUpdates = {
        user_id: user.id,
        street: formData.get('address_line1') as string,
        city: profileCity,
        state: profileState,
        zip_code: formData.get('pincode') as string,
        country: formData.get('country') as string,
        is_default: true,
        type: 'Home'
      };

      // 1. Update Profile
      const { error: profileError } = await supabase.from('profiles').upsert(profileUpdates);
      if (profileError) throw profileError;

      // 2. Update/Insert Address
      const { error: addressError } = await supabase
        .from('addresses')
        .upsert(
          user.address_id 
            ? { id: user.address_id, ...addressUpdates } 
            : addressUpdates
        );
      
      if (addressError) throw addressError;

      await refreshProfile();
      toast.success('Royal Registry updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update your registry');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin text-primary" />
          <p className="text-xs font-serif italic text-slate-500 uppercase tracking-widest">Opening your Royal Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-beige/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-8">
            <div className="bg-white p-8 shadow-2xl border border-primary/5 space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary overflow-hidden border-2 border-primary/20">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="h-10 w-10" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-primary">{user?.display_name || 'Royal Member'}</h2>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{user?.role || 'Member'}</p>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <p className="text-[10px] text-green-600 uppercase tracking-widest font-bold">{user?.status || 'Active'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <nav className="space-y-2">
                <Link 
                  to="/dashboard/orders"
                  className={cn(
                    "w-full flex items-center justify-between p-3 font-bold uppercase tracking-widest text-[10px] transition-all duration-300",
                    activeTab === 'orders' ? "bg-primary/5 text-primary border-l-4 border-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4" /> My Orders
                  </div>
                  <ChevronRight className="h-3 w-3" />
                </Link>
                <Link 
                  to="/dashboard/wishlist"
                  className={cn(
                    "w-full flex items-center justify-between p-3 font-bold uppercase tracking-widest text-[10px] transition-all duration-300",
                    activeTab === 'wishlist' ? "bg-primary/5 text-primary border-l-4 border-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4" /> Wishlist
                  </div>
                  <ChevronRight className="h-3 w-3" />
                </Link>
                <Link 
                  to="/dashboard/settings"
                  className={cn(
                    "w-full flex items-center justify-between p-3 font-bold uppercase tracking-widest text-[10px] transition-all duration-300",
                    activeTab === 'settings' ? "bg-primary/5 text-primary border-l-4 border-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4" /> Profile Settings
                  </div>
                  <ChevronRight className="h-3 w-3" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 text-red-600 hover:bg-red-50 font-bold uppercase tracking-widest text-[10px] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-4 w-4" /> Logout
                  </div>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-8 md:p-12 shadow-2xl border border-primary/5"
                >
                  <div className="flex items-center justify-between mb-12 border-b border-muted pb-6">
                    <h1 className="text-4xl font-serif text-primary">Your Royal Orders</h1>
                    <span className="text-sm uppercase tracking-widest font-bold text-muted-foreground">{orders.length} Total</span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-20 text-center space-y-6">
                      <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="h-10 w-10 text-primary/40" />
                      </div>
                      <h3 className="text-2xl font-serif text-primary">No orders yet</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Your royal journey is just beginning. Explore our collections to find your first Kirdaar.
                      </p>
                      <Link to="/">
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-none h-14 px-10 uppercase tracking-widest text-xs font-bold">
                          Explore Collections
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-muted p-6 space-y-6 hover:border-primary/20 transition-colors">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                              {/* Primary Image Thumbnail */}
                              <div className="w-16 h-20 bg-muted flex-shrink-0 overflow-hidden border border-primary/5">
                                {order.items?.[0]?.product?.images?.[0] ? (
                                  <img src={order.items[0].product.images[0].url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBag className="h-6 w-6 text-primary/20" />
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-grow">
                                <div className="space-y-1">
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Order ID</p>
                                  <p className="font-mono text-sm font-bold">#{order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Date</p>
                                  <div className="flex items-center gap-2 text-sm font-bold">
                                    <Calendar className="h-4 w-4 text-secondary" />
                                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Status</p>
                                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 rounded-none px-3 py-1 font-bold">
                                    {order.status}
                                  </Badge>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Total</p>
                                  <div className="flex items-center gap-2 text-lg font-bold text-primary">
                                    <CreditCard className="h-4 w-4 text-secondary" />
                                    ₹{order.total_amount.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center w-full md:w-auto">
                              <Button 
                                variant="outline" 
                                onClick={() => navigate(`/order/${order.id}`)}
                                className="w-full md:w-auto rounded-none border-primary text-primary hover:bg-primary hover:text-white uppercase tracking-widest text-[9px] font-bold h-9 px-5"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New Arrivals Section in Dashboard */}
                  <div className="mt-20 pt-12 border-t border-muted space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-serif text-primary">Discover New Masterpieces</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Freshly Unveiled in the Royal Collection</p>
                      </div>
                      <Link to="/category/all" className="text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-primary transition-colors">
                        Shop All
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {newArrivals.map((product) => (
                        <Link 
                          key={product.id} 
                          to={`/product/${product.id}`}
                          className="group space-y-3"
                        >
                          <div className="aspect-[3/4] overflow-hidden bg-slate-50 relative">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Package className="h-8 w-8" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest line-clamp-1">{product.name}</h4>
                            <p className="text-xs font-bold text-primary">₹{product.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-8 md:p-12 shadow-2xl border border-primary/5"
                >
                  <div className="flex items-center justify-between mb-12 border-b border-muted pb-6">
                    <h1 className="text-4xl font-serif text-primary">Your Wishlist</h1>
                    <span className="text-sm uppercase tracking-widest font-bold text-muted-foreground">{wishlistItems.length} Saved Items</span>
                  </div>

                  {wishlistItems.length === 0 ? (
                    <div className="py-20 text-center space-y-6">
                      <div className="w-20 h-20 bg-beige/10 rounded-full flex items-center justify-center mx-auto">
                        <Heart className="h-10 w-10 text-primary/40" />
                      </div>
                      <h3 className="text-2xl font-serif text-primary">Your archives are empty</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Save your favorite pieces here to keep them close for your special moments.
                      </p>
                      <Link to="/">
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-none h-14 px-10 uppercase tracking-widest text-xs font-bold">
                          Browse Masterpieces
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-8 md:p-12 shadow-2xl border border-primary/5"
                >
                  <div className="flex items-center justify-between mb-12 border-b border-muted pb-6">
                    <h1 className="text-4xl font-serif text-primary">Profile Settings</h1>
                    <span className="text-sm uppercase tracking-widest font-bold text-muted-foreground">Royal Identity</span>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Full Name</label>
                        <Input name="display_name" defaultValue={user?.display_name || ''} className="rounded-none h-12 border-muted" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Phone Number</label>
                        <Input name="phone" defaultValue={user?.phone || ''} className="rounded-none h-12 border-muted" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Email Address</label>
                        <Input value={user?.email || ''} disabled className="rounded-none h-12 border-muted bg-slate-50" />
                        <p className="text-[10px] text-muted-foreground italic">Email changes require royal verification. Contact support.</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Delivery Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Address Line 1</label>
                          <Input name="address_line1" defaultValue={user?.address_line1 || ''} className="rounded-none h-12 border-muted" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">State</label>
                          <Select
                            value={profileState}
                            onValueChange={(value) => {
                              setProfileState(value);
                              setProfileCity('');
                            }}
                            className="rounded-none h-12 border-muted bg-white"
                          >
                            <option value="" disabled>Select State</option>
                            {INDIAN_STATES.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">City</label>
                          <Select
                            value={profileCity}
                            onValueChange={setProfileCity}
                            disabled={!profileState}
                            className="rounded-none h-12 border-muted bg-white"
                          >
                            <option value="" disabled>Select City</option>
                            {profileState && STATE_CITIES[profileState]?.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                            {profileState && !STATE_CITIES[profileState] && (
                              <option value="Other">Other</option>
                            )}
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Pincode</label>
                          <Input name="pincode" defaultValue={user?.pincode || ''} className="rounded-none h-12 border-muted" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Country</label>
                          <Input name="country" defaultValue={user?.country || 'India'} className="rounded-none h-12 border-muted" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6">
                      <Button 
                        type="submit" 
                        disabled={isUpdating}
                        className="bg-primary hover:bg-primary/90 text-white rounded-none h-14 px-12 uppercase tracking-widest text-xs font-bold shadow-lg shadow-primary/20 gap-2"
                      >
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Registry'}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
