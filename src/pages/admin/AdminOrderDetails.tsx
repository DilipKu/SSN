import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  User, 
  Mail, 
  MapPin, 
  CreditCard,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { AdminService } from '@/src/services/AdminService';
import { toast } from 'sonner';
import { Badge } from '@/src/components/ui/badge';
import { cn } from '@/src/lib/utils';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getOrderById(id!);
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load masterpiece details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (order.status === newStatus) return;

    const confirmed = window.confirm(`Are you sure you want to update the status of this order to "${newStatus}"?`);
    if (!confirmed) return;

    try {
      await AdminService.updateOrderStatus(id!, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrderDetails();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update royal status");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-serif italic text-slate-500">Retrieving Order Intelligence...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-24">
        <XCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-serif text-slate-900">Order Not Found</h3>
        <Button onClick={() => navigate('/admin/orders')} variant="link" className="text-primary mt-2">
          Return to Registry
        </Button>
      </div>
    );
  }

  const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/admin/orders')}
            className="rounded-full hover:bg-white hover:shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight uppercase">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-lg px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">
                {order.status}
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1">Acquisition detailed report and management console</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white rounded-lg text-xs font-bold uppercase tracking-widest h-12 px-6">
            Generate Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Order Items & Summary */}
        <div className="xl:col-span-2 space-y-8">
          {/* Status Management */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50 pb-4">
              Status Management Command
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => {
                const isActive = order.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2 group",
                      isActive 
                        ? "bg-slate-900 border-slate-900 text-white shadow-xl scale-[1.02]" 
                        : "bg-white border-slate-100 text-slate-500 hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {status === 'Pending' && <Clock className={cn("h-5 w-5", !isActive && "group-hover:animate-pulse")} />}
                    {status === 'Processing' && <Package className={cn("h-5 w-5", !isActive && "group-hover:animate-pulse")} />}
                    {status === 'Shipped' && <Truck className={cn("h-5 w-5", !isActive && "group-hover:animate-pulse")} />}
                    {status === 'Delivered' && <CheckCircle2 className={cn("h-5 w-5", !isActive && "group-hover:animate-pulse")} />}
                    {status === 'Cancelled' && <XCircle className={cn("h-5 w-5", !isActive && "group-hover:animate-pulse")} />}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{status}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Masterpiece Items */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Masterpiece Registry</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-8 flex items-center gap-8 group hover:bg-slate-50/50 transition-colors">
                  <div className="h-24 w-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                    {item.product?.images?.[0]?.url ? (
                      <img src={item.product.images[0].url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow space-y-1">
                    <h4 className="text-lg font-serif font-bold text-slate-900">{item.product?.name}</h4>
                    <div className="flex gap-6">
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Size</p>
                        <p className="text-xs font-bold text-slate-700">{item.selected_size}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Color</p>
                        <p className="text-xs font-bold text-slate-700">{item.selected_color}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Quantity & Price</p>
                    <p className="text-lg font-bold text-slate-900">
                      {item.quantity} <span className="text-slate-300 mx-1">×</span> ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Payment Strategy</p>
                  <p className="text-sm font-bold text-slate-900">Cash on Delivery</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Total Royal Investment</p>
                <p className="text-4xl font-serif font-bold text-primary">₹{order.total_amount.toLocaleString()}</p>
                {!order.payment_id && (
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">(Includes ₹50 COD Fee)</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Timeline */}
        <div className="space-y-8">
          {/* Customer Profile */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50 pb-4 flex items-center gap-2">
              <User className="h-4 w-4" /> Customer Profile
            </h3>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-xl font-serif font-bold text-primary">
                {(profile?.display_name || 'G').split(' ').map((n: any) => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-xl font-serif font-bold text-slate-900">{profile?.display_name || 'Guest User'}</h4>
                <p className="text-sm text-slate-500">Verified Collector</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">{profile?.email}</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                <div className="text-sm font-medium text-slate-600">
                  <p>Shipping Destination Provided</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Refer to checkout documentation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Acquisition Timeline */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50 pb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Acquisition Timeline
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10" />
                  <div className="w-0.5 h-12 bg-slate-100" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Order Placed</p>
                  <p className="text-xs text-slate-400">
                    {new Date(order.created_at).toLocaleString('en-IN', { 
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn("h-3 w-3 rounded-full", order.status !== 'Pending' ? "bg-primary" : "bg-slate-200")} />
                  <div className="w-0.5 h-12 bg-slate-100" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Quality Inspection</p>
                  <p className="text-xs text-slate-400">Scheduled upon status update</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn("h-3 w-3 rounded-full", order.status === 'Delivered' ? "bg-primary" : "bg-slate-200")} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Final Delivery</p>
                  <p className="text-xs text-slate-400">Awaiting transit completion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
