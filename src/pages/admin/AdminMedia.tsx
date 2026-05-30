import React, { useState, useEffect } from 'react';
import { Upload, Search, Copy, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  category: string;
  created_at: string;
  storage_path: string;
}

export default function AdminMedia() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Products', 'Homepage', 'Collections', 'Campaigns'];

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data as unknown as MediaAsset[]);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load royal media library');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const toastId = toast.loading(`Archiving ${files.length} royal asset(s)...`);
    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const storage_path = fileName;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(storage_path, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(storage_path);
        
        const { error: dbError } = await supabase.from('media').insert({
          name: file.name,
          url: publicUrl,
          category: activeCategory === 'All' ? 'Uncategorized' : activeCategory,
          created_at: new Date().toISOString(),
          storage_path
        });

        if (dbError) throw dbError;
      }
      toast.success('Assets archived successfully', { id: toastId });
      fetchAssets();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to archive media', { id: toastId });
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!window.confirm('Are you sure you want to remove this asset from the archives?')) return;
    try {
      await supabase.storage.from('media').remove([asset.storage_path]);
      const { error } = await supabase.from('media').delete().eq('id', asset.id);
      if (error) throw error;
      
      toast.success('Asset removed');
      fetchAssets();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to remove asset');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Royal URL copied to clipboard');
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || asset.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-xs font-serif italic text-slate-500 uppercase tracking-widest">Opening Royal Vaults...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Media Library</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Manage and organize your brand's visual assets.</p>
        </div>
        <div className="relative">
          <input 
            type="file" 
            id="media-upload" 
            className="hidden" 
            multiple 
            onChange={handleUpload} 
            accept="image/*"
          />
          <label htmlFor="media-upload">
            <div className="inline-flex items-center justify-center cursor-pointer bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-8 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-colors">
              <Upload className="h-4 w-4" /> Upload Media
            </div>
          </label>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-primary text-white shadow-md shadow-primary/10" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media..." 
            className="h-11 pl-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="group relative aspect-square bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <img 
              src={asset.url} 
              alt={asset.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
              <p className="text-[10px] text-white font-bold uppercase tracking-widest text-center line-clamp-1 mb-2">{asset.name}</p>
              <div className="flex items-center gap-2">
                <Button onClick={() => copyToClipboard(asset.url)} variant="ghost" size="icon" className="h-9 w-9 bg-white/20 text-white hover:bg-white/40 rounded-full">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button onClick={() => handleDelete(asset)} variant="ghost" size="icon" className="h-9 w-9 bg-white/20 text-white hover:bg-red-500 rounded-full">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="absolute bottom-2 left-2">
              <span className="bg-white/90 backdrop-blur-sm text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-slate-600">
                {asset.category}
              </span>
            </div>
          </div>
        ))}
        {filteredAssets.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
            <ImageIcon className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-sm font-bold uppercase tracking-widest">No media assets found</p>
          </div>
        )}
      </div>
    </div>
  );
}
