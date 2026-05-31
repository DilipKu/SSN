import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Heading } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, Phone, Mail, Clock, ChevronDown, ChevronUp, Download, RotateCcw, AlertCircle, ShieldCheck, HelpCircle, ArrowRight, Gift } from 'lucide-react';

interface OrderItem {
  name: string;
  weight: string;
  price: number;
  qty: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'confirmed' | 'preparing' | 'packaging' | 'shipping' | 'delivered';
  statusText: string;
  estimatedDelivery: string;
  total: number;
  items: OrderItem[];
  paymentMethod: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    pincode: string;
  };
  isGift: boolean;
  giftDetails?: {
    recipientName: string;
    occasion: string;
    message: string;
    wrapStyle: string;
  };
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-9821-SSN',
    date: 'May 28, 2026',
    status: 'preparing',
    statusText: 'Preparing Fresh',
    estimatedDelivery: 'June 02, 2026',
    total: 1300,
    items: [
      {
        name: 'Royal Motichoor Ladoo Box',
        weight: '500g',
        price: 450,
        qty: 1,
        image: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg'
      },
      {
        name: 'Premium Kaju Katli (Pure Ghee)',
        weight: '500g',
        price: 850,
        qty: 1,
        image: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg'
      }
    ],
    paymentMethod: 'UPI (GPay)',
    shippingAddress: {
      name: 'Aditya Sharma',
      street: 'Block G, Sector 45',
      city: 'Noida, Uttar Pradesh',
      pincode: '201303'
    },
    isGift: true,
    giftDetails: {
      recipientName: 'Karan Sharma',
      occasion: 'Anniversary',
      message: 'Happy 25th Anniversary Mom & Dad! Sending sweet blessings for a lifetime of togetherness.',
      wrapStyle: 'Royal Crimson Velvet Ribbon Wrap'
    }
  },
  {
    id: 'ORD-7612-SSN',
    date: 'May 15, 2026',
    status: 'delivered',
    statusText: 'Delivered',
    estimatedDelivery: 'May 18, 2026',
    total: 2700,
    items: [
      {
        name: 'Royal Roasted Almond Gifting Box',
        weight: '1kg',
        price: 1500,
        qty: 1,
        image: 'https://images.pexels.com/photos/2386158/pexels-photo-2386158.jpeg'
      },
      {
        name: 'Sugar-Free Dates & Kesar Roll',
        weight: '500g',
        price: 1200,
        qty: 1,
        image: 'https://images.pexels.com/photos/37124553/pexels-photo-37124553.jpeg'
      }
    ],
    paymentMethod: 'Credit Card',
    shippingAddress: {
      name: 'Priyanka Chopra',
      street: 'Flat 502, Imperial Towers, Bandra West',
      city: 'Mumbai, Maharashtra',
      pincode: '400050'
    },
    isGift: false
  }
];

const REORDER_RECOMMENDATIONS = [
  {
    id: 're1',
    name: 'Premium Kaju Katli (Pure Desi Ghee)',
    price: 850,
    image: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg',
    tag: 'Best Seller'
  },
  {
    id: 're2',
    name: 'Royal Motichoor Ladoo Box',
    price: 450,
    image: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg',
    tag: 'Legacy Special'
  }
];

export const Orders = () => {
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [expandedOrder, setExpandedOrder] = useState<string | null>('ORD-9821-SSN');
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrder(prev => (prev === id ? null : id));
  };

  const handleDownloadInvoice = (id: string) => {
    setFeedback(`Invoice downloaded successfully for ${id}!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReorder = (id: string) => {
    setFeedback(`All items from ${id} added back to your cart!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const getStatusStepIndex = (status: Order['status']) => {
    const steps = ['confirmed', 'preparing', 'packaging', 'shipping', 'delivered'];
    return steps.indexOf(status);
  };

  const trackingSteps = [
    { label: 'Order Confirmed', desc: 'Secure payment cleared' },
    { label: 'Sweets Preparation', desc: 'Batch slow-cooked fresh' },
    { label: 'Premium Packaging', desc: 'Vacuum sealed & velvet wrapped' },
    { label: 'Out for Delivery', desc: 'Dispatched via express partner' },
    { label: 'Delivered', desc: 'Freshness brought to destination' }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: 'easeOut' as const }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary-cream">
      <Navbar />

      <main className="flex-grow pb-24">
        {/* Section 1: Page Header */}
        <section className="relative py-20 overflow-hidden bg-white/40 border-b border-secondary-sand/30">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-primary-gold)_0%,_transparent_65%)]"></div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10 text-center space-y-4 max-w-2xl">
            <span className="text-primary font-bold text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-gold" /> Gifting Log
            </span>
            <Heading level={1} className="text-3xl md:text-5xl font-bold text-text-brown">My Order History</Heading>
            <p className="text-text-brown/70 font-inter font-light text-sm md:text-base">
              Track your sweet deliveries, review recipe details, and download digital shagun invoices.
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

        {/* Section 2: Order Cards */}
        <section className="py-12 container mx-auto px-4 md:px-8 max-w-4xl text-left">
          <AnimatePresence mode="wait">
            {orders.length === 0 ? (
              
              /* Empty state */
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-secondary-sand/35 shadow-xl max-w-xl mx-auto space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-primary/5 mx-auto flex items-center justify-center text-primary-gold">
                  <ShoppingBag className="w-10 h-10 opacity-40" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-playfair font-bold text-2xl text-text-brown">Your Sweet Journey Begins Here</h4>
                  <p className="text-sm text-text-brown/65 font-inter max-w-sm mx-auto leading-relaxed">
                    You haven't ordered any confections yet. Explore our handcrafted collections to sweeten your next family celebration.
                  </p>
                </div>
                <div className="pt-2">
                  <Link to="/category/all">
                    <Button className="bg-primary hover:bg-primary/95 text-secondary-cream border-none h-12 px-8 flex items-center gap-2 mx-auto font-bold shadow-lg">
                      Explore Collections <ArrowRight className="w-4 h-4 text-primary-gold" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

            ) : (

              /* Orders list */
              <div className="space-y-8">
                {orders.map((order) => {
                  const activeStepIndex = getStatusStepIndex(order.status);
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <motion.div
                      key={order.id}
                      {...fadeInUp}
                      className="bg-white rounded-2xl border border-secondary-sand/40 shadow-md overflow-hidden hover:shadow-lg transition-all"
                    >
                      {/* Card Header Summary */}
                      <div 
                        onClick={() => toggleExpand(order.id)}
                        className="p-6 bg-secondary-cream/30 border-b border-secondary-sand/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-secondary-cream/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="text-[10px] text-text-brown/50 font-bold uppercase tracking-wider">Order ID</p>
                          <p className="font-mono font-bold text-sm text-primary">{order.id}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-text-brown/50 font-bold uppercase tracking-wider">Order Date</p>
                          <p className="text-xs font-inter text-text-brown font-semibold">{order.date}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-text-brown/50 font-bold uppercase tracking-wider">Estimated Delivery</p>
                          <p className="text-xs font-inter text-text-brown font-semibold">{order.estimatedDelivery}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-text-brown/50 font-bold uppercase tracking-wider">Total amount</p>
                          <p className="text-sm font-bold text-text-brown font-playfair">₹{order.total}</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'delivered' 
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                              : 'bg-primary/5 border border-primary-gold/30 text-primary'
                          }`}>
                            {order.statusText}
                          </span>
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-text-brown/50" /> : <ChevronDown className="w-5 h-5 text-text-brown/50" />}
                        </div>
                      </div>

                      {/* Expandable Body */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 space-y-8 border-t border-secondary-sand/10">
                              
                              {/* Timeline Tracking */}
                              <div className="space-y-6">
                                <h4 className="font-playfair font-bold text-lg text-text-brown border-b border-secondary-sand/20 pb-2">Delivery Progress</h4>
                                
                                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-4">
                                  {/* Progress Line for desktop */}
                                  <div className="absolute left-4 md:left-0 md:right-0 top-6 bottom-0 md:bottom-auto h-full md:h-[2px] bg-secondary-sand/50 -z-10">
                                    <div 
                                      className="bg-primary-gold h-full transition-all duration-500" 
                                      style={{ width: `${(activeStepIndex / 4) * 100}%` }}
                                    ></div>
                                  </div>

                                  {trackingSteps.map((step, sIdx) => {
                                    const isDone = sIdx <= activeStepIndex;
                                    const isActive = sIdx === activeStepIndex;

                                    return (
                                      <div key={sIdx} className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center w-full md:w-1/5 relative z-10">
                                        {/* Node marker */}
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                          isDone 
                                            ? 'bg-primary border-primary-gold text-primary-gold shadow-md' 
                                            : 'bg-white border-secondary-sand text-text-brown/30'
                                        }`}>
                                          {isDone ? (
                                            <span className="text-[10px] font-bold">✓</span>
                                          ) : (
                                            <span className="text-[10px] font-bold">{sIdx + 1}</span>
                                          )}
                                          
                                          {isActive && (
                                            <div className="absolute inset-0 rounded-full border border-primary-gold/50 animate-ping"></div>
                                          )}
                                        </div>
                                        
                                        {/* labels */}
                                        <div className="space-y-0.5">
                                          <p className={`text-xs font-bold font-playfair ${isDone ? 'text-text-brown' : 'text-text-brown/40'}`}>
                                            {step.label}
                                          </p>
                                          <p className="text-[9px] text-text-brown/50 font-inter leading-relaxed max-w-[120px] hidden md:block mx-auto">
                                            {step.desc}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Split columns: Left: Items, Right: Shipping Details */}
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-secondary-sand/20">
                                
                                {/* Items column */}
                                <div className="lg:col-span-7 space-y-4">
                                  <h4 className="font-playfair font-bold text-base text-text-brown">Products Prepared</h4>
                                  
                                  <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="flex gap-4 p-4 bg-secondary-cream/20 border border-secondary-sand/35 rounded-xl">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-secondary-sand/20 bg-white">
                                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow text-left space-y-1">
                                          <h5 className="font-playfair font-bold text-sm text-text-brown">{item.name}</h5>
                                          <div className="flex items-center gap-3 text-[10px] text-text-brown/60 font-inter">
                                            <span>Weight: {item.weight}</span>
                                            <span>Qty: {item.qty}</span>
                                          </div>
                                          <p className="text-xs font-bold text-primary font-inter">₹{item.price}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Shipping address / gift details column */}
                                <div className="lg:col-span-5 space-y-4">
                                  <h4 className="font-playfair font-bold text-base text-text-brown">Delivery Logistics</h4>
                                  
                                  <div className="p-4 bg-secondary-cream/20 border border-secondary-sand/35 rounded-xl text-xs space-y-3 font-inter">
                                    {/* Shipping details */}
                                    <div className="space-y-1">
                                      <p className="font-bold text-text-brown">Shipping Address:</p>
                                      <p className="text-text-brown/70">{order.shippingAddress.name}</p>
                                      <p className="text-text-brown/70">{order.shippingAddress.street}</p>
                                      <p className="text-text-brown/70">{order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                                    </div>
                                    
                                    <div className="space-y-1 pt-2 border-t border-secondary-sand/20">
                                      <p className="font-bold text-text-brown">Payment Status:</p>
                                      <p className="text-text-brown/70">{order.paymentMethod} • Securely Settled</p>
                                    </div>

                                    {/* Gift Box overlay details */}
                                    {order.isGift && order.giftDetails && (
                                      <div className="space-y-2 pt-3 border-t border-primary-gold/25 mt-2 bg-primary-gold/5 p-3 rounded-lg border border-primary-gold/20">
                                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-primary">
                                          <Gift className="w-3.5 h-3.5" /> Gift Package: {order.giftDetails.occasion}
                                        </div>
                                        <p className="text-[10px] text-text-brown/75 font-inter">
                                          <span className="font-bold">Recipient:</span> {order.giftDetails.recipientName}
                                        </p>
                                        <p className="text-[10px] italic text-primary/95 leading-relaxed font-serif bg-white/60 p-2 rounded">
                                          "{order.giftDetails.message}"
                                        </p>
                                        <p className="text-[9px] text-text-brown/50 font-inter font-bold">
                                          Wrap Style: {order.giftDetails.wrapStyle}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                              </div>

                              {/* Card Actions Panel */}
                              <div className="flex flex-wrap gap-3 pt-6 border-t border-secondary-sand/20 justify-end">
                                <Button 
                                  onClick={() => handleDownloadInvoice(order.id)}
                                  variant="outline" 
                                  size="sm" 
                                  className="border-secondary-sand text-text-brown flex items-center gap-1.5"
                                >
                                  <Download className="w-4 h-4 text-primary-gold" /> Download Invoice
                                </Button>
                                <Button 
                                  onClick={() => handleReorder(order.id)}
                                  variant="outline" 
                                  size="sm" 
                                  className="border-secondary-sand text-text-brown flex items-center gap-1.5"
                                >
                                  <RotateCcw className="w-4 h-4 text-primary-gold" /> Reorder Sweets
                                </Button>
                                <a href="https://wa.me/919876543211" target="_blank" rel="noopener noreferrer">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-secondary-sand text-text-brown flex items-center gap-1.5"
                                  >
                                    <HelpCircle className="w-4 h-4 text-primary-gold" /> Need Help
                                  </Button>
                                </a>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  );
                })}
              </div>

            )}
          </AnimatePresence>
        </section>

        {/* Section 4: Reorder Recommendations */}
        <section className="py-16 bg-white/40 border-y border-secondary-sand/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
                <RotateCcw className="w-4 h-4 text-primary-gold" /> Quick Repurchase
              </span>
              <Heading level={2} className="text-2xl md:text-4xl font-bold text-text-brown">
                Recreate Your Sweet Moments
              </Heading>
              <p className="text-xs md:text-sm text-text-brown/65 font-inter mt-2">
                Frequently ordered confections from your kitchen history, ready to rolling orders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {REORDER_RECOMMENDATIONS.map((rec) => (
                <div 
                  key={rec.id}
                  className="bg-white rounded-2xl border border-secondary-sand/30 shadow-sm p-4 flex items-center gap-6 hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-secondary-sand/20">
                    <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow space-y-3">
                    <div>
                      <span className="text-[9px] bg-primary/5 border border-primary-gold/20 text-primary uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                        {rec.tag}
                      </span>
                      <h4 className="font-playfair font-bold text-base text-text-brown mt-1.5">{rec.name}</h4>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-playfair font-bold text-base text-primary">₹{rec.price}</span>
                      <Button size="sm" className="bg-primary hover:bg-primary/95 text-secondary-cream border-none font-bold text-xs">
                        Quick Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Delivery Trust Indicators */}
        <section className="py-24 container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-secondary-sand/30 rounded-2xl text-center space-y-4 luxury-card-glow">
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary-gold mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-playfair font-bold text-lg text-text-brown">Fresh Prep Dispatch</h4>
              <p className="text-xs text-text-brown/60 font-inter leading-relaxed">Sweets are cooked only after your order is confirmed, ensuring zero warehouse aging.</p>
            </div>
            <div className="p-8 bg-white border border-secondary-sand/30 rounded-2xl text-center space-y-4 luxury-card-glow">
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary-gold mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-playfair font-bold text-lg text-text-brown">Vacuum Sealed Trays</h4>
              <p className="text-xs text-text-brown/60 font-inter leading-relaxed">Packed in nitrogen-flushed food trays to preserve natural moisture and aroma in transit.</p>
            </div>
            <div className="p-8 bg-white border border-secondary-sand/30 rounded-2xl text-center space-y-4 luxury-card-glow">
              <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary-gold mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-playfair font-bold text-lg text-text-brown">Temperature Control</h4>
              <p className="text-xs text-text-brown/60 font-inter leading-relaxed">Shipped via insulated logistics to keep delicate items cool and prevent chocolate melting.</p>
            </div>
          </div>
        </section>

        {/* Section 6: Support Area */}
        <section className="py-16 bg-[#150B07] text-secondary-cream border-t-2 border-primary-gold/45">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center space-y-8">
            <div className="space-y-3">
              <span className="text-primary-gold font-bold text-xs uppercase tracking-widest block">Concierge Assistance</span>
              <Heading level={2} className="text-2xl md:text-4xl font-bold text-white">Need Help with Delivery?</Heading>
              <p className="text-xs md:text-sm text-secondary-cream/70 max-w-md mx-auto leading-relaxed">
                Our support desk is active from 9:00 AM to 9:00 PM to help resolve address changes or tracking queries.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+919876543210" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary-gold hover:bg-white hover:text-[#150B07] text-[#150B07] border-none font-bold flex items-center justify-center gap-1.5">
                  <Phone className="w-4 h-4" /> Call Gifting Helpline
                </Button>
              </a>
              <a href="https://wa.me/919876543211" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-secondary-cream text-secondary-cream hover:bg-white/10 bg-transparent flex items-center justify-center gap-1.5">
                  <Mail className="w-4 h-4" /> Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};
