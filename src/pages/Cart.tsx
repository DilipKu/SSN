import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Heading } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Plus, Minus, Trash2, Bookmark, Gift, Lock, Tag, ShieldCheck, CheckCircle, Truck, Percent, Star } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  qty: number;
  image: string;
  isGhee?: boolean;
  isHandcrafted?: boolean;
  isSugarFree?: boolean;
  isFestive?: boolean;
  rating: number;
  reviewsCount: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Only 2 Left';
}

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'c1',
    name: 'Royal Motichoor Ladoo Box',
    weight: '500g',
    price: 450,
    qty: 1,
    image: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg',
    isGhee: true,
    isHandcrafted: true,
    rating: 4.9,
    reviewsCount: 124,
    stockStatus: 'In Stock'
  },
  {
    id: 'c2',
    name: 'Premium Kaju Katli (Pure Ghee)',
    weight: '500g',
    price: 850,
    qty: 1,
    image: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg',
    isGhee: true,
    isHandcrafted: true,
    rating: 4.8,
    reviewsCount: 96,
    stockStatus: 'Low Stock'
  }
];

const INITIAL_SAVED_ITEMS: CartItem[] = [
  {
    id: 's1',
    name: 'Royal Roasted Almond Gifting Box',
    weight: '1kg',
    price: 1500,
    qty: 1,
    image: 'https://images.pexels.com/photos/2386158/pexels-photo-2386158.jpeg',
    isHandcrafted: true,
    isFestive: true,
    rating: 4.9,
    reviewsCount: 88,
    stockStatus: 'In Stock'
  }
];

const GIFT_THEMES = [
  { id: 'diwali', label: 'Diwali Celebration', icon: '🪔', color: 'from-amber-600 to-amber-900' },
  { id: 'rakhi', label: 'Raksha Bandhan', icon: '🤝', color: 'from-pink-600 to-pink-900' },
  { id: 'wedding', label: 'Royal Wedding', icon: '💍', color: 'from-red-700 to-red-950' },
  { id: 'anniversary', label: 'Silver Anniversary', icon: '✨', color: 'from-indigo-600 to-indigo-950' },
  { id: 'birthday', label: 'Sweet Birthday', icon: '🎂', color: 'from-teal-600 to-teal-950' },
  { id: 'corporate', label: 'Corporate Gala', icon: '💼', color: 'from-slate-700 to-slate-950' }
];

const WRAP_STYLES = [
  { id: 'crimson', name: 'Royal Crimson Velvet Wrap', price: 150, desc: 'Rich crimson velvet fabric with gold metallic thread ribbon' },
  { id: 'saffron', name: 'Imperial Saffron Silk Ribbon', price: 120, desc: 'Soft saffron silk tie with fine hand-embossed brass bells' },
  { id: 'emerald', name: 'Emerald Forest Brocade Cover', price: 180, desc: 'Classic emerald green brocade paper box with gold foil prints' }
];

const COUPONS = [
  { code: 'DIWALI25', discountPercent: 25, minAmount: 1200, desc: '25% off on orders above ₹1,200 for festive sweets' },
  { code: 'FESTIVE20', discountPercent: 20, minAmount: 800, desc: '20% off on all gift collections and combos' },
  { code: 'SWEETLOVE', discountPercent: 10, minAmount: 0, desc: '10% off on your entire purchase, no minimum spend' }
];

const CROSS_SELL_RECOMMENDATIONS = [
  {
    id: 'cr1',
    name: 'Spicy Masala Bhujia Savory Pack',
    weight: '250g',
    price: 180,
    image: 'https://images.pexels.com/photos/31617910/pexels-photo-31617910.jpeg',
    tag: 'Savory Pair'
  },
  {
    id: 'cr2',
    name: 'Sugar-Free Dates & Kesar Roll',
    weight: '500g',
    price: 1200,
    image: 'https://images.pexels.com/photos/37124553/pexels-photo-37124553.jpeg',
    tag: 'Sugar-Free Special'
  }
];

export const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [savedItems, setSavedItems] = useState<CartItem[]>(INITIAL_SAVED_ITEMS);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Gifting state
  const [isGift, setIsGift] = useState<boolean>(false);
  const [giftTheme, setGiftTheme] = useState<string>('diwali');
  const [wrapStyle, setWrapStyle] = useState<string>('crimson');
  const [recipientName, setRecipientName] = useState<string>('');
  const [giftMessage, setGiftMessage] = useState<string>('');

  // Coupon state
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [customCouponCode, setCustomCouponCode] = useState<string>('');

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(item.qty + delta, 1) };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showFeedback('Item removed from your sweet collection.');
  };

  const handleSaveForLater = (item: CartItem) => {
    setCartItems(prev => prev.filter(i => i.id !== item.id));
    setSavedItems(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
    showFeedback('Item saved for later.');
  };

  const handleMoveToCart = (item: CartItem) => {
    setSavedItems(prev => prev.filter(i => i.id !== item.id));
    setCartItems(prev => {
      if (prev.some(i => i.id === item.id)) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, item];
    });
    showFeedback('Moved back to your active hamper.');
  };

  const handleRemoveSavedItem = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
    showFeedback('Saved item removed.');
  };

  const handleAddRecommendation = (rec: typeof CROSS_SELL_RECOMMENDATIONS[0]) => {
    const newItem: CartItem = {
      id: rec.id,
      name: rec.name,
      weight: rec.weight,
      price: rec.price,
      qty: 1,
      image: rec.image,
      isHandcrafted: true,
      rating: 4.8,
      reviewsCount: 64,
      stockStatus: 'In Stock'
    };
    setCartItems(prev => {
      if (prev.some(i => i.id === rec.id)) {
        return prev.map(i => i.id === rec.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, newItem];
    });
    showFeedback(`${rec.name} added to your collection.`);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  // Coupon deduction
  let couponDiscount = 0;
  const activeCoupon = COUPONS.find(c => c.code === selectedCoupon);
  if (activeCoupon && subtotal >= activeCoupon.minAmount) {
    couponDiscount = Math.round((subtotal * activeCoupon.discountPercent) / 100);
  }

  // Wrap cost
  const selectedWrapObj = WRAP_STYLES.find(w => w.id === wrapStyle);
  const wrapCost = isGift && selectedWrapObj ? selectedWrapObj.price : 0;

  // Shipping
  const shippingThreshold = 999;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 150;

  // Taxes
  const taxes = Math.round((subtotal - couponDiscount) * 0.05); // 5% GST on sweets

  const finalTotal = subtotal - couponDiscount + wrapCost + shippingCost + taxes;
  const totalSavings = couponDiscount;

  const handleApplyCoupon = (code: string) => {
    const coupon = COUPONS.find(c => c.code === code.toUpperCase());
    if (!coupon) {
      showFeedback('Invalid coupon code.');
      return;
    }
    if (subtotal < coupon.minAmount) {
      showFeedback(`Minimum order of ₹${coupon.minAmount} required for coupon ${coupon.code}.`);
      return;
    }
    setSelectedCoupon(coupon.code);
    showFeedback(`Coupon ${coupon.code} applied successfully!`);
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    showFeedback('Coupon removed.');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: 'easeOut' as const }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary-cream">
      <Navbar />

      <main className="flex-grow pb-24 text-left">
        {/* Page Header Banner */}
        <section className="relative py-20 overflow-hidden bg-white/40 border-b border-secondary-sand/30">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-primary-gold)_0%,_transparent_65%)]"></div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10 text-center space-y-4 max-w-3xl">
            <span className="text-primary font-bold text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-gold" /> Premium Checkout Prep
            </span>
            <Heading level={1} className="text-3xl md:text-5xl font-bold text-text-brown">Your Celebration Hamper</Heading>
            <p className="text-text-brown/70 font-inter font-light text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Every slow-cooked delight in your collection is prepared freshly in pure ghee only upon final check.
            </p>
          </div>
        </section>

        {/* Global Feedback Banner */}
        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1E0C05] text-primary-gold text-xs px-6 py-3 rounded-full shadow-2xl border border-primary-gold/45 font-inter font-bold tracking-wider"
            >
              ✨ {feedback}
            </motion.div>
          )}
        </AnimatePresence>

        <section className="py-12 container mx-auto px-4 md:px-8">
          <AnimatePresence mode="wait">
            {cartItems.length === 0 ? (
              
              /* Empty state section */
              <motion.div 
                key="empty-cart"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-white rounded-3xl border border-secondary-sand/35 shadow-xl max-w-xl mx-auto space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-primary/5 mx-auto flex items-center justify-center text-primary-gold">
                  <ShoppingBag className="w-10 h-10 opacity-40" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-playfair font-bold text-2xl text-text-brown">Your Celebration Cart Awaits</h4>
                  <p className="text-sm text-text-brown/65 font-inter max-w-sm mx-auto leading-relaxed">
                    Explore our legacy slow-cooked cashew confections, pure ghee laddus, and customized festival packaging to fill your basket.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/category/all">
                    <Button className="bg-primary hover:bg-primary/95 text-secondary-cream border-none h-11 px-6 font-bold shadow-md">
                      Explore Sweets
                    </Button>
                  </Link>
                  <Link to="/category/festive">
                    <Button variant="outline" className="border-secondary-sand text-text-brown hover:bg-secondary-cream/50 h-11 px-6 font-bold">
                      Discover Gift Hampers
                    </Button>
                  </Link>
                </div>
              </motion.div>

            ) : (

              /* Two column layout */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT SIDE: items, gifting, recommendations, save for later */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Luxury Product Cards */}
                  <div className="space-y-4">
                    <h3 className="font-playfair font-bold text-xl text-text-brown border-b border-secondary-sand/30 pb-2 flex items-center gap-2">
                      <span>Confections Selected</span>
                      <span className="text-xs font-inter bg-primary/5 border border-primary-gold/30 text-primary px-2.5 py-0.5 rounded-full">
                        {cartItems.length} Products
                      </span>
                    </h3>

                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          {...fadeInUp}
                          className="bg-white border border-secondary-sand/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col sm:flex-row gap-6"
                        >
                          {/* Image Block */}
                          <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0 border border-secondary-sand/20 relative group">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                            {item.isGhee && (
                              <span className="absolute top-2 left-2 text-[8px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white px-2 py-0.5 rounded shadow-sm">
                                Pure Ghee
                              </span>
                            )}
                          </div>

                          {/* Content Details Block */}
                          <div className="flex-grow flex flex-col justify-between text-left space-y-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {item.isHandcrafted && (
                                  <span className="text-[8px] bg-primary/5 border border-primary-gold/35 text-primary uppercase font-bold tracking-wider px-1.5 py-0.5 rounded">
                                    Handcrafted
                                  </span>
                                )}
                                <span className={`text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                                  item.stockStatus === 'In Stock' 
                                    ? 'bg-emerald-50 text-emerald-700' 
                                    : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {item.stockStatus}
                                </span>
                              </div>
                              <h4 className="font-playfair font-bold text-base md:text-lg text-text-brown leading-snug">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-text-brown/50 font-inter">
                                <span>Pack Size: {item.weight}</span>
                                <span className="flex items-center gap-0.5 text-amber-600">
                                  <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" /> {item.rating} ({item.reviewsCount} reviews)
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons & Stepper */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-secondary-sand/15">
                              {/* Quantity Stepper */}
                              <div className="flex items-center border border-secondary-sand/55 rounded-full overflow-hidden bg-secondary-cream/20">
                                <button 
                                  onClick={() => handleUpdateQty(item.id, -1)}
                                  className="p-2 text-text-brown hover:bg-secondary-sand/20 transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-4 text-sm font-bold text-text-brown font-inter">{item.qty}</span>
                                <button 
                                  onClick={() => handleUpdateQty(item.id, 1)}
                                  className="p-2 text-text-brown hover:bg-secondary-sand/20 transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="flex flex-col items-end">
                                <span className="font-playfair font-bold text-lg text-primary">₹{item.price * item.qty}</span>
                                {item.qty > 1 && (
                                  <span className="text-[10px] text-text-brown/40 font-inter">₹{item.price} each</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Edit/Delete Overlays */}
                          <div className="absolute top-4 right-4 flex items-center gap-1.5">
                            <button 
                              onClick={() => handleSaveForLater(item)}
                              title="Save for Later"
                              className="w-8 h-8 rounded-full border border-secondary-sand/40 flex items-center justify-center text-text-brown/50 hover:text-primary hover:bg-primary/5 transition-colors bg-white"
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              title="Remove item"
                              className="w-8 h-8 rounded-full border border-secondary-sand/40 flex items-center justify-center text-text-brown/50 hover:text-primary hover:bg-primary/5 transition-colors bg-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Luxury Gifting Options Drawer */}
                  <div className="bg-white border border-secondary-sand/30 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-secondary-sand/15 pb-4">
                      <div className="space-y-1">
                        <h4 className="font-playfair font-bold text-lg text-text-brown flex items-center gap-2">
                          <Gift className="w-5 h-5 text-primary-gold" /> Regal Gifting Customizer
                        </h4>
                        <p className="text-xs text-text-brown/60 font-inter">Add bespoke packaging and a personalized greeting box to your delivery.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={isGift}
                          onChange={(e) => setIsGift(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary-sand/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <AnimatePresence>
                      {isGift && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden space-y-6"
                        >
                          {/* Gift Themes */}
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-text-brown uppercase tracking-wider block">1. Select Occasion Theme</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {GIFT_THEMES.map((theme) => (
                                <button
                                  key={theme.id}
                                  onClick={() => setGiftTheme(theme.id)}
                                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                                    giftTheme === theme.id 
                                      ? 'border-primary bg-primary/5 shadow-inner' 
                                      : 'border-secondary-sand/30 hover:border-secondary-sand bg-white'
                                  }`}
                                >
                                  <span className="text-xl">{theme.icon}</span>
                                  <span className="text-xs font-bold text-text-brown font-playfair">{theme.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Wrapping Ribbon Styles */}
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-text-brown uppercase tracking-wider block">2. Velvet & Silk Wrappings</label>
                            <div className="space-y-3">
                              {WRAP_STYLES.map((wrap) => (
                                <div 
                                  key={wrap.id}
                                  onClick={() => setWrapStyle(wrap.id)}
                                  className={`p-4 rounded-xl border cursor-pointer flex justify-between items-start gap-4 transition-all ${
                                    wrapStyle === wrap.id
                                      ? 'border-primary bg-primary-gold/5 shadow-inner'
                                      : 'border-secondary-sand/30 hover:border-secondary-sand bg-white'
                                  }`}
                                >
                                  <div className="space-y-1">
                                    <p className="text-xs font-bold font-playfair text-text-brown">{wrap.name}</p>
                                    <p className="text-[10px] text-text-brown/60 leading-relaxed font-inter">{wrap.desc}</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-xs font-bold text-primary font-inter">+₹{wrap.price}</p>
                                    <div className={`w-3.5 h-3.5 rounded-full border border-secondary-sand mt-2 mx-auto flex items-center justify-center ${
                                      wrapStyle === wrap.id ? 'bg-primary border-primary' : 'bg-white'
                                    }`}>
                                      {wrapStyle === wrap.id && <span className="w-1.5 h-1.5 rounded-full bg-primary-gold" />}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Personal Note */}
                          <div className="space-y-3">
                            <label className="text-xs font-bold text-text-brown uppercase tracking-wider block">3. Handwritten Shagun Card Msg</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <input 
                                  type="text" 
                                  placeholder="Recipient's Name (e.g. Grandma & Grandpa)" 
                                  value={recipientName}
                                  onChange={(e) => setRecipientName(e.target.value)}
                                  className="w-full bg-secondary-cream/30 border border-secondary-sand/40 rounded-xl px-4 py-2.5 text-xs text-text-brown placeholder:text-text-brown/40 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-inter"
                                />
                                <textarea 
                                  rows={4}
                                  placeholder="Write your blessings / sweet note here... We will handwrite this on gold-trimmed parchment."
                                  value={giftMessage}
                                  onChange={(e) => setGiftMessage(e.target.value)}
                                  className="w-full bg-secondary-cream/30 border border-secondary-sand/40 rounded-xl p-4 text-xs text-text-brown placeholder:text-text-brown/40 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-inter leading-relaxed"
                                />
                              </div>

                              {/* Live preview parchment card */}
                              <div className="bg-[#FAF7F0] border-2 border-primary-gold/30 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[170px] select-none">
                                <div className="absolute top-0 right-0 w-16 h-16 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-primary-gold)_0%,_transparent_65%)]"></div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between border-b border-primary-gold/15 pb-2">
                                    <span className="text-[9px] uppercase font-bold tracking-widest text-primary-gold">Sudarshan Confections</span>
                                    <span className="text-[10px] text-primary">{GIFT_THEMES.find(t => t.id === giftTheme)?.icon}</span>
                                  </div>
                                  <p className="text-[10px] font-bold font-playfair text-text-brown">To: {recipientName || 'Your Loved One'}</p>
                                  <p className="text-[10px] italic text-text-brown/80 font-serif leading-relaxed line-clamp-4">
                                    "{giftMessage || 'Sending sweet blessings for a grand celebration and lifetimes of sweet memories together!'}"
                                  </p>
                                </div>
                                <div className="text-right border-t border-primary-gold/10 pt-2 text-[8px] font-bold text-text-brown/40 uppercase font-inter tracking-wider">
                                  Handwritten with Pure Love
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Curated Recommendations */}
                  <div className="bg-white/40 border border-secondary-sand/30 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="space-y-1">
                      <h4 className="font-playfair font-bold text-lg text-text-brown flex items-center gap-1.5">
                        <Sparkles className="w-5 h-5 text-primary-gold animate-spin-slow" /> Complete the Feast
                      </h4>
                      <p className="text-xs text-text-brown/60 font-inter">Add these traditional savories or dry rolls to balance the sweetness of your platter.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {CROSS_SELL_RECOMMENDATIONS.map((rec) => (
                        <div 
                          key={rec.id}
                          className="bg-white border border-secondary-sand/25 rounded-xl p-3 flex gap-4 items-center hover:shadow-md transition-shadow"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-secondary-sand/20">
                            <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-grow space-y-2">
                            <div>
                              <span className="text-[9px] bg-primary/5 text-primary border border-primary-gold/25 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                                {rec.tag}
                              </span>
                              <h5 className="font-playfair font-bold text-xs text-text-brown leading-snug mt-1.5">{rec.name}</h5>
                            </div>
                            
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-playfair font-bold text-sm text-primary">₹{rec.price}</span>
                              <Button 
                                onClick={() => handleAddRecommendation(rec)}
                                size="sm" 
                                className="bg-primary hover:bg-primary/95 text-secondary-cream border-none h-7 px-3.5 text-[10px] font-bold"
                              >
                                Quick Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save For Later shelf */}
                  {savedItems.length > 0 && (
                    <div className="bg-white border border-secondary-sand/30 rounded-2xl p-6 shadow-sm space-y-4">
                      <h4 className="font-playfair font-bold text-lg text-text-brown border-b border-secondary-sand/20 pb-2">
                        Saved for Later ({savedItems.length})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedItems.map((item) => (
                          <div 
                            key={item.id}
                            className="bg-secondary-cream/10 border border-secondary-sand/25 rounded-xl p-3 flex gap-4 relative"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-secondary-sand/20">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-grow space-y-2">
                              <div>
                                <h5 className="font-playfair font-bold text-xs text-text-brown leading-snug">{item.name}</h5>
                                <p className="text-[10px] text-text-brown/40 font-inter mt-0.5">Weight: {item.weight}</p>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-playfair font-bold text-xs text-primary">₹{item.price}</span>
                                <Button 
                                  onClick={() => handleMoveToCart(item)}
                                  size="sm" 
                                  className="bg-[#1E0C05] hover:bg-[#2c1308] text-primary-gold border border-primary-gold/30 h-7 px-3 text-[10px] font-bold flex items-center gap-1"
                                >
                                  Move to Cart
                                </Button>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleRemoveSavedItem(item.id)}
                              className="absolute top-2.5 right-2.5 text-text-brown/45 hover:text-primary transition-colors"
                              title="Delete from saved shelf"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* RIGHT SIDE: sticky summary, free shipping progress, coupons, secure checkout, trust badges */}
                <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                  
                  {/* Free Shipping Tracker */}
                  <div className="bg-white border border-secondary-sand/35 p-5 rounded-2xl shadow-sm text-center space-y-3">
                    <p className="text-xs font-inter text-text-brown/85">
                      {subtotal >= 999 ? (
                        <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> Free Express Shipping Unlocked!
                        </span>
                      ) : (
                        <>
                          You're only <span className="font-bold text-primary">₹{999 - subtotal}</span> away from <span className="font-bold">Free Premium Delivery</span>
                        </>
                      )}
                    </p>
                    <div className="w-full bg-secondary-cream h-2 rounded-full overflow-hidden border border-secondary-sand/10">
                      <div 
                        className="bg-primary-gold h-full transition-all duration-300"
                        style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-text-brown/50 font-inter">Orders ship in insulated boxes with cold pack layers.</p>
                  </div>

                  {/* Luxury Coupon Section */}
                  <div className="bg-white border border-secondary-sand/35 p-5 rounded-2xl shadow-sm space-y-4">
                    <h4 className="font-playfair font-bold text-sm text-text-brown flex items-center gap-1.5 border-b border-secondary-sand/15 pb-2">
                      <Tag className="w-4 h-4 text-primary-gold" /> Applied Gift Coupons
                    </h4>

                    {/* Applied coupon banner */}
                    <AnimatePresence mode="wait">
                      {selectedCoupon ? (
                        <motion.div 
                          key="coupon-applied"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Percent className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <p className="font-bold">{selectedCoupon}</p>
                              <p className="text-[10px] text-emerald-700/85">Saving ₹{couponDiscount} applied</p>
                            </div>
                          </div>
                          <button 
                            onClick={handleRemoveCoupon}
                            className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 hover:text-red-700 bg-white px-2 py-1 rounded border border-emerald-300"
                          >
                            Remove
                          </button>
                        </motion.div>
                      ) : (
                        <div className="space-y-3">
                          {/* Manual entry */}
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Enter coupon code" 
                              value={customCouponCode}
                              onChange={(e) => setCustomCouponCode(e.target.value)}
                              className="w-full bg-secondary-cream/30 border border-secondary-sand/40 rounded-xl px-4 py-2 text-xs text-text-brown uppercase placeholder:normal-case placeholder:text-text-brown/40 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-inter font-bold"
                            />
                            <Button 
                              onClick={() => handleApplyCoupon(customCouponCode)}
                              className="bg-primary hover:bg-primary/95 text-secondary-cream border-none font-bold text-xs h-9 px-4 shrink-0"
                            >
                              Apply
                            </Button>
                          </div>

                          {/* Quick Coupon select */}
                          <div className="space-y-2.5 pt-2">
                            {COUPONS.map((cpn) => {
                              const isEligible = subtotal >= cpn.minAmount;
                              return (
                                <div 
                                  key={cpn.code}
                                  onClick={() => isEligible && handleApplyCoupon(cpn.code)}
                                  className={`p-3 rounded-xl border flex justify-between items-center text-left transition-all ${
                                    isEligible 
                                      ? 'border-secondary-sand/45 hover:border-primary bg-secondary-cream/5 cursor-pointer' 
                                      : 'border-secondary-sand/15 bg-secondary-sand/5 opacity-55 cursor-not-allowed'
                                  }`}
                                >
                                  <div className="space-y-0.5">
                                    <span className="font-mono font-bold text-xs bg-[#1E0C05] text-primary-gold px-2 py-0.5 rounded border border-primary-gold/20">
                                      {cpn.code}
                                    </span>
                                    <p className="text-[10px] text-text-brown/65 leading-relaxed mt-1 font-inter">{cpn.desc}</p>
                                  </div>
                                  <span className="text-[10px] font-bold text-primary font-inter shrink-0">
                                    {cpn.discountPercent}% OFF
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Summary Invoice Details */}
                  <div className="bg-white border border-secondary-sand/35 p-6 rounded-2xl shadow-md space-y-4">
                    <h4 className="font-playfair font-bold text-base text-text-brown border-b border-secondary-sand/15 pb-2">
                      Invoice Summary
                    </h4>

                    <div className="space-y-3 text-xs font-inter text-text-brown/85">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span>₹{subtotal}</span>
                      </div>
                      
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Coupon Discount:</span>
                          <span>-₹{couponDiscount}</span>
                        </div>
                      )}

                      {isGift && wrapCost > 0 && (
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1.5">
                            <Gift className="w-3.5 h-3.5 text-primary-gold" /> Velvet wrapping:
                          </span>
                          <span>₹{wrapCost}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Taxes (5% GST):</span>
                        <span>₹{taxes}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Shipping Logistics:</span>
                        <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                      </div>

                      {totalSavings > 0 && (
                        <div className="bg-emerald-50 border border-emerald-150 p-2.5 rounded-lg text-emerald-800 text-[11px] font-bold text-center mt-2">
                          ✨ Total savings on this order: ₹{totalSavings}
                        </div>
                      )}

                      <div className="border-t border-secondary-sand/20 pt-4 flex justify-between items-center text-text-brown font-playfair font-bold text-base">
                        <span>Grand Total:</span>
                        <span className="text-primary text-xl">₹{finalTotal}</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <Button 
                        onClick={() => alert('Proceeding to secure checkout gateway (simulated)... Thank you for celebrating with SSN!')}
                        className="w-full bg-primary hover:bg-primary/95 text-secondary-cream border-none h-12 font-bold font-playfair text-xs tracking-wider rounded-full flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Lock className="w-4 h-4 text-primary-gold" /> Proceed to Secure Checkout
                      </Button>
                      <Link to="/category/all" className="block text-center text-[10px] uppercase font-bold tracking-wider text-text-brown/50 hover:text-primary transition-colors">
                        ← Continue Gifting
                      </Link>
                    </div>
                  </div>

                  {/* Reassurance Cards */}
                  <div className="p-4 bg-white border border-secondary-sand/30 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3 text-left">
                      <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-bold font-playfair text-text-brown">Secure Payment Assured</p>
                        <p className="text-[10px] text-text-brown/50 font-inter">Locked via SSL 256-bit encryption. Supports Razorpay, UPI, & Netbanking.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-left pt-3 border-t border-secondary-sand/15">
                      <Truck className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-bold font-playfair text-text-brown">Guaranteed Fresh Prep</p>
                        <p className="text-[10px] text-text-brown/50 font-inter">Prepared fresh at flagships and shipped instantly in insulation boxes.</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            )}
          </AnimatePresence>
        </section>

      </main>

      <Footer />
    </div>
  );
};
