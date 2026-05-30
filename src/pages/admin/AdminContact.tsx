import React, { useState, useEffect } from 'react';
import { Save, MapPin, Phone, MessageCircle, Mail, Globe, Instagram, Facebook, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';

export default function AdminContact() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState({
    business_name: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    google_maps_url: '',
    instagram_url: '',
    facebook_url: ''
  });

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'config')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setDetails(data as any);
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
      toast.error('Failed to load royal contact details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'config', ...details, updated_at: new Date().toISOString() });

      if (error) throw error;
      toast.success('Contact details updated successfully');
    } catch (error) {
      console.error('Error saving contact details:', error);
      toast.error('Failed to update royal contact details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-xs font-serif italic text-slate-500 uppercase tracking-widest">Retrieving Brand Records...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Contact Details</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Manage your brand's presence and customer touchpoints.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-8 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Details</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Business Info */}
        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Business Information
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Business Name</label>
              <Input 
                value={details.business_name}
                onChange={(e) => setDetails(prev => ({ ...prev, business_name: e.target.value }))}
                placeholder="e.g. Kirdaar Celebrations" 
                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Address</label>
              <textarea 
                value={details.address}
                onChange={(e) => setDetails(prev => ({ ...prev, address: e.target.value }))}
                className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Enter full business address..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Google Maps URL</label>
              <Input 
                value={details.google_maps_url}
                onChange={(e) => setDetails(prev => ({ ...prev, google_maps_url: e.target.value }))}
                placeholder="https://maps.google.com/..." 
                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg" 
              />
            </div>
          </div>
        </section>

        {/* Communication */}
        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" /> Communication
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  value={details.phone}
                  onChange={(e) => setDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 9871434777" 
                  className="h-12 pl-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">WhatsApp Number</label>
              <div className="relative">
                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  value={details.whatsapp}
                  onChange={(e) => setDetails(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="+91 9871434777" 
                  className="h-12 pl-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  value={details.email}
                  onChange={(e) => setDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="avneesh.kumar@kirdaarcelebrations.com" 
                  className="h-12 pl-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Presence */}
        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 md:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Instagram className="h-5 w-5 text-primary" /> Social Presence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Instagram URL</label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  value={details.instagram_url}
                  onChange={(e) => setDetails(prev => ({ ...prev, instagram_url: e.target.value }))}
                  placeholder="https://instagram.com/kirdaar" 
                  className="h-12 pl-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Facebook URL</label>
              <div className="relative">
                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  value={details.facebook_url}
                  onChange={(e) => setDetails(prev => ({ ...prev, facebook_url: e.target.value }))}
                  placeholder="https://facebook.com/kirdaar" 
                  className="h-12 pl-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg" 
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
