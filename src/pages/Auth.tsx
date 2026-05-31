import { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Heading } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Calendar, Gift, Award, ShieldCheck, Check, ArrowRight, ArrowLeft, RefreshCw, Send, CheckCircle2, Sparkles } from 'lucide-react';

type AuthState = 'login' | 'signup' | 'otp' | 'forgot' | 'reset' | 'success';

export const Auth = () => {
  const [view, setView] = useState<AuthState>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSentTo, setOtpSentTo] = useState('');
  const [otpMethod, setOtpMethod] = useState<'sms' | 'whatsapp'>('sms');
  const [otpTimer, setOtpTimer] = useState(59);
  
  // Login Form State
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  // Signup Form State
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    anniversary: '',
    newsletter: true,
    diwaliPref: true,
    rakhiPref: true,
    weddingPref: false
  });

  // Forgot Password State
  const [forgotForm, setForgotForm] = useState({
    identity: ''
  });

  // Reset Password State
  const [resetForm, setResetForm] = useState({
    password: '',
    confirmPassword: ''
  });

  // OTP Verification Array State (6 digits)
  const [otpCodes, setOtpCodes] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Password strength logic
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: 'None', width: '0%', color: 'bg-gray-200' };
    if (pwd.length < 6) return { label: 'Weak', width: '25%', color: 'bg-red-500' };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    
    if (score <= 1) return { label: 'Fair', width: '50%', color: 'bg-amber-500' };
    if (score === 2) return { label: 'Good', width: '75%', color: 'bg-primary-gold' };
    return { label: 'Strong', width: '100%', color: 'bg-emerald-600' };
  };

  const loginPasswordStrength = getPasswordStrength(signupForm.password);

  // Timer Effect for OTP
  useEffect(() => {
    let interval: any;
    if (view === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, otpTimer]);

  // Handle individual OTP digit shifts
  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    
    const newCodes = [...otpCodes];
    newCodes[index] = val;
    setOtpCodes(newCodes);

    // Auto-focus next box
    if (val !== '' && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto-submit on 6th digit
    if (newCodes.every(code => code !== '')) {
      handleOtpSubmit(newCodes.join(''));
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otpCodes[index] === '' && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Mock Action Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('success');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSentTo(signupForm.phone || signupForm.email);
    setOtpMethod('sms');
    setOtpTimer(59);
    setOtpCodes(['', '', '', '', '', '']);
    setView('otp');
  };

  const handleOtpSubmit = (_code: string) => {
    setView('success');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSentTo(forgotForm.identity);
    setOtpMethod('sms');
    setOtpTimer(59);
    setOtpCodes(['', '', '', '', '', '']);
    setView('otp');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('success');
  };

  const triggerOtpLogin = () => {
    if (!loginForm.username) {
      alert('Please enter your Mobile Number or Email first.');
      return;
    }
    setOtpSentTo(loginForm.username);
    setOtpMethod('sms');
    setOtpTimer(59);
    setOtpCodes(['', '', '', '', '', '']);
    setView('otp');
  };

  const resendOtp = (method: 'sms' | 'whatsapp') => {
    setOtpMethod(method);
    setOtpTimer(59);
    setOtpCodes(['', '', '', '', '', '']);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.4 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary-cream">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-8 relative">
        {/* Background Mandala Glow */}
        <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-primary-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute left-0 bottom-1/4 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl overflow-hidden border border-secondary-sand/50 shadow-2xl min-h-[680px]">
          
          {/* LEFT SIDE: Cinematic branding column */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#1E0C05] text-secondary-cream p-10 flex-col justify-between relative overflow-hidden">
            {/* Visual background image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.pexels.com/photos/20699855/pexels-photo-20699855.jpeg" 
                alt="Luxury Sweets Box" 
                className="w-full h-full object-cover opacity-45 scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#150B07]/80 via-[#5A0B1D]/60 to-[#150B07]/90 mix-blend-multiply"></div>
            </div>

            {/* Top Brand Tag */}
            <div className="relative z-10 space-y-4 text-left">
              <span className="text-primary-gold font-bold text-xs uppercase tracking-[0.25em] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary-gold" /> Sudarshan Sweets
              </span>
              <Heading level={2} className="text-3xl font-bold font-playfair text-white leading-tight">
                Entering the <br/>
                <span className="text-primary-gold italic font-serif">Luxury Gifting Circle</span>
              </Heading>
            </div>

            {/* Benefits Showcase (Card overlayed) */}
            <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-left space-y-4 shadow-xl">
              <p className="text-xs uppercase tracking-widest text-primary-gold font-bold">Exclusive Member Perks</p>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-primary-gold shrink-0" />
                  <span className="text-xs text-white/80 font-inter">Secure Encrypted Orders & Checkout</span>
                </li>
                <li className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-primary-gold shrink-0" />
                  <span className="text-xs text-white/80 font-inter">Personalised Anniversary & Birthday Confections</span>
                </li>
                <li className="flex items-center gap-3">
                  <Gift className="w-4 h-4 text-primary-gold shrink-0" />
                  <span className="text-xs text-white/80 font-inter">Diwali & Gifting Pre-Booking Allocations</span>
                </li>
              </ul>
            </div>

            {/* Security trust badge */}
            <div className="relative z-10 flex items-center gap-2.5 text-[9px] uppercase tracking-widest text-secondary-cream/50 font-inter text-left">
              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary-gold shrink-0">
                🔒
              </div>
              <span>Safe & Secure 256-Bit Encrypted Platform</span>
            </div>
          </div>

          {/* RIGHT SIDE: Animated interaction panel */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white/80 backdrop-blur-sm relative">
            <AnimatePresence mode="wait">
              
              {/* 1. LOGIN VIEW */}
              {view === 'login' && (
                <motion.div 
                  key="login"
                  {...fadeInUp}
                  className="space-y-6 text-left"
                >
                  <div className="space-y-2">
                    <h3 className="font-playfair font-bold text-3xl text-text-brown">Welcome Back</h3>
                    <p className="text-sm text-text-brown/65 font-inter">Continue your journey of traditional sweetness and celebration.</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Mobile Number or Email</label>
                      <input 
                        type="text" 
                        required
                        value={loginForm.username}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="E.g. +91 98765 43210 or care@sudarshan.com"
                        className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5 relative">
                      <div className="flex justify-between items-center">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Password</label>
                        <button 
                          type="button"
                          onClick={() => setView('forgot')}
                          className="text-xs font-bold text-primary hover:underline font-inter"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          required
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="••••••••"
                          className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-brown/40 hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-xs text-text-brown/75 font-inter cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={loginForm.rememberMe}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                          className="w-4 h-4 border-secondary-sand rounded text-primary focus:ring-primary"
                        />
                        <span>Remember me</span>
                      </label>
                      <button 
                        type="button" 
                        onClick={triggerOtpLogin}
                        className="text-xs font-bold text-primary hover:underline font-inter"
                      >
                        Login with OTP
                      </button>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-secondary-cream border-none h-12 shadow-lg mt-2 flex items-center justify-center gap-2">
                      Sign In to Account <ArrowRight className="w-4 h-4 text-primary-gold" />
                    </Button>
                  </form>

                  {/* Social Dividers */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-secondary-sand/50"></div>
                    <span className="flex-shrink mx-4 text-xs text-text-brown/40 uppercase tracking-widest font-semibold font-inter">Or Connect With</span>
                    <div className="flex-grow border-t border-secondary-sand/50"></div>
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-3 gap-4">
                    <button className="flex items-center justify-center gap-2 py-2.5 border border-secondary-sand hover:border-primary rounded-xl text-text-brown hover:bg-secondary-cream/20 transition-all font-semibold font-inter text-xs">
                      {/* Google custom SVG */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      Google
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 border border-secondary-sand hover:border-primary rounded-xl text-text-brown hover:bg-secondary-cream/20 transition-all font-semibold font-inter text-xs">
                      {/* Apple custom SVG */}
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.72-1.18 1.86-1.03 2.97 1.12.09 2.27-.58 2.98-1.41z"/>
                      </svg>
                      Apple
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 border border-secondary-sand hover:border-primary rounded-xl text-text-brown hover:bg-secondary-cream/20 transition-all font-semibold font-inter text-xs">
                      {/* Facebook custom SVG */}
                      <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs text-text-brown/60 font-inter">
                      New to Sudarshan Gifting?{' '}
                      <button 
                        type="button"
                        onClick={() => setView('signup')}
                        className="font-bold text-primary hover:underline"
                      >
                        Create Premium Account
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 2. SIGNUP VIEW */}
              {view === 'signup' && (
                <motion.div 
                  key="signup"
                  {...fadeInUp}
                  className="space-y-6 text-left"
                >
                  <div className="space-y-2">
                    <h3 className="font-playfair font-bold text-3xl text-text-brown">Join Gifting Circle</h3>
                    <p className="text-sm text-text-brown/65 font-inter">Sign up to pre-book festive hampers and receive birthday perks.</p>
                  </div>

                  <form onSubmit={handleSignupSubmit} className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* Basic Info */}
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={signupForm.name}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="E.g. Rahul Sharma"
                        className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Email Address *</label>
                        <input 
                          type="email" 
                          required
                          value={signupForm.email}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="rahul@example.com"
                          className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Mobile Number *</label>
                        <input 
                          type="tel" 
                          required
                          value={signupForm.phone}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="E.g. +91 98765 43210"
                          className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password & Validation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 relative">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Password *</label>
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          required
                          value={signupForm.password}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Min 6 characters"
                          className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Confirm Password *</label>
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          required
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="••••••••"
                          className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password strength bar */}
                    {signupForm.password && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-text-brown/55">
                          <span>Password Strength</span>
                          <span>{loginPasswordStrength.label}</span>
                        </div>
                        <div className="w-full h-1 bg-secondary-sand/40 rounded-full overflow-hidden">
                          <div className={`h-full ${loginPasswordStrength.color} transition-all duration-300`} style={{ width: loginPasswordStrength.width }}></div>
                        </div>
                      </div>
                    )}

                    {/* Personalisation details */}
                    <div className="border-t border-secondary-sand/35 pt-4 space-y-4">
                      <p className="text-xs uppercase font-bold tracking-wider text-primary-gold">Celebration Profile (Optional)</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-text-brown/70 font-inter flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Birthday Date
                          </label>
                          <input 
                            type="date" 
                            value={signupForm.birthday}
                            onChange={(e) => setSignupForm(prev => ({ ...prev, birthday: e.target.value }))}
                            className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-text-brown/70 font-inter flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Anniversary Date
                          </label>
                          <input 
                            type="date" 
                            value={signupForm.anniversary}
                            onChange={(e) => setSignupForm(prev => ({ ...prev, anniversary: e.target.value }))}
                            className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Gifting preferences checkboxes */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-text-brown/70 font-inter">Festival Gifting Alerts</label>
                        <div className="flex flex-wrap gap-4 text-xs">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={signupForm.diwaliPref}
                              onChange={(e) => setSignupForm(prev => ({ ...prev, diwaliPref: e.target.checked }))}
                              className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                            />
                            <span>Diwali Hampers</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={signupForm.rakhiPref}
                              onChange={(e) => setSignupForm(prev => ({ ...prev, rakhiPref: e.target.checked }))}
                              className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                            />
                            <span>Raksha Bandhan</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={signupForm.weddingPref}
                              onChange={(e) => setSignupForm(prev => ({ ...prev, weddingPref: e.target.checked }))}
                              className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                            />
                            <span>Weddings & Shagun</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Opt-ins */}
                    <div className="space-y-2 pt-2 border-t border-secondary-sand/35">
                      <label className="flex items-start gap-2 text-xs text-text-brown/75 font-inter cursor-pointer">
                        <input 
                          type="checkbox" 
                          required
                          className="w-4 h-4 border-secondary-sand rounded text-primary focus:ring-primary mt-0.5"
                        />
                        <span>I agree to the Terms of Service & Privacy Policy *</span>
                      </label>
                      <label className="flex items-start gap-2 text-xs text-text-brown/75 font-inter cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={signupForm.newsletter}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, newsletter: e.target.checked }))}
                          className="w-4 h-4 border-secondary-sand rounded text-primary focus:ring-primary mt-0.5"
                        />
                        <span>Opt-in to the Gifting Circle newsletter for private coupon codes</span>
                      </label>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-secondary-cream border-none h-12 shadow-lg mt-4 flex items-center justify-center gap-2">
                      Create Premium Account <ArrowRight className="w-4 h-4 text-primary-gold" />
                    </Button>
                  </form>

                  <div className="text-center pt-2">
                    <p className="text-xs text-text-brown/60 font-inter">
                      Already have an account?{' '}
                      <button 
                        type="button"
                        onClick={() => setView('login')}
                        className="font-bold text-primary hover:underline"
                      >
                        Sign In Here
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 3. OTP VERIFICATION VIEW */}
              {view === 'otp' && (
                <motion.div 
                  key="otp"
                  {...fadeInUp}
                  className="space-y-6 text-left"
                >
                  <div className="space-y-2">
                    <h3 className="font-playfair font-bold text-3xl text-text-brown">Verify Secure OTP</h3>
                    <p className="text-sm text-text-brown/65 font-inter">
                      We sent a 6-digit confirmation code to <span className="font-semibold text-primary">{otpSentTo}</span> via {otpMethod === 'sms' ? 'SMS' : 'WhatsApp'}.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* OTP 6 digits row */}
                    <div className="flex justify-between gap-2 max-w-sm">
                      {otpCodes.map((code, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          value={code}
                          ref={el => { otpInputsRef.current[idx] = el; }}
                          onChange={(e) => handleOtpChange(e.target.value, idx)}
                          onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                          className="w-12 h-14 bg-secondary-cream/35 border-2 border-secondary-sand text-center text-xl font-bold font-inter rounded-xl outline-none focus:border-primary-gold focus:ring-1 focus:ring-primary-gold transition-colors"
                        />
                      ))}
                    </div>

                    {/* Timer / Resend details */}
                    <div className="flex justify-between items-center text-xs">
                      {otpTimer > 0 ? (
                        <p className="text-text-brown/50 font-inter">
                          Resend code in <span className="font-semibold text-primary font-mono">{otpTimer}s</span>
                        </p>
                      ) : (
                        <div className="flex gap-4">
                          <button 
                            onClick={() => resendOtp('sms')}
                            className="font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Resend via SMS
                          </button>
                          <button 
                            onClick={() => resendOtp('whatsapp')}
                            className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            💬 WhatsApp OTP
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button 
                        onClick={() => setView('login')}
                        variant="outline" 
                        className="flex-1 border-secondary-sand text-text-brown flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                      </Button>
                      <Button 
                        onClick={() => handleOtpSubmit(otpCodes.join(''))}
                        className="flex-1 bg-primary hover:bg-primary/95 text-secondary-cream border-none flex items-center justify-center gap-2"
                        disabled={otpCodes.some(code => code === '')}
                      >
                        Verify & Login <Check className="w-4 h-4 text-primary-gold" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 4. FORGOT PASSWORD VIEW */}
              {view === 'forgot' && (
                <motion.div 
                  key="forgot"
                  {...fadeInUp}
                  className="space-y-6 text-left"
                >
                  <div className="space-y-2">
                    <h3 className="font-playfair font-bold text-3xl text-text-brown">Reset Password</h3>
                    <p className="text-sm text-text-brown/65 font-inter">Let's get you back to sweet moments. Enter your registered email or mobile below.</p>
                  </div>

                  <form onSubmit={handleForgotSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Registered Mobile / Email</label>
                      <input 
                        type="text" 
                        required
                        value={forgotForm.identity}
                        onChange={(e) => setForgotForm({ identity: e.target.value })}
                        placeholder="E.g. +91 98765 43210 or care@sudarshan.com"
                        className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        type="button"
                        onClick={() => setView('login')}
                        variant="outline" 
                        className="flex-1 border-secondary-sand text-text-brown flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                      </Button>
                      <Button 
                        type="submit"
                        className="flex-1 bg-primary hover:bg-primary/95 text-secondary-cream border-none flex items-center justify-center gap-2"
                      >
                        Send Reset Code <Send className="w-4 h-4 text-primary-gold" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* 5. RESET PASSWORD VIEW */}
              {view === 'reset' && (
                <motion.div 
                  key="reset"
                  {...fadeInUp}
                  className="space-y-6 text-left"
                >
                  <div className="space-y-2">
                    <h3 className="font-playfair font-bold text-3xl text-text-brown">Choose New Password</h3>
                    <p className="text-sm text-text-brown/65 font-inter">Create a strong password to secure your Gifting Circle profile.</p>
                  </div>

                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div className="space-y-1.5 relative">
                      <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">New Password</label>
                      <input 
                        type="password" 
                        required
                        value={resetForm.password}
                        onChange={(e) => setResetForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5 relative">
                      <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Confirm New Password</label>
                      <input 
                        type="password" 
                        required
                        value={resetForm.confirmPassword}
                        onChange={(e) => setResetForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="button"
                        onClick={() => setView('login')}
                        variant="outline" 
                        className="flex-1 border-secondary-sand text-text-brown flex items-center justify-center gap-1.5"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="flex-1 bg-primary hover:bg-primary/95 text-secondary-cream border-none flex items-center justify-center gap-2"
                      >
                        Reset Password <Check className="w-4 h-4 text-primary-gold" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* 6. SUCCESS VIEW */}
              {view === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  {/* success animation checks */}
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-md mx-auto relative">
                    <CheckCircle2 className="w-10 h-10 animate-[pulse_2s_infinite]" />
                    {/* Ring animation */}
                    <div className="absolute inset-[-4px] rounded-full border border-emerald-500/25 animate-ping"></div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-playfair font-bold text-3xl text-text-brown">Authentication Successful</h4>
                    <p className="text-sm text-text-brown/65 font-inter max-w-sm mx-auto">
                      Welcome to Sudarshan Gifting Circle. Your access is verified, and you can now proceed to explore our collections.
                    </p>
                  </div>

                  <div className="pt-4 max-w-xs mx-auto">
                    <Link to="/category/all">
                      <Button className="w-full bg-primary hover:bg-primary/95 text-secondary-cream border-none h-12 shadow-lg flex items-center justify-center gap-2">
                        Start Shopping <ArrowRight className="w-4 h-4 text-primary-gold" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
