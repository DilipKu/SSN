import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Menu, X, ChevronDown, Gift, Award, Sparkles, Home } from 'lucide-react';
import { Button } from '../ui/Button';
import logo from '../../assets/ssn_logo.jpeg';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'sweets' | 'namkeen' | 'gifting' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const categories = {
    sweets: [
      { name: 'Kaju Collection', path: '/category/kaju-collection', desc: 'Creamy premium cashew delicacies', img: 'https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg' },
      { name: 'Laddu Collection', path: '/category/laddu-collection', desc: 'Golden spheres of pure desi ghee', img: 'https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg' },
      { name: 'Bengali Sweets', path: '/category/bengali-sweets', desc: 'Soft rasgullas and syrupy sandesh', img: 'https://images.pexels.com/photos/15014918/pexels-photo-15014918.jpeg' },
      { name: 'Sugar Free', path: '/category/sugar-free', desc: 'Guilt-free traditional delights', img: 'https://images.pexels.com/photos/37124553/pexels-photo-37124553.jpeg' },
    ],
    namkeen: [
      { name: 'Premium Mixtures', path: '/category/namkeen', desc: 'Spicy and crunchy mixtures', img: 'https://images.pexels.com/photos/31617910/pexels-photo-31617910.jpeg' },
      { name: 'Traditional Savories', path: '/category/namkeen', desc: 'Bhujia, sev, and classic snacks', img: 'https://images.pexels.com/photos/31617910/pexels-photo-31617910.jpeg' },
    ],
    gifting: [
      { name: 'Festival Hampers', path: '/category/festive', desc: 'Curated royal gift hampers', img: 'https://images.pexels.com/photos/20699855/pexels-photo-20699855.jpeg' },
      { name: 'Corporate Gifting', path: '/category/festive', desc: 'Premium customized B2B sets', img: 'https://images.pexels.com/photos/36235852/pexels-photo-36235852.jpeg' },
    ]
  };

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
              <Link to="/" className="flex items-center gap-3">
                <img src={logo} alt="SSN Sudarshan Sweets" className="h-14 w-auto object-contain rounded-md mix-blend-multiply" />
                <div className="hidden xl:flex flex-col text-left">
                  <span className="font-playfair text-base font-bold tracking-widest text-primary uppercase leading-none">
                    Sudarshan
                  </span>
                  <span className="font-inter text-[9px] font-semibold tracking-[0.25em] text-text-brown/70 uppercase mt-0.5">
                    Sweets & Namkeen
                  </span>
                </div>
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
              
              <Button variant="ghost" size="icon" className="hidden md:inline-flex relative group">
                <Heart className="h-5 w-5 text-text-brown group-hover:text-primary transition-colors" />
              </Button>
              
              <Button variant="ghost" size="icon" className="relative group">
                <User className="h-5 w-5 text-text-brown group-hover:text-primary transition-colors" />
              </Button>

              <Button variant="primary" size="icon" className="relative rounded-full h-10 w-10 shadow-md bg-primary hover:bg-primary-gold hover:text-primary text-secondary-cream border-none transition-all duration-300">
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-saffron text-[9px] font-bold text-white shadow-sm animate-pulse">
                  0
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
                    <img src={logo} alt="SSN Logo" className="h-12 w-auto mix-blend-multiply" />
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
        <Link to="#" className="flex flex-col items-center justify-center text-text-brown hover:text-primary transition-colors relative">
          <ShoppingBag className="w-5 h-5 text-current" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-saffron text-[9px] font-bold text-white shadow-sm">
            0
          </span>
          <span className="text-[9px] font-semibold mt-0.5">Cart</span>
        </Link>
      </div>
    </div>
  );
};

