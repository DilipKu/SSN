import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Menu, X, ChevronDown, Gift, Award, Sparkles, Home, Plus, Minus, Trash2, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import logo from '../../assets/ssn_logo.jpeg';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_CATEGORIES } from '../../data';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'sweets' | 'namkeen' | 'gifting' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 'c1',
      name: 'Royal Motichoor Ladoo Box',
      weight: '500g',
      price: 450,
      qty: 1,
      image: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg'
    },
    {
      id: 'c2',
      name: 'Premium Kaju Katli (Pure Ghee)',
      weight: '500g',
      price: 850,
      qty: 1,
      image: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg'
    }
  ]);

  const totalCartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const categories = NAV_CATEGORIES;

  return (
    <div className="w-full z-50 sticky top-0">
      {/* Festive Announcement Bar */}
      <div className="bg-primary text-secondary-cream py-2 overflow-hidden text-xs font-inter font-medium tracking-widest border-b border-primary-gold/30">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex gap-16 items-center px-4">
            <span>✨ DIWALI SELECTIONS ARE NOW LIVE — CHOOSE FROM EXQUISITE ROYAL BOXES ✨</span>
            <span>👑 100% PURE DESI GHEE SWEETS HANDCRAFTED FRESH EVERY DAY 👑</span>
            <span>🚚 FREE PREMIUM PAN-INDIA EXPRESS SHIPPING ON ORDERS ABOVE ₹999 🚚</span>
            <span>🎁 CONTACT US FOR CUSTOM CORPORATE GIFTING PACKAGES 🎁</span>
          </div>
          <div className="flex gap-16 items-center px-4" aria-hidden="true">
            <span>✨ DIWALI SELECTIONS ARE NOW LIVE — CHOOSE FROM EXQUISITE ROYAL BOXES ✨</span>
            <span>👑 100% PURE DESI GHEE SWEETS HANDCRAFTED FRESH EVERY DAY 👑</span>
            <span>🚚 FREE PREMIUM PAN-INDIA EXPRESS SHIPPING ON ORDERS ABOVE ₹999 🚚</span>
            <span>🎁 CONTACT US FOR CUSTOM CORPORATE GIFTING PACKAGES 🎁</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full bg-secondary-cream/90 backdrop-blur-md border-b border-secondary-sand/30 shadow-sm relative z-40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex h-20 items-center justify-between">
            
            {/* Mobile Burger Menu Button */}
            <div className="flex items-center gap-4 lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center lg:justify-start">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="SSN Sudarshan Sweets" className="h-20 md:h-24 w-auto object-contain rounded-md mix-blend-multiply" />
              </Link>
            </div>

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex flex-1 justify-center space-x-6">
              <div 
                className="relative py-7"
                onMouseEnter={() => setActiveMegaMenu('sweets')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-text-brown hover:text-primary transition-colors cursor-pointer">
                  Premium Sweets <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div 
                className="relative py-7"
                onMouseEnter={() => setActiveMegaMenu('namkeen')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-text-brown hover:text-primary transition-colors cursor-pointer">
                  Savory Namkeen <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div 
                className="relative py-7"
                onMouseEnter={() => setActiveMegaMenu('gifting')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-accent-saffron hover:text-primary transition-colors cursor-pointer">
                  Festive Gifting <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <Link to="/about" className="text-sm font-medium text-text-brown hover:text-primary transition-colors py-7">
                About Us
              </Link>
              <Link to="/contact" className="text-sm font-medium text-text-brown hover:text-primary transition-colors py-7">
                Contact Us
              </Link>
            </nav>

            {/* Right Side Shopping & Profile actions */}
            <div className="flex items-center gap-1 md:gap-3 flex-1 justify-end">
              <div className="hidden lg:flex items-center bg-white rounded-full px-3 py-1.5 border border-secondary-sand/50 shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                <Search className="h-4 w-4 text-text-brown/50" />
                <input 
                  type="text" 
                  placeholder="Search premium sweets..." 
                  className="bg-transparent border-none outline-none text-sm px-2 w-44 text-text-brown placeholder:text-text-brown/40 font-inter"
                />
              </div>
              
              <Link to="/wishlist" className="hidden md:inline-flex">
                <Button variant="ghost" size="icon" className="relative group">
                  <Heart className="h-5 w-5 text-text-brown group-hover:text-primary transition-colors" />
                </Button>
              </Link>
              
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="relative group">
                  <User className="h-5 w-5 text-text-brown group-hover:text-primary transition-colors" />
                </Button>
              </Link>

              <Button 
                onClick={() => setIsCartDrawerOpen(true)}
                variant="primary" 
                size="icon" 
                className="relative rounded-full h-10 w-10 shadow-md bg-primary hover:bg-primary-gold hover:text-primary text-secondary-cream border-none transition-all duration-300"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-saffron text-[9px] font-bold text-white shadow-sm animate-pulse">
                  {totalCartItemsCount}
                </span>
              </Button>
            </div>
            
          </div>
        </div>

        {/* Mega Menu Dropdown panels for desktop */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 w-full bg-white border-b border-secondary-sand/40 shadow-xl z-50 hidden lg:block"
              onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <div className="container mx-auto px-8 py-8 grid grid-cols-4 gap-6">
                <div className="col-span-1 pr-6 border-r border-secondary-sand/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-playfair font-bold text-lg mb-3">
                      {activeMegaMenu === 'sweets' && <Sparkles className="w-5 h-5 text-primary-gold" />}
                      {activeMegaMenu === 'namkeen' && <Award className="w-5 h-5 text-primary-gold" />}
                      {activeMegaMenu === 'gifting' && <Gift className="w-5 h-5 text-primary-gold" />}
                      <span className="capitalize">{activeMegaMenu} Collection</span>
                    </div>
                    <p className="text-sm text-text-brown/70 font-inter leading-relaxed">
                      {activeMegaMenu === 'sweets' && 'Indulge in our exquisite range of traditional sweets, handmade with single-source pure desi ghee and handpicked nuts.'}
                      {activeMegaMenu === 'namkeen' && 'Savor the crispiness of premium hand-mixed snacks and spices made from classic age-old family recipes.'}
                      {activeMegaMenu === 'gifting' && 'Present your loved ones and clients with our royal velvet and brass gifting sets designed for pure joy.'}
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link to={`/category/${activeMegaMenu === 'gifting' ? 'festive' : activeMegaMenu}`} onClick={() => setActiveMegaMenu(null)}>
                      <Button variant="link" className="p-0 font-playfair text-primary font-bold flex items-center gap-1 group">
                        Explore Full Range <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="col-span-3 grid grid-cols-3 gap-6">
                  {categories[activeMegaMenu].map((cat, index) => (
                    <Link 
                      key={index} 
                      to={cat.path} 
                      onClick={() => setActiveMegaMenu(null)}
                      className="group flex gap-4 p-3 rounded-xl hover:bg-secondary-cream/50 transition-colors"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-secondary-sand/30">
                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-playfair font-bold text-text-brown group-hover:text-primary transition-colors">
                          {cat.name}
                        </h4>
                        <p className="text-xs text-text-brown/60 font-inter mt-1 leading-snug">
                          {cat.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Search Bar Expansion */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full bg-white border-b border-secondary-sand/30 px-4 py-3 lg:hidden"
            >
              <div className="flex items-center bg-secondary-cream rounded-full px-3 py-2 border border-secondary-sand/50">
                <Search className="h-4 w-4 text-text-brown/50" />
                <input 
                  type="text" 
                  placeholder="Search premium sweets & namkeen..." 
                  className="bg-transparent border-none outline-none text-sm px-2 w-full text-text-brown placeholder:text-text-brown/40 font-inter"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Sidebar Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-30 lg:hidden"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-secondary-cream shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src={logo} alt="SSN Logo" className="h-16 md:h-20 w-auto mix-blend-multiply" />
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-playfair font-bold text-lg text-primary border-b border-secondary-sand pb-1">Premium Sweets</h3>
                    <ul className="space-y-2 font-inter text-sm pl-2">
                      <li><Link to="/category/kaju-collection" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-text-brown/80 hover:text-primary">Kaju Collection</Link></li>
                      <li><Link to="/category/laddu-collection" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-text-brown/80 hover:text-primary">Laddu Collection</Link></li>
                      <li><Link to="/category/bengali-sweets" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-text-brown/80 hover:text-primary">Bengali Sweets</Link></li>
                      <li><Link to="/category/sugar-free" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-text-brown/80 hover:text-primary">Sugar Free Delights</Link></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-playfair font-bold text-lg text-primary border-b border-secondary-sand pb-1">Savory Namkeen</h3>
                    <ul className="space-y-2 font-inter text-sm pl-2">
                      <li><Link to="/category/namkeen" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-text-brown/80 hover:text-primary">Traditional Mixtures</Link></li>
                      <li><Link to="/category/namkeen" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-text-brown/80 hover:text-primary">Crunchy Savories</Link></li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-playfair font-bold text-lg text-accent-saffron border-b border-secondary-sand pb-1">Gifting & Hampers</h3>
                    <ul className="space-y-2 font-inter text-sm pl-2">
                      <li><Link to="/category/festive" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-text-brown/80 hover:text-primary">Festival Hampers</Link></li>
                      <li><Link to="/category/festive" onClick={() => setIsMobileMenuOpen(false)} className="block py-1 text-text-brown/80 hover:text-primary">Corporate Bulk Orders</Link></li>
                    </ul>
                  </div>

                  <div className="pt-4 flex flex-col gap-4">
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-playfair font-bold text-lg text-text-brown hover:text-primary block">
                      About Us
                    </Link>
                    <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="font-playfair font-bold text-lg text-text-brown hover:text-primary block">
                      My Orders
                    </Link>
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="font-playfair font-bold text-lg text-text-brown hover:text-primary block">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-secondary-sand/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold font-playfair text-text-brown">SSN Heritage Brand</p>
                    <p className="text-[10px] text-text-brown/50 font-inter">Pure Desi Ghee Since 1995</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-secondary-cream/95 backdrop-blur-md border-t border-secondary-sand/35 z-40 flex items-center justify-around lg:hidden shadow-lg">
        <Link to="/" className="flex flex-col items-center justify-center text-text-brown hover:text-primary transition-colors">
          <Home className="w-5 h-5 text-current" />
          <span className="text-[9px] font-semibold mt-0.5">Home</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="flex flex-col items-center justify-center text-text-brown hover:text-primary transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5 text-current" />
          <span className="text-[9px] font-semibold mt-0.5">Shop</span>
        </button>
        <Link to="/category/festive" className="flex flex-col items-center justify-center text-text-brown hover:text-primary transition-colors">
          <Gift className="w-5 h-5 text-current" />
          <span className="text-[9px] font-semibold mt-0.5">Gifting</span>
        </Link>
        <button 
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex flex-col items-center justify-center text-text-brown hover:text-primary transition-colors relative cursor-pointer bg-transparent border-none outline-none"
        >
          <ShoppingBag className="w-5 h-5 text-current" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-saffron text-[9px] font-bold text-white shadow-sm">
            {totalCartItemsCount}
          </span>
          <span className="text-[9px] font-semibold mt-0.5">Cart</span>
        </button>
      </div>

      {/* Mini Cart Drawer */}
      <AnimatePresence>
        {isCartDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartDrawerOpen(false)}
              className="fixed inset-0 bg-black z-[100]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-secondary-cream shadow-2xl z-[101] p-6 flex flex-col justify-between overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-secondary-sand/30 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h3 className="font-playfair font-bold text-xl text-text-brown">Your Hampers ({totalCartItemsCount})</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsCartDrawerOpen(false)} className="hover:bg-primary/5 rounded-full">
                  <X className="h-5 w-5 text-text-brown" />
                </Button>
              </div>

              {/* Free Shipping Progress bar */}
              <div className="bg-white border border-secondary-sand/25 p-3 rounded-xl mt-4">
                <p className="text-[11px] font-inter text-text-brown/75 text-center">
                  {cartSubtotal >= 999 ? (
                    <span className="text-emerald-700 font-bold">✨ Congratulations! You've unlocked Free Express Delivery!</span>
                  ) : (
                    <>
                      You are only <span className="font-bold text-primary">₹{999 - cartSubtotal}</span> away from <span className="font-bold">Free Express Delivery</span>
                    </>
                  )}
                </p>
                <div className="w-full bg-secondary-cream h-1.5 rounded-full mt-2 overflow-hidden border border-secondary-sand/10">
                  <div 
                    className="bg-primary-gold h-full transition-all duration-300"
                    style={{ width: `${Math.min((cartSubtotal / 999) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-grow overflow-y-auto my-6 space-y-4 pr-1">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/5 mx-auto flex items-center justify-center text-primary-gold">
                      <ShoppingBag className="w-8 h-8 opacity-45" />
                    </div>
                    <p className="font-playfair text-text-brown font-bold text-lg">Your hamper is empty</p>
                    <p className="text-xs text-text-brown/65 max-w-[250px] mx-auto leading-relaxed">
                      Add handcrafted Indian sweets and festival boxes to start your celebrations.
                    </p>
                    <Button 
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="bg-primary hover:bg-primary/95 text-secondary-cream border-none text-xs font-bold px-6 h-9 rounded-full mt-2"
                    >
                      Shop Now
                    </Button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-white border border-secondary-sand/25 rounded-xl hover:shadow-sm transition-all relative group">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-secondary-sand/20">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-grow text-left space-y-1.5">
                        <h4 className="font-playfair font-bold text-xs text-text-brown leading-snug pr-6">{item.name}</h4>
                        <p className="text-[10px] text-text-brown/50 font-inter">Weight: {item.weight}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-secondary-sand/40 rounded-full bg-secondary-cream/30 overflow-hidden">
                            <button 
                              onClick={() => {
                                setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: Math.max(i.qty - 1, 1) } : i));
                              }}
                              className="px-2 py-1 text-text-brown hover:bg-secondary-sand/20 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-text-brown">{item.qty}</span>
                            <button 
                              onClick={() => {
                                setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
                              }}
                              className="px-2 py-1 text-text-brown hover:bg-secondary-sand/20 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          {/* Price */}
                          <span className="font-playfair font-bold text-sm text-primary">₹{item.price * item.qty}</span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => {
                          setCartItems(prev => prev.filter(i => i.id !== item.id));
                        }}
                        className="absolute top-3 right-3 text-text-brown/40 hover:text-primary transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer Summary */}
              {cartItems.length > 0 && (
                <div className="border-t border-secondary-sand/30 pt-4 space-y-4 bg-secondary-cream">
                  <div className="flex justify-between items-center font-playfair font-bold text-text-brown text-base">
                    <span>Subtotal:</span>
                    <span className="text-primary text-lg">₹{cartSubtotal}</span>
                  </div>
                  <p className="text-[10px] text-text-brown/50 font-inter text-left">Taxes, shipping charges, and coupons calculated at checkout.</p>
                  
                  <div className="flex flex-col gap-2">
                    <Link to="/cart" onClick={() => setIsCartDrawerOpen(false)} className="w-full">
                      <Button className="w-full bg-transparent hover:bg-primary/5 text-primary border border-primary h-11 font-bold font-playfair text-xs tracking-wider rounded-full">
                        View & Edit Cart
                      </Button>
                    </Link>
                    <Link to="/cart" onClick={() => setIsCartDrawerOpen(false)} className="w-full">
                      <Button className="w-full bg-primary hover:bg-primary/95 text-secondary-cream border-none h-11 font-bold font-playfair text-xs tracking-wider rounded-full flex items-center justify-center gap-1.5 shadow-md">
                        <Lock className="w-3.5 h-3.5 text-primary-gold" /> Proceed to Secure Checkout
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

