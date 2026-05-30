import React from 'react';
import { Search, Bell, User, Menu, Settings, LogOut, Plus, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { cn } from '@/src/lib/utils';

export default function AdminTopbar({ collapsed, setMobileOpen }: { 
  collapsed: boolean, 
  setMobileOpen: (v: boolean) => void
}) {
  const navigate = useNavigate();
  return (
    <header 
      className={cn(
        "fixed top-0 right-0 z-30 h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 transition-all duration-300",
        collapsed ? "left-20" : "left-72",
        "lg:left-auto lg:w-[calc(100%-20rem)]",
        collapsed && "lg:w-[calc(100%-5rem)]"
      )}
    >
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-grow max-w-xl">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-slate-500"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="relative w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search orders, products, customers..." 
            className="w-full pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <Link to="/" target="_blank">
          <Button variant="ghost" className="hidden lg:flex text-slate-500 hover:text-primary gap-2 h-10 px-4 text-[10px] font-bold uppercase tracking-widest">
            <Eye className="h-4 w-4" /> View Store
          </Button>
        </Link>

        <Button 
          onClick={() => navigate('/admin/products/add')}
          className="hidden sm:flex bg-primary hover:bg-primary/90 text-white gap-2 h-10 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </Button>

        <div className="flex items-center gap-1 md:gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Status</span>
        </div>

        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-primary">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

        <div className="flex items-center gap-3 pl-2">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-900 leading-none">Avneesh Kumar</span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">Super Admin</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-serif font-bold text-lg border-2 border-slate-100 shadow-sm">
            AK
          </div>
        </div>
      </div>
    </header>
  );
}
