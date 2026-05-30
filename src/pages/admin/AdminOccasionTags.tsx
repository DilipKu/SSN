import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Image as ImageIcon, 
  X,
  Upload,
  RefreshCw,
  Tag,
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';

interface OccasionTag {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  image_path?: string;
}

export default function AdminOccasionTags() {
  const [tags, setTags] = useState<OccasionTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<OccasionTag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    image_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTags();

    // Subscribe to occasion changes
    const subscription = supabase
      .channel('occasions_admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'occasions' }, fetchTags)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchTags() {
    try {
      const { data, error } = await supabase
        .from('occasions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTags(data as unknown as OccasionTag[]);
    } catch (error) {
      console.error("Error fetching tags:", error);
      toast.error("Failed to load royal occasions");
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (tag: OccasionTag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description,
      image: null,
      image_url: tag.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (tag: OccasionTag) => {
    if (!window.confirm(`Are you sure you want to delete the "${tag.name}" occasion?`)) return;

    try {
      if (tag.image_path) {
        await supabase.storage.from('occasions').remove([tag.image_path]);
      }
      const { error } = await supabase
        .from('occasions')
        .delete()
        .eq('id', tag.id);

      if (error) throw error;
      toast.success("Occasion removed from archives");
      fetchTags();
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("Failed to remove occasion");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Occasion name is required");
      return;
    }

    setSubmitting(true);
    try {
      let image_url = formData.image_url;
      let image_path = editingTag?.image_path || '';

      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const path = fileName;

        const { error: uploadError } = await supabase.storage
          .from('occasions')
          .upload(path, formData.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('occasions')
          .getPublicUrl(path);

        image_url = publicUrl;
        image_path = path;

        // Delete old image if updating
        if (editingTag?.image_path) {
          try {
            await supabase.storage.from('occasions').remove([editingTag.image_path]);
          } catch (e) {
            console.warn("Failed to delete old image:", e);
          }
        }
      }

      const tagData = {
        name: formData.name,
        slug: formData.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
        image_url
      };

      if (editingTag) {
        const { error } = await supabase
          .from('occasions')
          .update(tagData)
          .eq('id', editingTag.id);
        if (error) throw error;
        toast.success("Occasion refined successfully");
      } else {
        const { error } = await supabase
          .from('occasions')
          .insert({ ...tagData, created_at: new Date().toISOString() });
        if (error) throw error;
        toast.success("New occasion added to registry");
      }

      setIsModalOpen(false);
      setEditingTag(null);
      setFormData({ name: '', description: '', image: null, image_url: '' });
      fetchTags();
    } catch (error) {
      console.error("Error saving tag:", error);
      toast.error("Failed to save occasion details");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Occasion Tags</h1>
          <p className="text-slate-500 mt-1">Manage tags for different wedding and festive occasions</p>
        </div>
        <Button 
          onClick={() => {
            setEditingTag(null);
            setFormData({ name: '', description: '', image: null, image_url: '' });
            setIsModalOpen(true);
          }}
          className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add New Tag
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search occasion tags..." 
            className="pl-10 bg-slate-50 border-none focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 animate-pulse">
              <div className="w-full aspect-square bg-slate-100 rounded-2xl" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          ))
        ) : filteredTags.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
              <Tag className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900 tracking-wide">No tags found</p>
              <p className="text-xs text-slate-500">Try adjusting your search or add a new tag.</p>
            </div>
          </div>
        ) : (
          filteredTags.map((tag) => (
            <div key={tag.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="aspect-square relative overflow-hidden bg-slate-50">
                {tag.image_url ? (
                  <img 
                    src={tag.image_url} 
                    alt={tag.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
                    onClick={() => handleEdit(tag)}
                  >
                    <Edit2 className="h-4 w-4 text-slate-600" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8 bg-red-500/90 backdrop-blur-sm hover:bg-red-500"
                    onClick={() => handleDelete(tag)}
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
              <div className="p-5 space-y-1">
                <h3 className="text-sm font-bold text-slate-900 tracking-wide">{tag.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tag.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-auto max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 tracking-wide">
                {editingTag ? 'Edit Occasion Tag' : 'Add New Occasion Tag'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Tag Name</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Wedding, Reception, Haldi"
                  className="h-12 bg-slate-50 border-none focus-visible:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the occasion..."
                  className="w-full min-h-[80px] p-4 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Cover Image</label>
                <div className="relative aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group">
                  {(formData.image || formData.image_url) ? (
                    <>
                      <img 
                        src={formData.image ? URL.createObjectURL(formData.image) : formData.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold tracking-wide flex items-center gap-2">
                          <Upload className="h-4 w-4" /> Change Image
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                          />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload Image</p>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 gap-2"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> {editingTag ? 'Update Tag' : 'Create Tag'}</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
