import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { OrderService } from '@/src/services/OrderService';
import { Button } from '@/src/components/ui/button';
import { Separator } from '@/src/components/ui/separator';
import { Badge } from '@/src/components/ui/badge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateInvoiceHtml } from '@/src/utils/invoiceGenerator';
import { 
  ChevronLeft, 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck,
  Download,
  AlertCircle,
  XCircle,
  Undo2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { supabase } from '@/src/lib/supabase';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getOrderById(id!);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load royal order details');
      navigate('/dashboard/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!order) return;

    const orderNo = order.order_number || order.id?.slice(0, 8).toUpperCase() || 'NEW';
    const toastId = toast.loading('Opening your royal invoice...');

    try {
      // Generate the HTML content
      const htmlContent = generateInvoiceHtml(order);

      // Open a new window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open new window. Please check if popups are blocked.');
      }

      // Write content to the new window
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      toast.success('Invoice opened in new tab', { id: toastId });
    } catch (error: any) {
      console.error('Invoice generation failed:', error);
      toast.error(error.message || 'Failed to open royal invoice', { id: toastId });
    }
  };


  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'delivered': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'shipped': return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing': return <Package className="h-5 w-5 text-primary" />;
      default: return <Clock className="h-5 w-5 text-secondary" />;
    }
  };

  const handleCancelOrder = async () => {
    if (!id || !order) return;
    
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for your cancellation.');
      return;
    }

    const toastId = toast.loading('Processing your cancellation request...');
    try {
      setIsCancelling(true);
      await OrderService.cancelOrder(id, cancelReason);
      
      // Update local state immediately for better UX
      setOrder((prev: any) => prev ? { 
        ...prev, 
        status: 'Cancelled', 
        cancellation_reason: cancelReason,
        cancelled_at: new Date().toISOString()
      } : null);
      
      toast.success('Order cancelled successfully', { id: toastId });
      setIsCancelDialogOpen(false);
      // Re-fetch to ensure all data is synced with the database
      fetchOrderDetails();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order. Please contact our Royal Support.', { id: toastId });
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-serif italic text-slate-500 uppercase tracking-widest">Retrieving Royal Archives...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-beige/5">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Navigation */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/orders')}
            className="hover:bg-primary/5 text-muted-foreground hover:text-primary gap-2 p-0 h-auto font-bold uppercase tracking-widest text-[10px]"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Royal Registry
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Identity Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 shadow-2xl border border-primary/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rotate-45" />
              
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="rounded-none border-primary/20 text-primary uppercase tracking-widest text-[9px] font-bold px-3">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <h1 className="text-4xl font-serif text-primary">
                    {order.status === 'Cancelled' ? 'Order Cancelled' : 'Masterpiece Acquired'}
                  </h1>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={cn(
                    "flex items-center gap-2 px-4 py-2 border",
                    order.status === 'Cancelled' ? "bg-red-50 border-red-100 text-red-600" : "bg-primary/5 border-primary/10 text-primary"
                  )}>
                    {getStatusIcon(order.status)}
                    <span className="font-bold uppercase tracking-widest text-xs">{order.status}</span>
                  </div>
                  {order.status !== 'Cancelled' && (
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Estimated Delivery: 5-7 Business Days</p>
                  )}
                </div>
              </div>

              {order.status === 'Cancelled' && order.cancellation_reason && (
                <div className="mt-8 p-6 bg-red-50/50 border border-red-100/50 space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-red-600">Cancellation Reason</p>
                  <p className="text-sm italic text-red-900">"{order.cancellation_reason}"</p>
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-[0.2em] mt-4 flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Cancelled on {new Date(order.cancelled_at).toLocaleString()}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Tracking / Timeline Placeholder */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 shadow-xl border border-primary/5"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-8 border-b border-muted pb-2">Royal Journey Timeline</h3>
              <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                {[
                  { title: 'Order Placed', date: order.created_at, completed: true, icon: <CheckCircle2 className="h-3 w-3" /> },
                  { title: 'Quality Assurance', date: 'In Progress', completed: order.status !== 'Pending' && order.status !== 'Cancelled', icon: <ShieldCheck className="h-3 w-3" /> },
                  { title: 'Handcrafted Packaging', date: 'Pending', completed: ['Shipped', 'Delivered'].includes(order.status), icon: <Package className="h-3 w-3" /> },
                  { title: 'Royal Courier Dispatch', date: 'Pending', completed: order.status === 'Delivered', icon: < Truck className="h-3 w-3" /> }
                ].map((step, index) => (
                  <div key={index} className="flex gap-6 relative">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center z-10",
                      step.completed ? "bg-green-600 text-white shadow-lg shadow-green-200" : "bg-white border-2 border-muted text-muted-foreground",
                      order.status === 'Cancelled' && !step.completed && "opacity-30"
                    )}>
                      {step.icon}
                    </div>
                    <div>
                      <p className={cn("text-xs font-bold uppercase tracking-widest", step.completed ? "text-primary" : "text-muted-foreground")}>{step.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {order.status === 'Cancelled' && !step.completed ? 'Terminated' : step.date === 'In Progress' ? step.date : step.date !== 'Pending' ? new Date(step.date).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : 'Awaiting progress'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white shadow-xl border border-primary/5 overflow-hidden"
            >
              <div className="p-8 border-b border-muted flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Masterpieces Included</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{order.items?.length} Items</span>
              </div>
              <div className="divide-y divide-muted">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="p-8 flex gap-8 group">
                    <Link to={`/product/${item.product?.id}`} className="w-24 h-32 bg-muted overflow-hidden flex-shrink-0 border border-primary/5">
                      {item.product?.images?.[0] && (
                        <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      )}
                    </Link>
                    <div className="flex-grow space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/product/${item.product?.id}`} className="font-serif text-2xl text-primary hover:text-secondary transition-colors">{item.product?.name}</Link>
                          <div className="flex gap-4 mt-2">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-slate-50 px-2 py-1 border border-muted">Size: {item.selected_size}</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-slate-50 px-2 py-1 border border-muted">Color: {item.selected_color}</span>
                          </div>
                        </div>
                        <p className="font-bold text-lg text-primary">₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-xs text-muted-foreground">Quantity: <span className="font-bold text-primary">{item.quantity}</span></p>
                        <p className="text-sm font-bold uppercase tracking-widest text-secondary">Subtotal: ₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Payment Summary Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 shadow-2xl border border-primary/5 space-y-6"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary border-b border-muted pb-2">Financial Registry</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-muted-foreground">
                  <span>Acquisition Value</span>
                  <span className="text-primary">₹{(order.total_amount - (!order.payment_id ? 50 : 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-muted-foreground">
                  <span>Royal Shipping</span>
                  <span className="text-green-600 italic">Complimentary</span>
                </div>
                {!order.payment_id && (
                  <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-muted-foreground">
                    <span>COD Handling Fee</span>
                    <span className="text-primary">₹50</span>
                  </div>
                )}
                <Separator className="bg-primary/5" />
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-serif text-primary uppercase tracking-widest font-bold">Total Investment</span>
                  <span className="text-2xl font-bold text-primary">₹{order.total_amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className={cn(
                "p-4 border space-y-3",
                order.payment_status === 'Paid' ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className={cn("h-4 w-4", order.payment_status === 'Paid' ? "text-green-600" : "text-amber-600")} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Payment Info</span>
                  </div>
                  <Badge className={cn(
                    "rounded-none text-[8px] uppercase tracking-widest font-bold",
                    order.payment_status === 'Paid' ? "bg-green-600" : "bg-amber-600"
                  )}>
                    {order.payment_status}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Method</p>
                  <p className="text-xs font-bold text-primary">{order.payment_id ? 'Online Payment (Razorpay)' : 'Cash on Delivery'}</p>
                </div>

                {order.payment_id && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Transaction Reference</p>
                    <p className="font-mono text-[10px] font-bold text-primary break-all">{order.payment_id}</p>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleDownloadInvoice}
                className="w-full rounded-none bg-primary hover:bg-primary/90 text-white uppercase tracking-widest text-[10px] font-bold h-12 gap-2 shadow-lg shadow-primary/10"
              >
                <Download className="h-4 w-4" /> Download Royal Invoice
              </Button>

              {['Pending', 'Processing'].includes(order.status) && (
                <Button 
                  variant="outline"
                  onClick={() => setIsCancelDialogOpen(true)}
                  className="w-full rounded-none border-red-200 text-red-600 hover:bg-red-50 uppercase tracking-widest text-[10px] font-bold h-12 gap-2"
                >
                  <XCircle className="h-4 w-4" /> Request Cancellation
                </Button>
              )}
            </motion.div>

            {/* Cancellation Dialog */}
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
              <DialogContent className="sm:max-w-md bg-white rounded-none border border-primary/20 p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="bg-[#fcfbf9] p-6 text-center border-b border-primary/10 relative pb-6">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/40 via-secondary to-secondary/40" />
                  <div className="mx-auto w-12 h-12 bg-white border border-primary/10 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Undo2 className="h-5 w-5 text-secondary" />
                  </div>
                  <DialogTitle className="text-2xl font-serif text-primary">Cancel Order</DialogTitle>
                  <DialogDescription className="text-muted-foreground text-xs mt-2 leading-relaxed mx-auto">
                    Please let us know why you are cancelling this order.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="p-6 space-y-6 bg-white">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-primary flex items-center gap-2">
                      Reason for Cancellation <span className="text-red-500">*</span>
                    </label>
                    <Textarea 
                      placeholder="Please provide a brief explanation..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="rounded-none border-primary/20 bg-[#fcfbf9] min-h-[100px] focus-visible:ring-1 focus-visible:ring-secondary/50 resize-none text-sm p-3 transition-all"
                    />
                  </div>
                </div>

                <DialogFooter className="p-4 bg-[#fcfbf9] border-t border-primary/10 flex flex-col sm:flex-row gap-3 justify-between items-center sm:space-x-0">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsCancelDialogOpen(false)}
                    className="w-full sm:w-auto rounded-none text-xs font-bold text-muted-foreground hover:text-primary hover:bg-white border border-transparent hover:border-primary/10 h-10 px-6 transition-all"
                  >
                    Keep Order
                  </Button>
                  <Button 
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="w-full sm:w-auto rounded-none bg-primary hover:bg-primary/90 text-white text-xs font-bold h-10 px-8 shadow-sm transition-all"
                  >
                    {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Shipping Address Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 shadow-xl border border-primary/5 space-y-6"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-secondary border-b border-muted pb-2">Shipping Destination</h3>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary/5 flex items-center justify-center rounded-full flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="font-serif text-xl text-primary">{order.shipping_address?.full_name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">
                    {order.shipping_address?.address_line1}<br />
                    {order.shipping_address?.address_line2 && <>{order.shipping_address.address_line2}<br /></>}
                    {order.shipping_address?.city}, {order.shipping_address?.state}<br />
                    {order.shipping_address?.postal_code}, {order.shipping_address?.country || 'India'}
                  </p>
                  <Separator className="bg-primary/5" />
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                    <Package className="h-3 w-3" />
                    Phone: {order.shipping_address?.phone}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Help/Support */}
            <div className="bg-slate-900 p-8 text-white space-y-4">
              <h4 className="font-serif text-xl text-beige">Need Royal Assistance?</h4>
              <p className="text-beige/60 text-[10px] uppercase tracking-widest leading-relaxed">Our concierges are available 24/7 to assist with your masterpieces.</p>
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/contact">
                  <Button variant="outline" className="w-full border-beige/20 text-beige hover:bg-beige/10 rounded-none h-10 uppercase tracking-widest text-[9px] font-bold">Contact Concierge</Button>
                </Link>
                <div className="flex items-center gap-2 text-beige/40 text-[9px] uppercase tracking-widest font-bold mt-2">
                  <AlertCircle className="h-3 w-3" />
                  Reference Order: #{order.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for layout styling
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
