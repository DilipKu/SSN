import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AdminService } from '@/src/services/AdminService';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}

export const StatsCard = ({ title, value, change, trend, icon: Icon, color, loading }: StatsCardProps) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      {!loading && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          trend === 'up' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        )}>
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {change}
        </div>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-slate-500 tracking-wide">{title}</h3>
      {loading ? (
        <div className="h-8 w-24 bg-slate-100 animate-pulse rounded" />
      ) : (
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      )}
    </div>
  </div>
);

export const DashboardKPIs = ({ days = 0 }: { days?: number }) => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        let startDate;
        if (days > 0) {
          const date = new Date();
          date.setDate(date.getDate() - days);
          startDate = date.toISOString();
        }
        const dashboardStats = await AdminService.getDashboardStats(startDate);
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [days]);

  const kpis = [
    {
      title: "Total Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      change: "+12.5%",
      trend: 'up' as const,
      icon: DollarSign,
      color: "bg-primary",
      loading
    },
    {
      title: "Total Orders",
      value: stats.orders.toString(),
      change: "+8.2%",
      trend: 'up' as const,
      icon: ShoppingBag,
      color: "bg-secondary",
      loading
    },
    {
      title: "Active Customers",
      value: stats.customers.toString(),
      change: "+15.3%",
      trend: 'up' as const,
      icon: Users,
      color: "bg-blue-600",
      loading
    },
    {
      title: "Total Products",
      value: stats.products.toString(),
      change: "-2.4%",
      trend: 'down' as const,
      icon: Package,
      color: "bg-purple-600",
      loading
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => (
        <StatsCard key={idx} {...kpi} />
      ))}
    </div>
  );
};
