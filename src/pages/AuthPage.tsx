import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { toast } from 'sonner';
import { Separator } from '@/src/components/ui/separator';
import { useAuth } from '@/src/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { Select } from '@/src/components/ui/select';
import { INDIAN_STATES, STATE_CITIES } from '@/src/constants/locations';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Additional fields for registration
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { refreshProfile } = useAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Manual validation
    if (!isLogin) {
      if (!displayName.trim() || !phoneNumber.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !pincode.trim() || !country.trim() || !email.trim() || !password) {
        toast.error("Please fill in all required fields marked with *");
        return;
      }
    } else {
      if (!email.trim() || !password) {
        toast.error("Please enter both email and password");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Welcome back to the Royal Circle');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // 1. Store profile data in 'profiles' table
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: email,
              display_name: displayName,
              phone_number: phoneNumber,
              role: 'customer',
              status: 'active',
              updated_at: new Date().toISOString()
            });

          // 2. Also create an initial entry in 'addresses' table for shipping
          const { error: addressError } = await supabase
            .from('addresses')
            .insert({
              user_id: data.user.id,
              type: 'Home',
              street: `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}`,
              city,
              state,
              zip_code: pincode, // Mapping pincode to zip_code
              country,
              is_default: true
            });

          if (profileError || addressError) {
            console.error("Storage Error:", { profileError, addressError });
            toast.error('Account created, but some details failed to save. Please check your profile settings.');
          } else {
            await refreshProfile();
            toast.success('Registration successful! Welcome to Kirdaar Celebrations.');
          }
        }
      }
      navigate('/');
    } catch (error: any) {
      console.error("Auth Error:", error);

      // Handle rate limiting (429) gracefully
      if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
        toast.error('Too many requests. Please wait a few minutes before trying again.', {
          description: 'This is a security measure to protect your account.'
        });
      } else {
        toast.error(error.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4 bg-beige/5">
      <div className="max-w-xl w-full bg-white shadow-2xl p-8 md:p-12 border border-primary/5">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl font-serif text-primary">
            {isLogin ? 'Welcome Back' : 'Join the Circle'}
          </h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">
            {isLogin ? 'Enter your royal credentials' : 'Create your Kirdaar profile'}
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleEmailAuth} className="space-y-4" noValidate>
            {!isLogin && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Full Name *</label>
                    <Input
                      placeholder="Maharaja / Maharani Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="rounded-none h-12 border-muted focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Phone Number *</label>
                    <Input
                      type="tel"
                      placeholder="+91 9871434777"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="rounded-none h-12 border-muted focus-visible:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Address Line 1 *</label>
                  <Input
                    placeholder="House/Flat No., Building Name, Street"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="rounded-none h-12 border-muted focus-visible:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Address Line 2 (Optional)</label>
                  <Input
                    placeholder="Landmark, Area, Locality"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="rounded-none h-12 border-muted focus-visible:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">State *</label>
                    <Select 
                      value={state}
                      onValueChange={(val) => {
                        setState(val);
                        setCity('');
                      }}
                      className="rounded-none h-12 border-muted focus-visible:ring-primary/20"
                    >
                      <option value="" disabled>Select State</option>
                      {INDIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">City *</label>
                    <Select 
                      value={city}
                      onValueChange={setCity}
                      disabled={!state}
                      className="rounded-none h-12 border-muted focus-visible:ring-primary/20"
                    >
                      <option value="" disabled>Select City</option>
                      {state && STATE_CITIES[state]?.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      {state && !STATE_CITIES[state] && (
                        <option value="Other">Other</option>
                      )}
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Pincode / Zipcode *</label>
                    <Input
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="rounded-none h-12 border-muted focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Country *</label>
                    <Input
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="rounded-none h-12 border-muted focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="my-4">
                  <Separator />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Email Address *</label>
              <Input
                type="email"
                placeholder="avneesh.kumar@kirdaarcelebrations.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none h-12 border-muted focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Password *</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-none h-12 border-muted focus-visible:ring-primary/20 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-none font-bold uppercase tracking-widest text-xs mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="text-center pt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-primary hover:underline uppercase tracking-widest font-bold"
            >
              {isLogin ? "Don't have an account? Join us" : "Already a member? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
