import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Bell, 
  Shield, 
  CreditCard, 
  Mail, 
  Save, 
  RefreshCw,
  Store,
  Languages,
  DollarSign,
  Database,
  Zap
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { supabase } from '@/src/lib/supabase';
import { seedMasterData } from '@/src/utils/seedMasterData';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [settings, setSettings] = useState({
    site_name: 'Kirdaar Celebrations',
    site_description: 'Premium Indian Ethnic Luxury Fashion Brand',
    contact_email: 'contact@kirdaarcelebrations.com',
    currency: 'INR',
    language: 'en',
    tax_rate: '12',
    shipping_fee: '150',
    free_shipping_threshold: '5000',
    maintenance_mode: false,
    enable_notifications: true,
    enable_reviews: true
  });
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  const DRAFT_KEY = 'kirdaar_settings_draft';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'general')
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          // Check for local draft
          const savedDraft = localStorage.getItem(DRAFT_KEY);
          if (savedDraft) {
            try {
              const parsed = JSON.parse(savedDraft);
              setSettings(prev => ({ ...prev, ...data, ...parsed }));
              setHasRestoredDraft(true);
              toast.info('Restored unsaved settings edits', {
                description: 'We found a more recent configuration draft.',
                duration: 4000
              });
            } catch (e) {
              setSettings(prev => ({ ...prev, ...data }));
            }
          } else {
            setSettings(prev => ({ ...prev, ...data }));
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load royal configurations");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save draft on change
  useEffect(() => {
    if (!loading && !saving) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(settings));
    }
  }, [settings, loading, saving]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'general', ...settings, updated_at: new Date().toISOString() });

      if (error) throw error;
      localStorage.removeItem(DRAFT_KEY);
      toast.success("Royal settings preserved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save royal settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSeedData = async () => {
    if (!confirm("Are you sure you want to initialize master data? This will add standard categories and occasions.")) return;
    
    setSeeding(true);
    try {
      const result = await seedMasterData();
      if (result.success) {
        toast.success("Royal master data initialized successfully");
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      toast.error("Failed to initialize royal master data");
    } finally {
      setSeeding(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'store', label: 'Store', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payment', label: 'Payment', icon: CreditCard }
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1">Configure your store and administrative preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Preserve Settings
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">General Configuration</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Site Name</label>
                  <Input 
                    value={settings.site_name}
                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                    className="h-12 bg-slate-50 border-none focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Site Description</label>
                  <textarea 
                    value={settings.site_description}
                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                    className="w-full min-h-[100px] p-4 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Contact Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        value={settings.contact_email}
                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                        className="h-12 pl-11 bg-slate-50 border-none focus-visible:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Default Language</label>
                    <div className="relative">
                      <Languages className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <select 
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="w-full h-12 pl-11 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Store Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Currency</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select 
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      className="w-full h-12 pl-11 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Tax Rate (%)</label>
                  <Input 
                    type="number"
                    value={settings.tax_rate}
                    onChange={(e) => setSettings({ ...settings, tax_rate: e.target.value })}
                    className="h-12 bg-slate-50 border-none focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Standard Shipping Fee</label>
                  <Input 
                    type="number"
                    value={settings.shipping_fee}
                    onChange={(e) => setSettings({ ...settings, shipping_fee: e.target.value })}
                    className="h-12 bg-slate-50 border-none focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Free Shipping Threshold</label>
                  <Input 
                    type="number"
                    value={settings.free_shipping_threshold}
                    onChange={(e) => setSettings({ ...settings, free_shipping_threshold: e.target.value })}
                    className="h-12 bg-slate-50 border-none focus-visible:ring-primary/20"
                  />
                </div>
              </div>
              
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 tracking-wide">Maintenance Mode</p>
                    <p className="text-xs text-slate-500">Temporarily disable the storefront for maintenance</p>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      settings.maintenance_mode ? "bg-primary" : "bg-slate-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      settings.maintenance_mode ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 tracking-wide">Email Notifications</p>
                    <p className="text-xs text-slate-500">Receive emails for new orders and customer inquiries</p>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, enable_notifications: !settings.enable_notifications })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      settings.enable_notifications ? "bg-primary" : "bg-slate-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      settings.enable_notifications ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          
          {(activeTab === 'security' || activeTab === 'payment') && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <Shield className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 tracking-wide">Advanced Settings</p>
                <p className="text-xs text-slate-500">This section is currently under development.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
