import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Library, Save, X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { AdminService } from '@/src/services/AdminService';
import { toast } from 'sonner';

interface Collection {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<Partial<Collection>>({
    name: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllOccasions();
      setCollections(data as any);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load royal collections');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentCollection.name) {
      toast.error('Collection name is required');
      return;
    }

    try {
      if (currentCollection.id) {
        await AdminService.updateOccasion(currentCollection.id, {
          name: currentCollection.name,
          description: currentCollection.description,
          image_url: currentCollection.image_url
        });
        toast.success('Collection updated');
      } else {
        await AdminService.createOccasion({
          name: currentCollection.name!,
          description: currentCollection.description,
          image_url: currentCollection.image_url
        });
        toast.success('Collection created');
      }
      setIsEditing(false);
      setCurrentCollection({ name: '', description: '', image_url: '' });
      fetchCollections();
    } catch (error) {
      console.error('Error saving collection:', error);
      toast.error('Failed to save collection');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this story from the collection?')) return;
    try {
      await AdminService.deleteOccasion(id);
      toast.success('Collection removed');
      fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to remove collection');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Uploading masterpiece cover...');
    try {
      const url = await AdminService.uploadImage(file, 'occasions');
      setCurrentCollection(prev => ({ ...prev, image_url: url }));
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload cover image', { id: toastId });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-sm font-serif italic text-slate-500">Retrieving Royal Stories...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Occasions & Stories</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Organize your royal pieces into curated stories.</p>
        </div>
        <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-6 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Create Story
        </Button>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">{currentCollection.id ? 'Edit Story' : 'New Story'}</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-red-500">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Story Name</label>
                <Input 
                  value={currentCollection.name}
                  onChange={(e) => setCurrentCollection(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. The Wedding Gala 2026" 
                  className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description</label>
                <textarea 
                  value={currentCollection.description}
                  onChange={(e) => setCurrentCollection(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Describe the inspiration behind this story..."
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Cover Image</label>
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-dashed border-slate-100 bg-slate-50 group">
                  {currentCollection.image_url ? (
                    <>
                      <img src={currentCollection.image_url} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button onClick={() => setCurrentCollection(prev => ({ ...prev, image_url: '' }))} variant="ghost" size="icon" className="h-10 w-10 text-white hover:bg-red-500">
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 cursor-pointer">
                      <input type="file" id="collection-image" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      <label htmlFor="collection-image" className="flex flex-col items-center gap-2 cursor-pointer">
                        <Upload className="h-8 w-8 text-slate-300" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Upload Cover</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-white gap-2 h-12 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                <Save className="h-4 w-4" /> {currentCollection.id ? 'Update Story' : 'Create Story'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((col) => (
          <div key={col.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img src={col.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600'} alt={col.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button onClick={() => { setCurrentCollection(col); setIsEditing(true); }} variant="ghost" size="icon" className="h-9 w-9 bg-white/90 text-slate-600 hover:text-primary rounded-full shadow-sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button onClick={() => handleDelete(col.id)} variant="ghost" size="icon" className="h-9 w-9 bg-white/90 text-slate-600 hover:text-red-600 rounded-full shadow-sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">{col.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 font-light italic">{col.description || 'No description provided.'}</p>
            </div>
          </div>
        ))}
        {collections.length === 0 && !isEditing && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
            <Library className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest">No royal stories found</p>
            <Button onClick={() => setIsEditing(true)} variant="ghost" className="mt-4 text-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest">Create your first story</Button>
          </div>
        )}
      </div>
    </div>
  );
}
