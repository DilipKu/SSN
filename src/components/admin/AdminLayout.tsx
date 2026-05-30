import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import { cn } from '@/src/lib/utils';

export default function AdminLayout({ children }: { 
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <AdminSidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />
      
      <AdminTopbar 
        collapsed={collapsed} 
        setMobileOpen={setMobileOpen} 
      />

      <main 
        className={cn(
          "pt-20 transition-all duration-300",
          collapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
