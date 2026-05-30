import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Info, 
  Eye, 
  Save, 
  Tag as TagIcon, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { cn, slugify } from '@/src/lib/utils';
import { AdminService } from '@/src/services/AdminService';
import { ProductService } from '@/src/services/ProductService';
import { toast } from 'sonner';

import ProductImageUploader, { ProductImage } from './ProductImageUploader';
import ProductVideoUploader from './ProductVideoUploader';

const COMMON_COLORS = [
  'Red', 'Blue', 'Navy Blue', 'Green', 'Emerald', 'Black', 'White', 
  'Yellow', 'Orange', 'Purple', 'Pink', 'Maroon', 'Teal', 'Cyan', 
  'Gray', 'Brown', 'Gold', 'Silver', 'Beige', 'Cream', 'Peach', 
  'Lavender', 'Olive', 'Magenta', 'Burgundy', 'Mustard', 'Rust', 
  'Mint', 'Coral', 'Turquoise', 'Rose', 'Wine', 'Indigo', 'Charcoal'
];

const getColorHex = (colorName: string) => {
  const colorMap: Record<string, string> = {
    'red': '#ef4444', 'blue': '#3b82f6', 'navy blue': '#1e3a8a', 'green': '#22c55e',
    'emerald': '#10b981', 'black': '#000000', 'white': '#ffffff', 'yellow': '#eab308',
    'orange': '#f97316', 'purple': '#a855f7', 'pink': '#ec4899', 'maroon': '#800000',
    'teal': '#14b8a6', 'cyan': '#06b6d4', 'gray': '#6b7280', 'grey': '#6b7280',
    'brown': '#78350f', 'gold': '#ca8a04', 'silver': '#9ca3af', 'beige': '#f5f5dc',
    'cream': '#fffdd0', 'peach': '#ffdab9', 'lavender': '#e6e6fa', 'olive': '#808000',
    'magenta': '#ff00ff', 'burgundy': '#800020', 'mustard': '#ffdb58', 'rust': '#b7410e',
    'mint': '#98ff98', 'coral': '#ff7f50', 'turquoise': '#40e0d0', 'rose': '#ff007f',
    'wine': '#722f37', 'indigo': '#4f46e5', 'charcoal': '#36454f'
  };
  return colorMap[colorName.toLowerCase().trim()] || '#cccccc';
};

interface ProductData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  story: string;
  price: string;
  originalPrice: string;
  stock: number;
  category_id: string;
  occasions: string[];
  roles: string[];
  isBestSeller: boolean;
  isNewArrival: boolean;
  images: ProductImage[];
  fabric: string;
  craftsmanship: string;
  styling_tips: string[];
  sizes: string[];
  colors: string[];
  videoFile: File | null;
  videoUrl: string | null;
}

import { useParams, useNavigate } from 'react-router-dom';

export default function ProductForm({ onCancel: propOnCancel, initialData: propInitialData }: { onCancel?: () => void, initialData?: any }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(!!id && !propInitialData);
  
  // Draft Persistence Keys - Unique per Product
  const DRAFT_KEY = id ? `kirdaar_product_draft_${id}` : 'kirdaar_product_draft_new';

  const [formData, setFormData] = useState<ProductData>(() => {
    // Initial empty state
    const emptyState: ProductData = {
      id: propInitialData?.id || id,
      name: propInitialData?.name || '',
      slug: propInitialData?.slug || '',
      description: propInitialData?.description || '',
      story: propInitialData?.story || '',
      price: propInitialData?.price?.toString() || '',
      originalPrice: propInitialData?.original_price?.toString() || '',
      stock: propInitialData?.stock || 0,
      category_id: propInitialData?.category_id || '',
      occasions: propInitialData?.occasions?.map((o: any) => o.occasion.id) || [],
      roles: propInitialData?.roles?.map((r: any) => r.role.id) || [],
      isBestSeller: propInitialData?.is_best_seller || false,
      isNewArrival: propInitialData?.is_new_arrival || true,
      images: propInitialData?.images?.map((img: any) => ({ url: img.url, id: img.id })) || [],
      fabric: propInitialData?.fabric || '',
      craftsmanship: propInitialData?.craftsmanship || '',
      styling_tips: propInitialData?.styling_tips || [],
      sizes: propInitialData?.sizes || [],
      colors: propInitialData?.colors || [],
      videoFile: null,
      videoUrl: propInitialData?.images?.find((img: any) => img.url.match(/\.(mp4|webm|mov|mkv)$/i))?.url || null,
    };

    // Filter out video from images and extract color tag
    emptyState.images = propInitialData?.images?.filter((img: any) => !img.url.match(/\.(mp4|webm|mov|mkv)$/i)).map((img: any) => {
      const match = img.url.match(/_color_([^.]+)\./);
      return { 
        url: img.url, 
        id: img.id,
        color: match ? decodeURIComponent(match[1]) : undefined
      };
    }) || [];

    // Check for draft (both for new and existing products)
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        // Only merge if the draft is for the current item or a new item
        return { ...emptyState, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse draft', e);
    }
    
    return emptyState;
  });

  // Show restoration message if needed
  useEffect(() => {
    if (!propInitialData && localStorage.getItem(DRAFT_KEY)) {
      toast.info('Restored your unsaved changes', { 
        duration: 3000,
        description: 'We found unsaved edits from your last session.'
      });
    }
  }, [id, propInitialData]);

  // Save draft on change (Universal: Add & Edit)
  useEffect(() => {
    // Only save if we are NOT currently loading masterpiece data
    if (!dataLoading) {
      // Check if there is actual content to save
      const hasContent = formData.name || formData.description || formData.category_id || formData.story;
      
      if (hasContent) {
        // Create a copy without files for storage
        const { images: __, videoFile: ___, ...draftData } = formData;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      }
    }
  }, [formData, DRAFT_KEY, dataLoading]);

  const [categories, setCategories] = useState<any[]>([]);
  const [occasions, setOccasions] = useState<any[]>([]);
  const [weddingRoles, setWeddingRoles] = useState<any[]>([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, occs, roles] = await Promise.all([
          ProductService.getCategories(),
          ProductService.getOccasions(),
          ProductService.getWeddingRoles()
        ]);
        setCategories(cats);
        setOccasions(occs);
        // Ensure roles have proper structure with id and name
        setWeddingRoles(roles.map(role => ({ id: role.id, name: role.name })));
      } catch (error) {
        console.error('Error fetching metadata:', error);
        toast.error('Failed to load metadata');
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || propInitialData) return;
      
      try {
        setDataLoading(true);
        const { data, error } = await AdminService.getProductById(id);
        if (error) throw error;
        if (data) {
          console.log("ProductForm: Fetched product data", data);
          
          // Safely map occasions regardless of nesting
          const fetchedOccasions = (data.product_occasions || [])
            .map((po: any) => po.occasion_id)
            .filter(Boolean);

          setFormData({
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            story: data.story,
            price: data.price?.toString() || '',
            originalPrice: data.original_price?.toString() || '',
            stock: data.stock || 0,
            category_id: data.category_id,
            occasions: (data.product_occasions || []).map((po: any) => po.occasion_id).filter(Boolean),
            roles: (data.product_wedding_roles || []).map((pwr: any) => pwr.role_id).filter(Boolean),
            isBestSeller: data.is_best_seller || false,
            isNewArrival: data.is_new_arrival || false,
            images: data.images?.filter((img: any) => !img.url.match(/\.(mp4|webm|mov|mkv)$/i)).map((img: any) => ({ url: img.url, id: img.id })) || [],
            fabric: data.fabric || '',
            craftsmanship: data.craftsmanship || '',
            styling_tips: data.styling_tips || [],
            sizes: data.sizes || [],
            colors: data.colors || [],
            videoFile: null,
            videoUrl: data.images?.find((img: any) => img.url.match(/\.(mp4|webm|mov|mkv)$/i))?.url || null,
          });
        }
      } catch (error: any) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load masterpiece details');
      } finally {
        setDataLoading(false);
      }
    };
    fetchProduct();
  }, [id, propInitialData]);

  const handleCancel = () => {
    localStorage.removeItem(DRAFT_KEY);
    if (propOnCancel) propOnCancel();
    else navigate('/admin/products');
  };

  const handleSave = async () => {
    if (loading) return;
    if (!formData.name || !formData.category_id || !formData.price) {
      toast.error('Name, category, and price are required');
      return;
    }

    setLoading(true);
    try {
      const productPayload = {
        name: formData.name,
        slug: formData.slug || slugify(formData.name),
        description: formData.description,
        story: formData.story,
        price: Number(formData.price),
        original_price: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: formData.stock,
        category_id: formData.category_id,
        is_best_seller: formData.isBestSeller,
        is_new_arrival: formData.isNewArrival,
        fabric: formData.fabric,
        craftsmanship: formData.craftsmanship,
        styling_tips: formData.styling_tips.filter(tip => tip.trim() !== ''),
        sizes: formData.sizes.filter(size => size.trim() !== ''),
        colors: formData.colors.filter(color => color.trim() !== '')
      };

      const newFiles = formData.images
        .filter(img => img.isNew && img.file)
        .map(img => {
          const f = img.file as File;
          if (img.color) {
            Object.defineProperty(f, 'colorTag', {
              value: img.color,
              enumerable: false
            });
          }
          return f;
        });

      if (formData.videoFile) {
        newFiles.push(formData.videoFile);
      }

      if (formData.id) {
        await AdminService.updateProduct(formData.id, productPayload, newFiles, formData.occasions, formData.roles);
        toast.success('Masterpiece updated successfully');
      } else {
        await AdminService.createProduct(productPayload, newFiles, formData.occasions, formData.roles);
        toast.success('New masterpiece added to collection');
        localStorage.removeItem(DRAFT_KEY);
      }
      handleCancel();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = (newImages: ProductImage[]) => {
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-sm font-serif italic text-slate-500">Retrieving Masterpiece Details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCancel}
            className="h-11 w-11 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{formData.id ? 'Edit Masterpiece' : 'Add New Masterpiece'}</h1>
            <p className="text-sm font-medium text-slate-500 tracking-wide">Refine the royal collection with exquisite details.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCancel} className="bg-white border-slate-200 text-slate-600 h-11 px-6 rounded-lg text-xs font-bold uppercase tracking-widest">
            Discard
          </Button>
          <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-8 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
            {loading ? 'Processing...' : <><Save className="h-4 w-4" /> Save & Publish</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* General Information */}
          <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <div className="p-2 bg-primary/5 rounded-lg text-primary">
                <Info className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">General Information</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Product Name</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value, slug: slugify(e.target.value) }))}
                  placeholder="e.g. Red Banarasi Silk Saree" 
                  className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Slug</label>
                <Input 
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. red-banarasi-silk-saree" 
                  className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
                  placeholder="Describe the heritage and craftsmanship..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">The Story</label>
                <textarea 
                  value={formData.story}
                  onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
                  placeholder="The inspiration behind this masterpiece..."
                />
              </div>
            </div>
          </section>

          {/* Editorial Details */}
          <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <div className="p-2 bg-primary/5 rounded-lg text-primary">
                <Plus className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Editorial Details</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Craftsmanship</label>
                <textarea 
                  value={formData.craftsmanship}
                  onChange={(e) => setFormData(prev => ({ ...prev, craftsmanship: e.target.value }))}
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
                  placeholder="Details about the hand-embroidery, weaving, or artistic process..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Styling Tips</label>
                <div className="space-y-3">
                  {formData.styling_tips.map((tip, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        value={tip}
                        onChange={(e) => {
                          const newTips = [...formData.styling_tips];
                          newTips[index] = e.target.value;
                          setFormData(prev => ({ ...prev, styling_tips: newTips }));
                        }}
                        className="h-10 bg-slate-50 border-slate-200 text-sm"
                        placeholder="e.g. Pair with gold temple jewelry"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, styling_tips: prev.styling_tips.filter((_, i) => i !== index) }))}
                        className="text-slate-400 hover:text-red-500 shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, styling_tips: [...prev.styling_tips, ''] }))}
                    className="w-full border-dashed border-slate-200 text-slate-500 h-10 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <Plus className="h-3 w-3 mr-2" /> Add Styling Tip
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Media */}
          <ProductImageUploader 
            images={formData.images} 
            onImagesChange={handleImagesChange} 
            colors={formData.colors}
          />

          <ProductVideoUploader
            videoUrl={formData.videoUrl}
            videoFile={formData.videoFile}
            onVideoChange={(file, url) => setFormData(prev => ({ ...prev, videoFile: file, videoUrl: url }))}
            onRemoveVideo={() => setFormData(prev => ({ ...prev, videoFile: null, videoUrl: null }))}
          />

          {/* Pricing & Details */}
          <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
              <div className="p-2 bg-primary/5 rounded-lg text-primary">
                <TagIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Pricing & Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Selling Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <Input 
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00" 
                    className="h-12 pl-8 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">MRP (Original Price)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <Input 
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="0.00" 
                    className="h-12 pl-8 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm" 
                  />
                </div>
              </div>
              {/* Live Discount Badge */}
              {(() => {
                const price = Number(formData.price);
                const original = Number(formData.originalPrice);
                if (price > 0 && original > price) {
                  const pct = Math.round(((original - price) / original) * 100);
                  return (
                    <div className="md:col-span-2 flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-bold">
                        🎉 {pct}% OFF
                      </span>
                      <span className="text-sm text-slate-500">
                        Customer saves <span className="font-bold text-primary">₹{(original - price).toLocaleString()}</span> on this product
                      </span>
                    </div>
                  );
                }
                if (price > 0 && original > 0 && original <= price) {
                  return (
                    <div className="md:col-span-2 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="text-xs font-medium text-amber-700">MRP should be greater than Selling Price for a discount to show.</span>
                    </div>
                  );
                }
                return null;
              })()}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Fabric</label>
                <Input 
                  value={formData.fabric}
                  onChange={(e) => setFormData(prev => ({ ...prev, fabric: e.target.value }))}
                  placeholder="e.g. Pure Mulberry Silk" 
                  className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Stock Quantity</label>
                <Input 
                  type="number" 
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  placeholder="0" 
                  className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Sizes (Comma separated)</label>
                <Input 
                  value={formData.sizes.join(', ')}
                  onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value.split(',').map(s => s.trimStart()) }))}
                  placeholder="e.g. S, M, L, XL" 
                  className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm" 
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Available Colors</label>
                
                {/* Visual Swatch Picker */}
                <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-lg max-h-48 overflow-y-auto">
                  {COMMON_COLORS.map(color => {
                    const isSelected = formData.colors.some(c => c.toLowerCase() === color.toLowerCase());
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setFormData(prev => {
                            const newColors = isSelected 
                              ? prev.colors.filter(c => c.toLowerCase() !== color.toLowerCase())
                              : [...prev.colors, color];
                            return { ...prev, colors: newColors };
                          });
                        }}
                        className={`group relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                          isSelected ? 'border-primary scale-110 shadow-md' : 'border-transparent hover:scale-105'
                        }`}
                        title={color}
                      >
                        <div 
                          className="w-8 h-8 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: getColorHex(color) }}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white/40 rounded-full backdrop-blur-sm" />
                          </div>
                        )}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10 uppercase tracking-widest font-bold">
                          {color}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-400">Or type custom colors (Comma separated)</label>
                  <Input 
                    value={formData.colors.join(', ')}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) {
                        setFormData(prev => ({ ...prev, colors: [] }));
                        return;
                      }
                      setFormData(prev => ({ ...prev, colors: val.split(',').map(s => s.trimStart()) }));
                    }}
                    placeholder="e.g. Custom Red, Soft Peach" 
                    className="h-10 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm" 
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Status */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Status & Visibility</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">New Arrival</span>
                <button 
                  onClick={() => setFormData(prev => ({ ...prev, isNewArrival: !prev.isNewArrival }))}
                  className={cn("w-12 h-6 rounded-full relative transition-colors", formData.isNewArrival ? "bg-green-500" : "bg-slate-200")}
                >
                  <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", formData.isNewArrival ? "right-1" : "left-1")} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Best Seller</span>
                <button 
                  onClick={() => setFormData(prev => ({ ...prev, isBestSeller: !prev.isBestSeller }))}
                  className={cn("w-12 h-6 rounded-full relative transition-colors", formData.isBestSeller ? "bg-secondary" : "bg-slate-200")}
                >
                  <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", formData.isBestSeller ? "right-1" : "left-1")} />
                </button>
              </div>
            </div>
          </section>

          {/* Organization */}
          <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Organization</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
                <select 
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg px-4 text-sm outline-none"
                  disabled={categories.length === 0}
                >
                  <option value="">{categories.length === 0 ? 'Loading Categories...' : 'Select Category'}</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Wedding Roles (Women Only)</label>
                <div className="grid grid-cols-3 gap-2">
                  {weddingRoles.length === 0 ? (
                    <div className="col-span-3 py-4 text-center border border-dashed border-slate-200 rounded-lg">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 animate-pulse">Loading Roles...</span>
                    </div>
                  ) : weddingRoles.map(role => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        roles: prev.roles.includes(role.id) 
                          ? prev.roles.filter(id => id !== role.id)
                          : [...prev.roles, role.id]
                      }))}
                      className={cn(
                        "text-[9px] py-2 px-1 border rounded-lg transition-all font-bold uppercase tracking-normal text-center leading-tight min-h-[38px] flex items-center justify-center",
                        formData.roles.includes(role.id) ? "bg-secondary text-white border-secondary shadow-sm" : "bg-slate-50 text-slate-400 border-slate-200 hover:border-primary/40"
                      )}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Occasions</label>
                <div className="grid grid-cols-3 gap-2">
                  {occasions.length === 0 ? (
                    <div className="col-span-3 py-4 text-center border border-dashed border-slate-200 rounded-lg">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 animate-pulse">Loading Occasions...</span>
                    </div>
                  ) : occasions.map(occ => (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        occasions: prev.occasions.includes(occ.id) 
                          ? prev.occasions.filter(id => id !== occ.id)
                          : [...prev.occasions, occ.id]
                      }))}
                      className={cn(
                        "text-[9px] py-2 px-1 border rounded-lg transition-all font-bold uppercase tracking-normal text-center leading-tight min-h-[38px] flex items-center justify-center",
                        formData.occasions.includes(occ.id) ? "bg-primary text-white border-primary shadow-sm" : "bg-slate-50 text-slate-400 border-slate-200 hover:border-primary/40"
                      )}
                    >
                      {occ.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
