import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Layers, 
  Library, 
  Tag, 
  Image as ImageIcon, 
  Home, 
  Box, 
  Ticket, 
  Star, 
  FileText, 
  MessageCircle,
  Settings, 
  ShieldCheck, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import { supabase } from '@/src/lib/supabase';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, href, active, collapsed, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-primary text-white shadow-lg shadow-primary/20" 
        : "text-slate-500 hover:bg-slate-100 hover:text-primary"
    )}
  >
    <Icon className={cn("h-5 w-5 shrink-0", active ? "text-white" : "group-hover:text-primary")} />
    {!collapsed && <span className="text-sm font-medium tracking-wide">{label}</span>}
  </button>
);

const NavGroup = ({ title, children, collapsed }: { title: string, children: React.ReactNode, collapsed?: boolean }) => (
  <div className="space-y-2">
    {!collapsed && <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-8 mb-4">{title}</h3>}
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

export default function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: { 
  collapsed: boolean, 
  setCollapsed: (v: boolean) => void,
  mobileOpen: boolean,
  setMobileOpen: (v: boolean) => void
}) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the current sub-view from the pathname
  const currentView = location.pathname.split('/').pop() || 'dashboard';

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navGroups = [
    {
      title: "Main",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
        { icon: Package, label: "Products", id: "products" },
        { icon: Plus, label: "Add New Product", id: "add-product" },
      ]
    },
    {
      title: "Content",
      items: [
        { icon: Home, label: "Homepage Hero", id: "homepage" },
        { icon: Tag, label: "Occasion Tags", id: "tags" },
      ]
    },
    {
      title: "Operations",
      items: [
        { icon: ShoppingBag, label: "Orders", id: "orders" },
        { icon: MessageCircle, label: "Messages", id: "messages" },
      ]
    },
    {
      title: "System",
      items: [
        { icon: ShieldCheck, label: "Admin Users", id: "users" },
      ]
    }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold tracking-widest text-primary uppercase leading-none">Kirdaar</span>
            <span className="text-[8px] tracking-[0.3em] uppercase text-secondary font-bold">Admin Panel</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex text-slate-400 hover:text-primary"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-primary"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
        <div className="mb-4">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-secondary/5 transition-all group">
            <Home className="h-5 w-5 shrink-0 group-hover:text-primary" />
            {!collapsed && <span className="text-sm font-bold tracking-wide uppercase">Back to Site</span>}
          </Link>
        </div>
        
        {navGroups.map((group, idx) => (
          <NavGroup key={idx} title={group.title} collapsed={collapsed}>
            {group.items.map((item) => (
              <NavItem 
                key={item.id} 
                {...item} 
                href="#"
                active={currentView === item.id} 
                collapsed={collapsed} 
                onClick={() => {
                  navigate(`/admin/${item.id}`);
                  setMobileOpen(false);
                }}
              />
            ))}
          </NavGroup>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200",
            collapsed ? "justify-center px-0" : "px-4 justify-start"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:block fixed left-0 top-0 bottom-0 z-40 transition-all duration-300",
        collapsed ? "w-20" : "w-72"
      )}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "lg:hidden fixed left-0 top-0 bottom-0 z-[70] w-72 transition-transform duration-300 transform",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}
