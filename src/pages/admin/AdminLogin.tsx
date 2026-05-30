import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (user) {
        // Fetch role from profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Check if user is an admin
        const adminEmails = ['avneesh.kumar@kirdaarcelebrations.com'];
        if (profile?.role === 'admin' || (user.email && adminEmails.includes(user.email))) {
          toast.success('Welcome back to the Royal Command');
          navigate('/admin');
        } else {
          // Not an admin
          await supabase.auth.signOut();
          toast.error('Access denied. This portal is reserved for administrators.');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex flex-col items-center group">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-primary/20 transform group-hover:scale-105 transition-transform duration-500">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-widest uppercase">Kirdaar</h1>
            <p className="text-[10px] text-secondary tracking-[0.5em] uppercase mt-1 font-bold">Admin Portal</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Royal Command</h2>
            <p className="text-sm text-slate-500 font-medium">Enter your credentials to manage the masterpiece collection.</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="avneesh.kumar@kirdaarcelebrations.com" 
                  className="h-14 pl-12 bg-slate-50 border-slate-100 focus-visible:ring-primary/20 rounded-xl text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</label>
                <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="h-14 pl-12 pr-12 bg-slate-50 border-slate-100 focus-visible:ring-primary/20 rounded-xl text-sm font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-1">
            <input type="checkbox" id="remember" className="rounded border-slate-300 text-primary focus:ring-primary" />
            <label htmlFor="remember" className="text-xs font-medium text-slate-500">Remember me for 30 days</label>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 gap-2 mt-4">
            {loading ? 'Authenticating...' : <>{'Access Dashboard'} <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          Not an administrator? <Link to="/" className="text-primary font-bold hover:underline">Return to Storefront</Link>
        </p>
      </div>
    </div>
  );
}
