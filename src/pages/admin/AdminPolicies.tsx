import React, { useState, useEffect } from 'react';
import { Save, FileText, Upload, X, File as FileIcon, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';

interface Policy {
  id: string;
  title: string;
  content: string;
  pdf_url?: string;
}

const POLICY_TYPES = [
  { id: 'terms', title: 'Terms & Conditions' },
  { id: 'privacy', title: 'Privacy Policy' },
  { id: 'shipping', title: 'Shipping Policy' },
  { id: 'return', title: 'Return & Exchange Policy' },
  { id: 'sop', title: 'SOP / Rules & Regulations' }
];

export default function AdminPolicies() {
  const [policies, setPolicies] = useState<Record<string, Policy>>({});
  const [activeTab, setActiveTab] = useState(POLICY_TYPES[0].id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*');

      if (error) throw error;

      const policyData: Record<string, Policy> = {};
      data.forEach(policy => {
        policyData[policy.id] = policy as Policy;
      });
      setPolicies(policyData);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast.error('Failed to load royal policies');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const policy = policies[activeTab] || { id: activeTab, title: POLICY_TYPES.find(p => p.id === activeTab)?.title || '', content: '' };
    try {
      const { error } = await supabase
        .from('policies')
        .upsert({ ...policy, updated_at: new Date().toISOString() });

      if (error) throw error;
      toast.success(`${policy.title} preserved successfully`);
    } catch (error) {
      console.error('Error saving policy:', error);
      toast.error('Failed to preserve policy');
    } finally {
      setSaving(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Uploading PDF to Royal Archives...');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${activeTab}_${Date.now()}.${fileExt}`;
      const filePath = `policies/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('policy-docs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('policy-docs')
        .getPublicUrl(filePath);
      
      setPolicies(prev => ({
        ...prev,
        [activeTab]: {
          ...(prev[activeTab] || { id: activeTab, title: POLICY_TYPES.find(p => p.id === activeTab)?.title || '', content: '' }),
          pdf_url: publicUrl
        }
      }));
      toast.success('Document uploaded successfully', { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document', { id: toastId });
    }
  };

  const removePdf = () => {
    setPolicies(prev => ({
      ...prev,
      [activeTab]: {
        ...(prev[activeTab] || { id: activeTab, title: POLICY_TYPES.find(p => p.id === activeTab)?.title || '', content: '' }),
        pdf_url: undefined
      }
    }));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-xs font-serif italic text-slate-500 uppercase tracking-widest">Accessing Royal Documents...</p>
    </div>
  );

  const currentPolicy: Policy = policies[activeTab] || { 
    id: activeTab, 
    title: POLICY_TYPES.find(p => p.id === activeTab)?.title || '', 
    content: '',
    pdf_url: undefined
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Policies & Documents</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Manage the legal and operational framework of your brand.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-8 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Policy</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {POLICY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all duration-200",
                activeTab === type.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/10" 
                  : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
              )}
            >
              <FileText className="h-5 w-5 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest">{type.title}</span>
            </button>
          ))}
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3 space-y-8">
          <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <h3 className="text-xl font-serif font-bold text-slate-900">{currentPolicy.title}</h3>
              <div className="flex items-center gap-3">
                {currentPolicy.pdf_url && (
                  <a href={currentPolicy.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
                    <ExternalLink className="h-3 w-3" /> View PDF
                  </a>
                )}
                <div className="relative">
                  <input type="file" id="pdf-upload" className="hidden" onChange={handlePdfUpload} accept="application/pdf" />
                  <label htmlFor="pdf-upload">
                    <div className="inline-flex items-center justify-center cursor-pointer bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 h-10 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors">
                      <Upload className="h-3 w-3" /> {currentPolicy.pdf_url ? 'Replace PDF' : 'Upload PDF'}
                    </div>
                  </label>
                </div>
                {currentPolicy.pdf_url && (
                  <Button onClick={removePdf} variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Document Content</label>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Policy Editor</span>
                </div>
                <textarea 
                  value={currentPolicy.content}
                  onChange={(e) => setPolicies(prev => ({
                    ...prev,
                    [activeTab]: {
                      ...(prev[activeTab] || { id: activeTab, title: POLICY_TYPES.find(p => p.id === activeTab)?.title || '', content: '' }),
                      content: e.target.value
                    }
                  }))}
                  className="w-full h-[500px] p-8 bg-white text-sm leading-relaxed font-light focus:outline-none resize-none"
                  placeholder="Enter policy content here..."
                />
              </div>
            </div>

            {currentPolicy.pdf_url && (
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <FileIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Attached PDF Document</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate max-w-md">{currentPolicy.pdf_url}</p>
                </div>
                <Button onClick={removePdf} variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 text-[10px] font-bold uppercase tracking-widest">
                  Remove
                </Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
