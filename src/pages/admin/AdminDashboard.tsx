import React, { useState, useEffect } from 'react';
import { DashboardKPIs } from '@/src/components/admin/DashboardKPIs';
import { SalesTrendChart, CategoryDistribution } from '@/src/components/admin/DashboardCharts';
import RecentOrders from '@/src/components/admin/RecentOrders';
import { Calendar, Download, Filter, Plus, Home, Package, Library, Users, Settings as SettingsIcon, ShoppingBag, Tag, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { AdminService } from '@/src/services/AdminService';

import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  const rangeOptions = [
    { label: 'All Time', value: 0 },
    { label: 'Last 7 Days', value: 7 },
    { label: 'Last 30 Days', value: 30 },
    { label: 'Last 90 Days', value: 90 },
  ];

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        const [products, customers] = await Promise.all([
          AdminService.getAllProducts(),
          AdminService.getRecentCustomers()
        ]);
        
        // Filter low stock (less than 5)
        const lowStockItems = products.filter((p: any) => p.stock < 5);
        setLowStock(lowStockItems);
        setRecentCustomers(customers);
      } catch (error) {
        console.error("Error fetching dashboard details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardDetails();
  }, []);

  const quickAccess = [
    { id: 'add-product', label: 'Add Product', icon: Plus, color: 'bg-primary/10 text-primary' },
    { id: 'products', label: 'Products', icon: Package, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, color: 'bg-indigo-50 text-indigo-600' },
    { id: 'homepage', label: 'Homepage Hero', icon: Home, color: 'bg-blue-50 text-blue-600' },
    { id: 'tags', label: 'Occasion Tags', icon: Tag, color: 'bg-rose-50 text-rose-600' },
    { id: 'users', label: 'Admin Users', icon: ShieldCheck, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Welcome back. Here's what's happening in your royal collection today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button 
              variant="outline" 
              onClick={() => setIsRangeOpen(!isRangeOpen)}
              className="bg-white border-slate-200 text-slate-600 gap-2 h-11 px-4 rounded-lg text-xs font-bold uppercase tracking-widest min-w-[160px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> 
                {rangeOptions.find(o => o.value === timeRange)?.label}
              </div>
              <Filter className="h-3 w-3 opacity-50" />
            </Button>
            
            {isRangeOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsRangeOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl z-50 rounded-xl overflow-hidden py-1">
                  {rangeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setTimeRange(opt.value);
                        setIsRangeOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors",
                        timeRange === opt.value ? "bg-primary/5 text-primary" : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Button onClick={() => navigate('/admin/add-product')} className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-6 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Add New Product
          </Button>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {quickAccess.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(`/admin/${item.id}`)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
          >
            <div className={cn("p-3 rounded-xl mb-3 transition-colors group-hover:bg-primary group-hover:text-white", item.color)}>
              <item.icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest text-center">{item.label}</span>
          </button>
        ))}
      </div>

      {/* KPIs */}
      <DashboardKPIs days={timeRange} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesTrendChart />
        </div>
        <div className="lg:col-span-1">
          <CategoryDistribution />
        </div>
      </div>

      {/* Recent Orders & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <RecentOrders />
        </div>
        <div className="xl:col-span-1 space-y-8">
          {/* Low Stock Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              Low Stock Alerts
              {lowStock.length > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{lowStock.length} Items</span>
              )}
            </h3>
            <div className="space-y-4 flex-grow">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2 opacity-50">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Checking Inventory...</span>
                </div>
              ) : lowStock.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center space-y-2">
                  <Package className="w-8 h-8 text-slate-200" />
                  <p className="text-xs font-medium text-slate-400 italic">All masterpieces are well-stocked</p>
                </div>
              ) : (
                lowStock.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <img src={item.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={item.name} className="h-12 w-12 rounded-lg object-cover border border-slate-100" />
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-slate-900 leading-none mb-1 line-clamp-1">{item.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">#{item.slug.slice(0, 10)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-red-600">{item.stock} left</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button onClick={() => navigate('/admin/products')} variant="ghost" className="w-full mt-6 text-primary hover:bg-primary/5 text-xs font-bold uppercase tracking-widest">
              Manage Inventory
            </Button>
          </div>

          {/* Recent Customers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Customers</h3>
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2 opacity-50">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Retrieving Profiles...</span>
                </div>
              ) : recentCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center space-y-2">
                  <Users className="w-8 h-8 text-slate-200" />
                  <p className="text-xs font-medium text-slate-400 italic">No recent registrations</p>
                </div>
              ) : (
                recentCustomers.map((customer, idx) => (
                  <div key={customer.id} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {(customer.display_name || 'G').split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-slate-900 leading-none mb-1">{customer.display_name || 'Guest User'}</h4>
                      <span className="text-[10px] text-slate-400 uppercase tracking-tight">{customer.email}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button onClick={() => navigate('/admin/users')} variant="ghost" className="w-full mt-6 text-primary hover:bg-primary/5 text-xs font-bold uppercase tracking-widest">
              View All Customers
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
