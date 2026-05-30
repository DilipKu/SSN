import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ProductService } from '@/src/services/ProductService';
import { Product } from '@/src/types';
import ProductCard from '@/src/components/luxury/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import {
  Filter,
  ChevronDown,
  X,
  SlidersHorizontal,
  LayoutGrid,
  StretchHorizontal,
  Loader2
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/src/components/ui/sheet';
import { Separator } from '@/src/components/ui/separator';
import { Badge } from '@/src/components/ui/badge';
import { cn } from '@/src/lib/utils';

export default function CategoryPage() {
  const { id } = useParams();
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

  // Filters state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [availableOccasions, setAvailableOccasions] = useState<string[]>([]);

  const [searchParams] = useSearchParams();

  const categoryName = id ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ') : 'Collections';

  // Check if the ID is an occasion or category
  const isOccasionPage = availableOccasions.some(occasion => occasion.toLowerCase() === id?.toLowerCase());

  // Initialize filters from URL search params
  useEffect(() => {
    const urlOccasions = searchParams.get('occasions');
    if (urlOccasions) {
      setSelectedOccasions(urlOccasions.split(',').filter(Boolean));
    }
  }, [searchParams]);

  // Fetch available occasions from API
  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const occasions = await ProductService.getOccasions();
        setAvailableOccasions(occasions.map(o => o.name));
      } catch (err) {
        console.error('Error fetching occasions:', err);
      }
    };
    fetchOccasions();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data;

        if (isOccasionPage) {
          // If it's an occasion page, pre-select that occasion and fetch all products
          setSelectedOccasions([categoryName]);
          data = await ProductService.getProducts({
            priceRange: priceRange
          });
        } else {
          // If it's a category page, fetch by category
          data = await ProductService.getProducts({
            category: id,
            priceRange: priceRange
          });
        }

        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id, priceRange, isOccasionPage, categoryName]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesOccasion = selectedOccasions.length === 0 || product.occasion.some(o => selectedOccasions.includes(o));
      const matchesFabric = selectedFabrics.length === 0 || selectedFabrics.includes(product.fabric);

      // Only check occasions, not roles
      return matchesOccasion && matchesFabric;
    });

    // Apply Sorting
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0; // Maintain API order (newest)
      }
    });
  }, [products, selectedOccasions, selectedFabrics, sortBy]);

  const toggleOccasion = (o: string) => {
    setSelectedOccasions(prev =>
      prev.includes(o) ? prev.filter(item => item !== o) : [...prev, o]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 500000]);
    setSelectedOccasions([]);
    setSelectedFabrics([]);
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-20 pb-24">
      {/* Premium Luxury Category Header */}
      <section className="bg-gradient-to-b from-[#F8F5F0] to-[#F3EDE6] border-b border-[#E8E1D5] shadow-sm relative z-10 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="global-container py-8 md:py-10 space-y-3"
        >
          {/* Top Row: Navigation & Meta */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-2">
              <nav className="flex text-[10px] uppercase tracking-[0.3em] font-bold text-secondary/60">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-primary">{categoryName}</span>
              </nav>

              <div className="relative inline-block">
                <h1 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
                  {categoryName}
                </h1>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute -bottom-3 left-0 h-[2px] bg-[#C5A47E]"
                />
              </div>

              <p className="text-sm md:text-base text-muted-foreground/80 font-light italic">
                Curated ensembles for your most special moments. Showing {filteredProducts.length} masterpieces.
              </p>
            </div>

            {/* Inline Controls - No Box, Clean Divider */}
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

          {/* Bottom Row: Luxury Filter Chips */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-muted/30 mb-10">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
              {/* Use API occasions for filtering */}
              {availableOccasions.map((filter, i) => (
                <motion.button
                  key={filter}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (i * 0.05) }}
                  onClick={() => toggleOccasion(filter)}
                  className={`px-6 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-full transition-all duration-300 whitespace-nowrap shadow-sm border ${selectedOccasions.includes(filter)
                    ? 'bg-[#C5A47E] border-transparent text-white shadow-md'
                    : 'bg-white border-[#E5D3B3]/40 text-primary hover:bg-[#C5A47E] hover:text-white hover:-translate-y-0.5 hover:shadow-md'
                    }`}
                >
                  {filter}
                </motion.button>
              ))}
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-[12px] uppercase tracking-[0.2em] font-bold text-primary hover:text-secondary group p-0 h-auto">
                  <Filter className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" /> Advanced Refinement
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                <div className="h-full flex flex-col">
                  <SheetHeader className="p-8 border-b bg-[#F8F5F0]">
                    <SheetTitle className="font-serif text-4xl text-primary">Refine Selection</SheetTitle>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest pt-2">Tailor your luxury experience</p>
                  </SheetHeader>

                  <div className="flex-grow overflow-y-auto p-8 space-y-10">
                    <div className="space-y-6">
                      <h4 className="font-bold uppercase tracking-[0.2em] text-sm text-secondary">Price Range</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-widest">Min (₹)</label>
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            className="w-full p-3 border-b border-muted bg-transparent text-sm focus:outline-none focus:border-secondary transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-muted-foreground uppercase tracking-widest">Max (₹)</label>
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="w-full p-3 border-b border-muted bg-transparent text-sm focus:outline-none focus:border-secondary transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="opacity-50" />

                    <div className="space-y-6">
                      <h4 className="font-bold uppercase tracking-[0.2em] text-sm text-secondary">Ceremony Type</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {availableOccasions.map(o => (
                          <button
                            key={o}
                            onClick={() => toggleOccasion(o)}
                            className={`px-3 py-2.5 text-sm border transition-all text-center ${selectedOccasions.includes(o)
                              ? 'bg-primary border-primary text-white'
                              : 'bg-transparent border-muted text-muted-foreground hover:border-primary hover:text-primary'
                              }`}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border-t bg-[#F8F5F0] flex gap-4">
                    <SheetClose asChild>
                      <Button className="flex-grow bg-primary hover:bg-secondary text-white rounded-none h-14 uppercase tracking-widest text-sm font-bold">Show Masterpieces</Button>
                    </SheetClose>
                    <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hover:text-primary uppercase tracking-widest text-sm font-bold h-14">Reset</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>
      </section>

      <div className="global-container py-12">
        {/* Active Filters */}
        <AnimatePresence>
          {(selectedOccasions.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-3 mb-10 overflow-hidden"
            >
              {selectedOccasions.map(o => (
                <Badge key={o} variant="secondary" className="bg-secondary/5 text-secondary border-secondary/10 rounded-full px-4 py-1.5 flex items-center gap-2 hover:bg-secondary/10 transition-colors">
                  {o} <X className="h-3 w-3 cursor-pointer" onClick={() => toggleOccasion(o)} />
                </Badge>
              ))}
              <Button variant="link" onClick={clearFilters} className="text-[10px] uppercase tracking-widest font-bold text-primary h-auto p-0 ml-4 hover:text-secondary">Clear All</Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid with Staggered Animation */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-secondary" />
            <p className="text-sm font-serif italic text-muted-foreground uppercase tracking-widest">Finding Masterpieces...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={`grid gap-8 ${viewMode === 'grid'
            ? 'grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1'
            }`}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-[#E8E1D5] bg-[#F8F5F0]">
            <X className="h-12 w-12 text-secondary/30 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-primary">No Masterpieces Found</h3>
            <p className="text-sm text-muted-foreground mt-2">Adjust your filters to discover other royal ensembles.</p>
            <Button
              variant="link"
              onClick={clearFilters}
              className="mt-4 text-secondary uppercase tracking-widest text-[10px] font-bold"
            >
              Clear All Filters
            </Button>
          </div>
        )}


        {filteredProducts.length === 0 && (
          <div className="py-40 text-center space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-[#F8F5F0] rounded-full flex items-center justify-center mx-auto shadow-inner"
            >
              <SlidersHorizontal className="h-10 w-10 text-secondary/40" />
            </motion.div>
            <div className="space-y-4">
              <h3 className="text-3xl font-serif text-primary">A Moment of Stillness</h3>
              <p className="text-muted-foreground max-w-md mx-auto italic font-light">
                "Not all Kirdaars have revealed themselves yet." Try adjusting your search to find your perfect match.
              </p>
            </div>
            <Button onClick={clearFilters} className="bg-primary hover:bg-secondary text-white px-10 h-14 rounded-none uppercase tracking-widest font-bold shadow-lg">
              View All Masterpieces
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
