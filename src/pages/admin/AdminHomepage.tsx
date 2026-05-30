import React, { useState, useEffect } from 'react';
import { Save, Upload, X, Plus, Image as ImageIcon, Loader2, ChevronUp, ChevronDown, Layout } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export default function AdminHomepage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    hero_slides: [] as HeroSlide[],
    occasions_title: 'Celebration by Event',
    occasions_subtitle: 'Curated Occasions',
    categories_title: 'Shop by Category',
    experience_title: 'Find Your Perfect Kirdaar',
    campaign_title: 'The Heritage Zardosi Edit',
    campaign_description: '',
    campaign_images: [] as string[]
  });
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  const DRAFT_KEY = 'kirdaar_homepage_draft';

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('*')
        .eq('id', 'content')
        .single();

      if (error) {
        if (error.code !== 'PGRST116') throw error;
      } else if (data) {
        // Check for local draft first to see if we have unsaved changes
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            setContent(prev => ({ ...prev, ...data, ...parsed }));
            setHasRestoredDraft(true);
            toast.info('Restored unsaved homepage edits', {
              description: 'We found a more recent draft on this device.',
              duration: 4000
            });
          } catch (e) {
            setContent(prev => ({ ...prev, ...data }));
          }
        } else {
          setContent(prev => ({ ...prev, ...data }));
        }
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      toast.error('Failed to load royal homepage content');
    } finally {
      setLoading(false);
    }
  };

  // Save draft on change
  useEffect(() => {
    if (!loading && !saving) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
    }
  }, [content, loading, saving]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('homepage_settings')
        .upsert({ id: 'content', ...content, updated_at: new Date().toISOString() });

      if (error) throw error;
      localStorage.removeItem(DRAFT_KEY);
      toast.success('Homepage narrative updated successfully');
    } catch (error) {
      console.error('Error saving homepage content:', error);
      toast.error('Failed to update royal homepage');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'campaign_images' | 'hero_slide', slideId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Uploading visual asset...');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `homepage/${target}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('homepage')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('homepage')
        .getPublicUrl(filePath);
      
      if (target === 'hero_slide' && slideId) {
        setContent(prev => ({
          ...prev,
          hero_slides: prev.hero_slides.map(s => s.id === slideId ? { ...s, image: publicUrl } : s)
        }));
      } else if (target === 'campaign_images') {
        setContent(prev => ({
          ...prev,
          campaign_images: [...(prev.campaign_images || []), publicUrl]
        }));
      }
      
      toast.success('Asset uploaded successfully', { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload asset', { id: toastId });
    }
  };

  const addHeroSlide = () => {
    const newSlide: HeroSlide = {
      id: Math.random().toString(36).substring(7),
      title: 'New Royale Story',
      subtitle: 'Exquisite craftsmanship for your moments.',
      image: ''
    };
    setContent(prev => ({ ...prev, hero_slides: [...prev.hero_slides, newSlide] }));
  };

  const removeHeroSlide = (id: string) => {
    setContent(prev => ({ ...prev, hero_slides: prev.hero_slides.filter(s => s.id !== id) }));
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...content.hero_slides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;
    
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    setContent(prev => ({ ...prev, hero_slides: newSlides }));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md z-20 py-4 -mx-4 px-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Homepage Management</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Update your luxury destination's visual narrative.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-8 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Changes</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* HERO SLIDER MANAGEMENT */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="text-xl font-serif font-bold text-slate-900">Hero Experience Slider</h3>
            <Button onClick={addHeroSlide} variant="outline" className="gap-2 border-primary/20 text-primary hover:bg-primary hover:text-white">
              <Plus className="h-4 w-4" /> Add Story Slide
            </Button>
          </div>
          
          <div className="space-y-6">
            {content.hero_slides.map((slide, idx) => (
              <div key={slide.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 relative group">
                {/* Reorder Controls */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md" onClick={() => moveSlide(idx, 'up')} disabled={idx === 0}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md" onClick={() => moveSlide(idx, 'down')} disabled={idx === content.hero_slides.length - 1}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image Preview */}
                <div className="w-full md:w-72 aspect-video bg-slate-50 rounded-xl overflow-hidden relative border border-slate-100">
                  {slide.image ? (
                    <img src={slide.image} alt="Slide Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <span className="bg-white text-primary px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg">Change Visual</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero_slide', slide.id)} />
                  </label>
                </div>

                {/* Content Editor */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Headline</label>
                        <Input 
                          value={slide.title} 
                          onChange={(e) => {
                            const newSlides = [...content.hero_slides];
                            newSlides[idx].title = e.target.value;
                            setContent({ ...content, hero_slides: newSlides });
                          }}
                          className="font-serif text-lg bg-slate-50 border-none focus-visible:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subtitle Narrative</label>
                        <Input 
                          value={slide.subtitle} 
                          onChange={(e) => {
                            const newSlides = [...content.hero_slides];
                            newSlides[idx].subtitle = e.target.value;
                            setContent({ ...content, hero_slides: newSlides });
                          }}
                          className="bg-slate-50 border-none focus-visible:ring-primary/20"
                        />
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50"
                      onClick={() => removeHeroSlide(slide.id)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {content.hero_slides.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl space-y-4">
                <Layout className="h-12 w-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 text-sm font-medium tracking-wide">No stories in the hero slider archives.</p>
                <Button onClick={addHeroSlide} variant="secondary">Add First Story</Button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION TITLES & EDITORIALS */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-10">
          <h3 className="text-xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-4">Editorial Headings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Occasions Section Title</label>
              <Input 
                value={content.occasions_title} 
                onChange={(e) => setContent({ ...content, occasions_title: e.target.value })}
                className="h-12 bg-slate-50 border-none focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Categories Section Title</label>
              <Input 
                value={content.categories_title} 
                onChange={(e) => setContent({ ...content, categories_title: e.target.value })}
                className="h-12 bg-slate-50 border-none focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Experience Engine Title</label>
              <Input 
                value={content.experience_title} 
                onChange={(e) => setContent({ ...content, experience_title: e.target.value })}
                className="h-12 bg-slate-50 border-none focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Campaign Section Title</label>
              <Input 
                value={content.campaign_title} 
                onChange={(e) => setContent({ ...content, campaign_title: e.target.value })}
                className="h-12 bg-slate-50 border-none focus-visible:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Campaign Narrative (Description)</label>
            <textarea 
              value={content.campaign_description}
              onChange={(e) => setContent({ ...content, campaign_description: e.target.value })}
              className="w-full h-32 p-4 bg-slate-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="The story behind your heritage edit..."
            />
          </div>
        </section>

        {/* CAMPAIGN VISUALS */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-serif font-bold text-slate-900">Campaign Visual Gallery</h3>
            <div className="relative">
              <label className="cursor-pointer bg-slate-50 text-primary px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-primary/10 hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                <Plus className="h-3 w-3" /> Add Visual
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'campaign_images')} />
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {content.campaign_images?.map((url, idx) => (
              <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 group">
                <img src={url} alt="Campaign Visual" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    onClick={() => setContent({ ...content, campaign_images: content.campaign_images.filter((_, i) => i !== idx) })} 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-white hover:bg-red-500"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
