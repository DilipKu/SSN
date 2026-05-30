import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/src/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

// AuthContext v1.1 - Stability & Cache Refresh

interface AuthContextType {
  user: (User & { [key: string]: any }) | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User & { role?: string }) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchingProfile = useRef<string | null>(null);

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("AuthContext: Initial Session Check", session?.user?.id);
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthContext: Auth State Change", event, session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserProfile(authUser: User) {
    if (fetchingProfile.current === authUser.id) return;
    fetchingProfile.current = authUser.id;
    setLoading(true);

    try {
      console.log("AuthContext: Fetching profile for", authUser.id);
      
      // Fetch profile and address in parallel for speed
      const [profileResult, addressResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle(),
        supabase.from('addresses').select('*').eq('user_id', authUser.id).eq('is_default', true).maybeSingle()
      ]);

      const profileData = profileResult.data;
      const addressData = addressResult.data;

      console.log("AuthContext: Raw Profile Data:", profileData);
      console.log("AuthContext: Raw Address Data:", addressData);

      // Determine Role
      let role = profileData?.role || 'customer';
      const adminEmails = ['avneesh.kumar@kirdaarcelebrations.com', 'admin@kirdar.com'];
      if (authUser.email && adminEmails.includes(authUser.email)) {
        role = 'admin';
      }

      console.log("AuthContext: Profile & Address retrieved for role:", role);
      
      const updatedUser = { 
        ...authUser, 
        ...profileData, 
        role,
        // Map fields explicitly to ensure they match Dashboard expectation
        phone: profileData?.phone || profileData?.phone_number || '',
        address_line1: addressData?.street || profileData?.address_line1 || '',
        city: addressData?.city || profileData?.city || '',
        state: addressData?.state || profileData?.state || '',
        pincode: addressData?.zip_code || profileData?.pincode || '',
        country: addressData?.country || profileData?.country || 'India',
        address_id: addressData?.id,
        status: profileData?.status || 'active'
      };
      
      console.log("AuthContext: Final Merged User Object:", updatedUser);
      setUser(updatedUser);
    } catch (err) {
      console.error('AuthContext: Fatal error fetching user profile:', err);
      // Fallback to customer OR admin if it's a hardcoded email
      const adminEmails = ['avneesh.kumar@kirdaarcelebrations.com', 'admin@kirdaar.com'];
      const fallbackRole = (authUser.email && adminEmails.includes(authUser.email)) ? 'admin' : 'customer';
      setUser({ ...authUser, role: fallbackRole });
    } finally {
      fetchingProfile.current = null;
      setLoading(false);
      console.log("AuthContext: Loading finished");
    }
  }

  const refreshProfile = async () => {
    if (session?.user) {
      await fetchUserProfile(session.user);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
