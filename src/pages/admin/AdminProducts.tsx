import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit2, 
  Trash2, 
  Eye, 
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import StatusBadge from '@/src/components/admin/StatusBadge';
import { cn } from '@/src/lib/utils';
import { AdminService } from '@/src/services/AdminService';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: { name: string } | null;
  price: number;
  stock: number;
  status?: string;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  images: { url: string }[];
}

import { useNavigate } from 'react-router-dom';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllProducts();
      setProducts(data as any);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load masterpieces');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this masterpiece?')) return;
    
    try {
      await AdminService.deleteProduct(id);
      toast.success('Product removed from collection');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-sm font-serif italic text-slate-500">Retrieving Royal Collection...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Manage your royal collection of ethnic wear.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-slate-200 text-slate-600 gap-2 h-11 px-4 rounded-lg text-xs font-bold uppercase tracking-widest">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button 
            onClick={() => navigate('/admin/products/add')}
            className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-6 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by name, slug, or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-grow md:flex-grow-0 bg-white border-slate-200 text-slate-600 gap-2 h-11 px-4 rounded-lg text-xs font-bold uppercase tracking-widest">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-sm font-bold text-primary">{selectedProducts.length} masterpieces selected</span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 text-[10px] font-bold uppercase tracking-widest">Delete Selection</Button>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Stock</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={product.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={product.name} className="h-12 w-12 rounded-lg object-cover border border-slate-100" />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-slate-900 leading-none">{product.name}</span>
                          {product.is_new_arrival && <span className="bg-green-100 text-green-600 text-[8px] uppercase tracking-widest px-1.5 py-0.5 font-bold rounded-sm">New</span>}
                          {product.is_best_seller && <span className="bg-amber-100 text-amber-600 text-[8px] uppercase tracking-widest px-1.5 py-0.5 font-bold rounded-sm">Hot</span>}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-900">{product.category?.name || 'Uncategorized'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">₹{Number(product.price).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-sm font-bold",
                      product.stock === 0 ? "text-red-600" : product.stock < 5 ? "text-orange-600" : "text-slate-900"
                    )}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={product.stock > 0 ? 'Active' : 'Out of Stock'} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        onClick={() => navigate(`/product/${product.id}`)}
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-slate-400 hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-slate-400 hover:text-primary"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(product.id)} variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="p-4 bg-slate-50 w-fit mx-auto rounded-full text-slate-300">
                <Plus className="w-8 h-8" />
              </div>
              <p className="text-sm font-serif italic text-slate-500">No masterpieces matching your search...</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 tracking-wide">Showing {filteredProducts.length} masterpieces</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled className="h-9 w-9 rounded-lg border-slate-200 text-slate-400">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 rounded-lg bg-primary text-white border-primary text-xs font-bold">1</Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-slate-200 text-slate-600 hover:text-primary">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
