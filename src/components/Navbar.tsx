import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, Heart, Menu, X, Phone, MessageCircle, ShieldCheck, LogOut, Package, Settings } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCart } from '@/src/contexts/CartContext';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/src/components/ui/sheet';
import { cn } from '@/src/lib/utils';
import { CATEGORIES } from '@/src/constants';
import { Separator } from '@/src/components/ui/separator';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const isHome = location.pathname === '/';


  const isScrolledRef = useRef(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 50;
    if (shouldBeScrolled !== isScrolledRef.current) {
      isScrolledRef.current = shouldBeScrolled;
      setIsScrolled(shouldBeScrolled);
    }
  });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        isScrolled
          ? 'bg-white/95 shadow-sm border-b border-primary/5'
          : isHome
            ? 'bg-transparent'
            : 'bg-white border-b border-primary/5'
      )} />
      <div className={cn(
        "global-container relative flex items-center justify-between inner-spacing-md py-3",
        // PERF FIX: Removed translate-y transition — was re-triggering layout on
        // the fixed navbar container every time scroll threshold crossed 50px.
        // Using opacity transition on the background div instead (compositor-only).
      )}>
        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn(
                "hover:bg-primary/5 transition-colors duration-300",
                isScrolled || !isHome ? "text-primary" : "text-white"
              )}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white p-0">
              <div className="h-full flex flex-col">
                <div className="p-8 border-b border-muted flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-serif text-2xl font-bold tracking-[0.25em] uppercase text-primary leading-none">Kirdaar</span>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-secondary font-semibold mt-0.5">Celebrations</span>
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto p-8 space-y-6">
                  {CATEGORIES.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase().replace(/ /g, '-').replace('&', 'and')}`}
                      className="block text-xl font-serif hover:text-secondary transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                  <Separator className="my-4 opacity-50" />
                  <Link to="/about" className="block text-xl font-serif hover:text-secondary transition-colors">Our Story</Link>
                  <Link to="/contact" className="block text-xl font-serif hover:text-secondary transition-colors">Contact Us</Link>
                </div>
                <div className="p-8 bg-beige/10 space-y-4">
                  {!user ? (
                    <Link to="/auth" className="block">
                      <Button className="w-full bg-primary rounded-none h-12 text-[10px] uppercase tracking-widest font-bold">Login / Register</Button>
                    </Link>
                  ) : (
                    <>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block">
                          <Button variant="outline" className="w-full border-primary text-primary rounded-none h-12 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold">
                            <ShieldCheck className="h-4 w-4" /> Admin Panel
                          </Button>
                        </Link>
                      )}
                      <Button
                        onClick={() => signOut()}
                        variant="ghost"
                        className="w-full text-red-600 h-12 text-[10px] uppercase tracking-widest font-bold hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                      </Button>
                    </>
                  )}
                  <p className="text-[10px] text-center uppercase tracking-widest text-muted-foreground">Premium Wedding Ethnic Destination</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Brand Heading - Left Aligned */}
        <Link to="/" className="flex flex-col items-start group shrink-0 no-underline">
          <span
            className={cn(
              "font-serif text-xl md:text-2xl font-bold tracking-[0.25em] uppercase leading-none transition-colors duration-300",
              isScrolled || !isHome ? "text-primary" : "text-white"
            )}
          >
            Kirdaar
          </span>
          <span
            className={cn(
              "text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-semibold mt-0.5 transition-colors duration-300",
              isScrolled || !isHome ? "text-secondary" : "text-white/80"
            )}
          >
            Celebrations
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex items-center justify-center flex-grow gap-8">
          {CATEGORIES.map((category) => (
            // PERF FIX: Replaced motion.div whileHover with pure CSS :hover.
            // motion.div spring physics on hover fired a JS animation loop.
            // CSS hover transform runs on compositor thread, zero JS cost.
            <div
              key={category}
              className="hover:scale-[1.12] hover:-translate-y-0.5"
              style={{ transition: 'transform 150ms ease' }}
            >
              <Link
                to={`/category/${category.toLowerCase().replace(/ /g, '-').replace('&', 'and')}`}
                className={cn(
                  "text-[13px] font-bold uppercase tracking-[0.1em] relative group whitespace-nowrap",
                  isScrolled || !isHome ? "text-primary" : "text-white"
                )}
                style={{ transition: 'color 200ms ease' }}
              >
                {category}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary group-hover:w-full" style={{ transition: 'width 200ms ease' }} />
              </Link>
            </div>
          ))}
          <div className={cn("h-4 w-[1px] mx-2", isScrolled || !isHome ? "bg-primary/20" : "bg-white/20")} />
          <div
            className="hover:scale-[1.12] hover:-translate-y-0.5"
            style={{ transition: 'transform 150ms ease' }}
          >
            <Link
              to="/about"
              className={cn(
                "text-[13px] font-bold uppercase tracking-[0.1em] relative group",
                isScrolled || !isHome ? "text-primary" : "text-white"
              )}
              style={{ transition: 'color 200ms ease' }}
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary group-hover:w-full" style={{ transition: 'width 200ms ease' }} />
            </Link>
          </div>
          <div
            className="hover:scale-[1.12] hover:-translate-y-0.5"
            style={{ transition: 'transform 150ms ease' }}
          >
            <Link
              to="/contact"
              className={cn(
                "text-[13px] font-bold uppercase tracking-[0.1em] relative group",
                isScrolled || !isHome ? "text-primary" : "text-white"
              )}
              style={{ transition: 'color 200ms ease' }}
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary group-hover:w-full" style={{ transition: 'width 200ms ease' }} />
            </Link>
          </div>
        </div>

        {/* Icons - Right Aligned */}
        <div className="flex items-center gap-1 md:gap-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={cn(
              "hover:bg-primary/5",
              isScrolled || !isHome ? "text-primary" : "text-white"
            )}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Link to="/dashboard/wishlist">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hover:bg-primary/5 hidden sm:flex",
                isScrolled || !isHome ? "text-primary" : "text-white"
              )}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          {/* Dynamic User Profile Menu */}
          <div className="relative group/menu">
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "hover:bg-primary/5",
                  isScrolled || !isHome ? "text-primary" : "text-white"
                )}
              >
                <User className="h-5 w-5" />
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "hover:bg-primary/5",
                    isScrolled || !isHome ? "text-primary" : "text-white"
                  )}
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Premium Dropdown Menu */}
            {user && isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm border border-primary/10 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-primary/5 bg-primary/5">
                    <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Logged in as</p>
                    <p className="text-sm font-serif text-primary truncate">{user.email}</p>
                    {user.role === 'admin' && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-primary text-white text-[8px] uppercase tracking-widest font-bold">
                        Administrator
                      </span>
                    )}
                  </div>

                  <div className="p-2">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                      >
                        <ShieldCheck className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    )}

                    {user.role !== 'admin' && (
                      <>
                        <Link
                          to="/dashboard/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                        >
                          <Package className="h-4 w-4" /> My Orders
                        </Link>

                        <Link
                          to="/dashboard/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                        >
                          <Settings className="h-4 w-4" /> Profile Settings
                        </Link>
                      </>
                    )}

                    <Separator className="my-2 opacity-10" />

                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hover:bg-primary/5 relative",
                isScrolled || !isHome ? "text-primary" : "text-white"
              )}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-secondary text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar Overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white p-8 shadow-2xl animate-in slide-in-from-top duration-500 border-b border-primary/10">
          <div className="max-w-4xl mx-auto relative">
            <Input
              placeholder="Search for your royal Kirdaar..."
              className="w-full h-16 bg-beige/10 border-none text-xl font-serif px-12 focus-visible:ring-primary/20"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40 cursor-pointer"
              onClick={() => handleSearchSubmit()}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}