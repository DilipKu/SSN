import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Wallet, Building2, Banknote, ShieldCheck, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export type PaymentMethod = 'COD' | 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET';

export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PaymentValidationErrors {
  cardNumber?: string;
  cardHolder?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  upiId?: string;
}

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  cardDetails: CardDetails;
  onCardDetailsChange: (details: CardDetails) => void;
  upiId: string;
  onUPIIdChange: (upiId: string) => void;
  errors: PaymentValidationErrors;
  onValidate: () => boolean;
  isProcessing?: boolean;
}

const paymentMethods = [
  {
    id: 'COD' as PaymentMethod,
    name: 'Cash on Delivery',
    description: 'Pay when your royal outfit arrives',
    icon: Banknote,
    available: true,
  },
  {
    id: 'CARD' as PaymentMethod,
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, RuPay & more',
    icon: CreditCard,
    available: true,
  },
  {
    id: 'UPI' as PaymentMethod,
    name: 'UPI Payment',
    description: 'Google Pay, PhonePe, Paytm & more',
    icon: Wallet,
    available: true,
  },
  {
    id: 'NETBANKING' as PaymentMethod,
    name: 'Net Banking',
    description: 'All major banks supported',
    icon: Building2,
    available: true,
  },
  {
    id: 'WALLET' as PaymentMethod,
    name: 'Digital Wallets',
    description: 'Paytm, PhonePe, Amazon Pay',
    icon: Wallet,
    available: true,
  },
];

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  cardDetails,
  onCardDetailsChange,
  upiId,
  onUPIIdChange,
  errors,
  onValidate,
  isProcessing = false,
}: PaymentMethodSelectorProps) {
  const [showCardForm, setShowCardForm] = useState(false);

  const handleCardInputChange = (field: keyof CardDetails, value: string) => {
    const newDetails = { ...cardDetails, [field]: value };
    onCardDetailsChange(newDetails);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      handleCardInputChange('cardNumber', formatted);
    }
  };

  const handleExpiryChange = (field: 'expiryMonth' | 'expiryYear', value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (field === 'expiryMonth' && numericValue.length <= 2) {
      const month = Math.min(12, parseInt(numericValue) || 0);
      handleCardInputChange(field, month.toString().padStart(2, '0'));
    } else if (field === 'expiryYear' && numericValue.length <= 2) {
      handleCardInputChange(field, numericValue);
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 4) {
      handleCardInputChange('cvv', value);
    }
  };

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (/^4/.test(num)) return 'Visa';
    if (/^5[1-5]/.test(num)) return 'Mastercard';
    if (/^6/.test(num)) return 'RuPay';
    if (/^3[47]/.test(num)) return 'Amex';
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-primary flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-secondary" /> Secure Payment
      </h2>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          return (
            <motion.div
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => method.available && onMethodChange(method.id)}
              className={`p-3 sm:p-4 border cursor-pointer transition-all duration-300 relative ${
                isSelected
                  ? 'border-secondary bg-secondary/5 shadow-lg'
                  : method.available
                  ? 'border-muted hover:border-secondary/50'
                  : 'border-muted opacity-50 cursor-not-allowed'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 bg-secondary text-white p-1 rounded-full">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className={`p-1.5 sm:p-2 rounded-lg ${isSelected ? 'bg-secondary/10' : 'bg-muted/20'}`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isSelected ? 'text-secondary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-primary uppercase tracking-widest">{method.name}</h4>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">{method.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Payment Forms removed as Razorpay handles them in its own modal */}

      {/* Security Notice */}
      <div className="p-4 bg-beige/10 border border-secondary/20">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest">
              Secure Payment Guarantee
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Your payment information is encrypted and secure. We never store your card details.
              All transactions are processed through PCI-DSS compliant payment gateways.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}