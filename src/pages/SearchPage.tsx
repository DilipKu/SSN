import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductService } from '@/src/services/ProductService';
import { Product } from '@/src/types';
import ProductCard from '@/src/components/luxury/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { 
  Search, 
  ChevronDown, 
  X, 
  LayoutGrid,
  StretchHorizontal,
  Loader2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const sortOptions = [
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Top Rated', value: 'rating' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await ProductService.getProducts({
          search: query
        });
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query]);

  const filteredProducts = useMemo(() => {
    // Apply Sorting
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0; // Maintain API order (newest)
      }
    });
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20 pb-24">
      {/* Search Header */}
      <section className="bg-gradient-to-b from-[#F8F5F0] to-[#F3EDE6] border-b border-[#E8E1D5] shadow-sm relative z-10 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="global-container py-8 md:py-10 space-y-3"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-2">
              <nav className="flex text-[10px] uppercase tracking-[0.3em] font-bold text-secondary/60">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-primary">Search</span>
              </nav>
              
              <div className="relative inline-block">
                <h1 className="text-4xl md:text-5xl font-serif text-primary leading-tight flex items-center gap-4">
                  <Search className="h-8 w-8 text-secondary" />
                  {query ? `Results for "${query}"` : 'Search Our Collection'}
                </h1>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute -bottom-3 left-0 h-[2px] bg-[#C5A47E]" 
                />
              </div>
              
              <p className="text-sm md:text-base text-muted-foreground/80 font-light italic">
                {loading ? 'Searching...' : `Found ${filteredProducts.length} masterpieces matching your search.`}
              </p>
            </div>

            {/* Inline Controls */}
            <div className="flex items-center gap-6 text-primary">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-all ${viewMode === 'grid' ? 'text-secondary' : 'text-muted-foreground hover:text-primary'}`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-all ${viewMode === 'list' ? 'text-secondary' : 'text-muted-foreground hover:text-primary'}`}
                >
                  <StretchHorizontal className="h-5 w-5" />
                </button>
              </div>
              
              <div className="h-4 w-[1px] bg-muted-foreground/30" />
              
              <div className="relative group">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold group-hover:text-secondary transition-colors">
                    {sortOptions.find(o => o.value === sortBy)?.label || 'Sort By'}
                  </span>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-secondary transition-transform duration-300", isSortOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-48 bg-white border border-[#E8E1D5] shadow-xl z-50 overflow-hidden"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setIsSortOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-5 py-3 text-[10px] uppercase tracking-widest transition-colors",
                              sortBy === option.value 
                                ? "bg-[#F8F5F0] text-secondary font-bold" 
                                : "text-primary hover:bg-[#F8F5F0] hover:text-secondary"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="global-container py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-secondary" />
            <p className="text-sm font-serif italic text-muted-foreground uppercase tracking-widest">Searching for Masterpieces...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-[#E8E1D5] bg-[#F8F5F0]">
            <Search className="h-12 w-12 text-secondary/30 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-primary">No Masterpieces Found</h3>
            <p className="text-sm text-muted-foreground mt-2">Try different keywords to discover our royal collection.</p>
            <Link to="/">
              <Button 
                variant="link" 
                className="mt-4 text-secondary uppercase tracking-widest text-[10px] font-bold"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
