import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCart } from '@/src/contexts/CartContext';
import { AddressService } from '@/src/services/AddressService';
import { OrderService } from '@/src/services/OrderService';
import { PaymentService } from '@/src/services/PaymentService';
import { Address } from '@/src/types';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Separator } from '@/src/components/ui/separator';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { MapPin, ShieldCheck, Loader2, Plus, Check, X, ShoppingBag, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import PaymentMethodSelector, {
  PaymentMethod,
  CardDetails,
  PaymentValidationErrors
} from '@/src/components/checkout/PaymentMethodSelector';
import ConsentCheckboxes, { ConsentState } from '@/src/components/checkout/ConsentCheckboxes';
import { validatePayment } from '@/src/utils/paymentValidation';
import { Select } from '@/src/components/ui/select';
import { INDIAN_STATES, STATE_CITIES } from '@/src/constants/locations';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('COD');
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    is_default: false
  });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Payment details state
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [upiId, setUPIId] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<PaymentValidationErrors>({});
  const [isPaymentValidated, setIsPaymentValidated] = useState(false);

  // Consent state
  const [consent, setConsent] = useState<ConsentState>({
    termsAndConditions: false,
    privacyPolicy: false,
    marketingConsent: false,
    productVariation: false,
    codVerification: false,
  });
  const [consentErrors, setConsentErrors] = useState<Record<string, string>>({});

  const gstPercentage = Number(import.meta.env.VITE_GST_PERCENTAGE) || 12;
  const subTotal = totalPrice;
  const gstAmount = subTotal - (subTotal / (1 + gstPercentage / 100));
  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;
  const codFee = selectedPaymentMethod === 'COD' ? 50 : 0;
  const grandTotal = subTotal + codFee;

  useEffect(() => {
    if (!user) return;
    loadAddresses();
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  async function loadAddresses() {
    try {
      const data = await AddressService.getAddresses(user!.id);
      setAddresses(data);
      if (data.length > 0) {
        setSelectedAddressId(data.find(a => a.is_default)?.id || data[0].id);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('Failed to load royal addresses');
    } finally {
      setLoading(false);
    }
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsAddingAddress(true);
    try {
      if (editingAddressId) {
        await AddressService.updateAddress(user.id, editingAddressId, {
          ...newAddress,
          country: 'India'
        } as any);
        toast.success('Royal address updated successfully');
      } else {
        const addedAddress = await AddressService.addAddress(user.id, {
          ...newAddress,
          type: 'Home',
          country: 'India'
        } as any);
        setSelectedAddressId(addedAddress.id);
        toast.success('Royal address added successfully');
      }

      await loadAddresses();
      setIsModalOpen(false);
      resetAddressForm();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save royal address');
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (e: React.MouseEvent, addressId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this royal destination?')) return;

    try {
      await AddressService.deleteAddress(addressId);
      toast.success('Address removed');
      loadAddresses();
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to remove address');
    }
  };

  const openEditModal = (e: React.MouseEvent, address: Address) => {
    e.stopPropagation();
    setEditingAddressId(address.id);
    setNewAddress({
      street: address.street,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      is_default: address.is_default
    });
    setIsModalOpen(true);
  };

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setNewAddress({
      street: '',
      city: '',
      state: '',
      zip_code: '',
      is_default: false
    });
  };

  // Get profile address if it exists
  const profileAddress = user && user.address_line1 ? {
    id: 'profile',
    street: user.address_line1,
    city: user.city || '',
    state: user.state || '',
    zip_code: user.pincode || '',
    country: user.country || 'India',
    type: 'Home' as const,
    is_default: false
  } : null;

  const hasProfileAddress = profileAddress && profileAddress.street && profileAddress.city;
  const displayAddresses = addresses.length > 0 ? addresses : (hasProfileAddress ? [profileAddress] : []);

  useEffect(() => {
    if (displayAddresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(displayAddresses[0].id);
    }
  }, [displayAddresses, selectedAddressId]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a shipping destination');
      return;
    }

    // Payment validation is now handled by Razorpay's secure modal for online methods
    // or skipped for COD as it requires no upfront payment details.

    // Validate simplified consent
    if (!consent.termsAndConditions) {
      setConsentErrors({ termsAndConditions: 'You must accept the terms and conditions to proceed' });
      toast.error('Please accept the terms and conditions');
      return;
    }

    setConsentErrors({});

    const shippingAddress = displayAddresses.find(a => a.id === selectedAddressId);
    if (!shippingAddress) return;

    const executeOrderCreation = async (paymentId?: string, orderId?: string, signature?: string) => {
      try {
        await OrderService.createOrder({
          userId: user!.id,
          items: cart,
          totalAmount: grandTotal,
          shippingAddress: shippingAddress,
          paymentStatus: selectedPaymentMethod === 'COD' ? 'Unpaid' : 'Paid', // COD is Unpaid initially, Razorpay is Paid
          paymentMethod: selectedPaymentMethod,
          consent: consent,
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId,
          razorpaySignature: signature,
        });

        toast.success('Your royal order has been placed successfully!');
        clearCart();
        navigate('/dashboard');
      } catch (error) {
        console.error('Error placing order:', error);
        toast.error('Failed to process your royal order');
      } finally {
        setIsPlacingOrder(false);
      }
    };

    if (selectedPaymentMethod === 'COD') {
      setIsPlacingOrder(true);
      await executeOrderCreation();
    } else {
      setIsPlacingOrder(true);
      await PaymentService.processPayment({
        amount: grandTotal,
        name: user?.display_name || 'Valued Customer',
        description: 'Order from Kirdaar Celebrations',
        email: user?.email || '',
        contact: user?.phone_number || '',
        onSuccess: async (response) => {
          await executeOrderCreation(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
        },
        onError: () => {
          setIsPlacingOrder(false);
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-beige/5">
      <div className="global-container">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-secondary font-medium tracking-[0.5em] uppercase text-[10px] block">Final Step</span>
            <h1 className="text-4xl md:text-6xl font-serif text-primary">Checkout</h1>
            <div className="w-16 h-[1px] bg-secondary/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Shipping & Payment Details */}
            <div className="lg:col-span-2 space-y-8 lg:space-y-10">
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif text-primary flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-secondary" /> Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayAddresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`p-6 border cursor-pointer transition-all duration-300 relative ${
                        selectedAddressId === address.id
                          ? 'border-secondary bg-secondary/5 shadow-lg'
                          : 'border-muted hover:border-secondary/50'
                      }`}
                    >
                      {selectedAddressId === address.id && (
                        <div className="absolute top-4 right-4 bg-secondary text-white p-1 rounded-full">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <h4 className="font-bold text-sm text-primary uppercase tracking-widest mb-2">
                        {user?.display_name || user?.email?.split('@')[0] || 'User'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {address.street}, {address.city}, {address.state} - {address.zip_code}
                      </p>
                      <p className="text-[10px] font-bold text-secondary mt-4 uppercase tracking-[0.2em]">
                        {user?.phone_number || 'No phone'}
                      </p>
                      
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-none bg-white/80 hover:bg-white text-slate-400 hover:text-primary shadow-sm"
                          onClick={(e) => openEditModal(e, address)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-none bg-white/80 hover:bg-white text-slate-400 hover:text-red-600 shadow-sm"
                          onClick={(e) => handleDeleteAddress(e, address.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Dialog open={isModalOpen} onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) resetAddressForm();
                  }}>
                    <DialogTrigger asChild>
                      <button 
                        onClick={resetAddressForm}
                        className="p-6 border-2 border-dashed border-muted hover:border-secondary transition-all duration-300 flex flex-col items-center justify-center gap-3 group text-muted-foreground hover:text-secondary"
                      >
                        <Plus className="h-6 w-6" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Add New Address</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-white rounded-none border-primary/10 p-0 overflow-hidden flex flex-col max-h-[90vh]">
                      <DialogHeader className="p-8 bg-beige/10 border-b border-primary/5 flex-shrink-0">
                        <DialogTitle className="text-2xl font-serif text-primary uppercase tracking-widest">
                          {editingAddressId ? 'Refine Royal Destination' : 'New Royal Destination'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="overflow-y-auto flex-grow">
                        <form onSubmit={handleSaveAddress} className="p-8 space-y-6">

                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Street Address</Label>
                            <Input
                              required
                              value={newAddress.street}
                              onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                              placeholder="Flat, House no., Building, Apartment"
                              className="rounded-none border-muted focus-visible:ring-primary/20"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase tracking-widest font-bold text-secondary">State</Label>
                              <Select
                                required
                                value={newAddress.state}
                                onValueChange={(value) => setNewAddress({...newAddress, state: value, city: ''})}
                                className="rounded-none border-muted focus-visible:ring-primary/20 bg-white"
                              >
                                <option value="" disabled>Select State</option>
                                {INDIAN_STATES.map(state => (
                                  <option key={state} value={state}>{state}</option>
                                ))}
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase tracking-widest font-bold text-secondary">City</Label>
                              <Select
                                required
                                value={newAddress.city}
                                onValueChange={(value) => setNewAddress({...newAddress, city: value})}
                                disabled={!newAddress.state}
                                className="rounded-none border-muted focus-visible:ring-primary/20 bg-white"
                              >
                                <option value="" disabled>Select City</option>
                                {newAddress.state && STATE_CITIES[newAddress.state]?.map(city => (
                                  <option key={city} value={city}>{city}</option>
                                ))}
                                {newAddress.state && !STATE_CITIES[newAddress.state] && (
                                  <option value="Other">Other</option>
                                )}
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-bold text-secondary">ZIP Code</Label>
                            <Input
                              required
                              value={newAddress.zip_code}
                              onChange={(e) => setNewAddress({...newAddress, zip_code: e.target.value})}
                              placeholder="6-digit Pincode"
                              className="rounded-none border-muted focus-visible:ring-primary/20"
                            />
                          </div>

                          <div className="flex items-center space-x-3 pt-2">
                            <input
                              type="checkbox"
                              id="is_default"
                              checked={newAddress.is_default}
                              onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                              className="w-4 h-4 rounded-none border-muted text-primary focus:ring-primary/20 accent-primary"
                            />
                            <Label htmlFor="is_default" className="text-[10px] uppercase tracking-widest font-bold text-secondary cursor-pointer">
                              Set as default royal address
                            </Label>
                          </div>

                          <div className="pt-4">
                            <Button
                              type="submit"
                              disabled={isAddingAddress}
                              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-none font-bold uppercase tracking-widest text-xs"
                            >
                              {isAddingAddress ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Address'}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </section>

              {/* Payment Method Selector */}
              <PaymentMethodSelector
                selectedMethod={selectedPaymentMethod}
                onMethodChange={(method) => {
                  setSelectedPaymentMethod(method);
                  setIsPaymentValidated(false);
                  setValidationErrors({});
                }}
                cardDetails={cardDetails}
                onCardDetailsChange={setCardDetails}
                upiId={upiId}
                onUPIIdChange={(id) => {
                  setUPIId(id);
                  setIsPaymentValidated(false);
                  if (validationErrors.upiId) {
                    setValidationErrors(prev => {
                      const { upiId, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                errors={validationErrors}
                onValidate={() => {
                  const validation = validatePayment(selectedPaymentMethod, cardDetails, upiId);
                  setValidationErrors(validation.errors);
                  setIsPaymentValidated(true);
                  return validation.isValid;
                }}
                isProcessing={isPlacingOrder}
              />

              {/* Simplified Consent */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-secondary" />
                  <h2 className="text-2xl font-serif text-primary">Consent & Terms</h2>
                </div>
                
                <div className="p-4 border border-muted bg-white">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="termsConsent"
                      checked={consent.termsAndConditions}
                      onChange={(e) => setConsent({...consent, termsAndConditions: e.target.checked})}
                      className={`w-4 h-4 rounded-none mt-1 flex-shrink-0 ${
                        consentErrors.termsAndConditions
                          ? 'border-destructive text-destructive focus:ring-destructive/20'
                          : 'border-muted text-primary focus:ring-primary/20'
                      } accent-primary`}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="termsConsent"
                        className={`text-sm leading-relaxed cursor-pointer ${
                          consentErrors.termsAndConditions ? 'text-destructive' : 'text-primary'
                        }`}
                      >
                        I have read and agree to the Terms & Conditions, Privacy Policy, Return & Refund Policy, Shipping Policy, and Special Product Terms of Kirdaar Celebrations. 
                        By continuing, I consent to the collection, storage, and processing of my personal information in accordance with the Privacy Policy.
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      
                      {consentErrors.termsAndConditions && (
                        <div className="flex items-center gap-1 mt-2">
                          <AlertCircle className="h-3 w-3 text-destructive" />
                          <p className="text-[10px] text-destructive">{consentErrors.termsAndConditions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-8">
              <div className="bg-white p-8 shadow-2xl border border-primary/5 space-y-8 sticky top-32">
                <h2 className="text-2xl font-serif text-primary border-b border-muted pb-4">Order Summary</h2>

                <div className="space-y-4">
                  <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-20 bg-muted flex items-center justify-center overflow-hidden">
                          {item.images && item.images.length > 0 ? (
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag className="h-6 w-6 text-muted-foreground/20" />
                          )}
                        </div>
                        <div className="flex-grow space-y-1">
                          <h4 className="text-xs font-serif text-primary truncate">{item.name}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Qty: {item.quantity}</p>
                          <p className="text-sm font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground uppercase tracking-widest font-bold">Subtotal (Incl. Taxes)</span>
                      <span className="font-bold">₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span className="uppercase tracking-widest">Included CGST ({gstPercentage / 2}%)</span>
                      <span>₹{cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span className="uppercase tracking-widest">Included SGST ({gstPercentage / 2}%)</span>
                      <span>₹{sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground uppercase tracking-widest font-bold">Shipping</span>
                      <span className="text-secondary font-bold uppercase tracking-widest">Complimentary</span>
                    </div>
                    {selectedPaymentMethod === 'COD' && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground uppercase tracking-widest font-bold">COD Handling</span>
                        <span className="font-bold">₹{codFee.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-serif text-primary uppercase tracking-widest">Total</span>
                      <span className="text-2xl font-bold">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || cart.length === 0}
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-none font-bold uppercase tracking-widest text-xs shadow-xl"
                >
                  {isPlacingOrder ? 'Processing...' : 'Place Royal Order'}
                </Button>

                <p className="text-[9px] text-center text-muted-foreground uppercase tracking-[0.2em] leading-relaxed">
                  By placing this order, you agree to our <br />
                  <Link to="/terms" className="text-secondary hover:underline">Terms & Conditions</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
