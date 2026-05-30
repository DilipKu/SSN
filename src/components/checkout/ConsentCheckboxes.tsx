import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export interface ConsentState {
  termsAndConditions: boolean;
  privacyPolicy: boolean;
  marketingConsent: boolean;
  productVariation: boolean;
  codVerification: boolean;
}

interface ConsentCheckboxesProps {
  consent: ConsentState;
  onConsentChange: (consent: ConsentState) => void;
  errors: Record<string, string>;
  onValidate: () => boolean;
  isCOD?: boolean;
  isInternational?: boolean;
}

export default function ConsentCheckboxes({
  consent,
  onConsentChange,
  errors,
  onValidate,
  isCOD = false,
  isInternational = false,
}: ConsentCheckboxesProps) {
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const handleConsentChange = (field: keyof ConsentState, value: boolean) => {
    const newConsent = { ...consent, [field]: value };
    onConsentChange(newConsent);
  };

  const toggleDetails = (section: string) => {
    setShowDetails(showDetails === section ? null : section);
  };

  const requiredConsents = [
    {
      id: 'termsAndConditions',
      label: 'I have read and agree to the Terms & Conditions, Privacy Policy, Return & Refund Policy, Shipping Policy, and Special Product Terms of Kirdaar Celebrations.',
      required: true,
      details: 'This includes all legal terms governing your purchase, data privacy, return policies, and special conditions for our royal collections.',
    },
    {
      id: 'privacyPolicy',
      label: 'By continuing, you consent to the collection, storage, and processing of your personal information in accordance with our Privacy Policy.',
      required: true,
      details: 'Your personal information will be used to process your order, provide customer service, and improve our services.',
    },
  ];

  const optionalConsents = [
    {
      id: 'marketingConsent',
      label: 'I agree to receive promotional emails, WhatsApp messages, SMS notifications, offers, and marketing updates from Kirdaar Celebrations.',
      required: false,
      details: 'Stay updated on new collections, festive launches, exclusive offers, and promotions.',
    },
    {
      id: 'productVariation',
      label: 'I understand that actual product color, texture, embroidery, and appearance may slightly vary due to photography lighting and screen display settings.',
      required: false,
      details: 'Our handmade products may have slight variations that add to their unique charm and authenticity.',
    },
  ];

  const conditionalConsents = [];

  if (isCOD) {
    conditionalConsents.push({
      id: 'codVerification',
      label: 'I confirm that the contact details and shipping address provided for this Cash on Delivery order are accurate and valid.',
      required: true,
      details: 'Ensuring accurate information helps us deliver your royal masterpiece without delays.',
    });
  }

  if (isInternational) {
    conditionalConsents.push({
      id: 'internationalOrder',
      label: 'I understand that international orders may be subject to customs duties, import taxes, and additional charges applicable in the destination country.',
      required: true,
      details: 'Additional charges may apply depending on your country\'s import regulations.',
    });
  }

  const allConsents = [...requiredConsents, ...conditionalConsents, ...optionalConsents];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-secondary" />
        <h2 className="text-2xl font-serif text-primary">Consent & Terms</h2>
      </div>

      <div className="p-6 bg-beige/10 border border-secondary/20">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest">
              Important Information
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Please review and accept the following terms to proceed with your royal order. 
              Your consent is required for processing your purchase and ensuring the best service experience.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {allConsents.map((consentItem) => {
          const isChecked = consent[consentItem.id as keyof ConsentState];
          const hasError = errors[consentItem.id];
          const isRequired = consentItem.required;

          return (
            <motion.div
              key={consentItem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 border rounded-lg transition-all duration-300 ${
                hasError
                  ? 'border-destructive bg-destructive/5'
                  : isChecked
                  ? 'border-secondary bg-secondary/5'
                  : 'border-muted'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={consentItem.id}
                  checked={isChecked}
                  onChange={(e) => handleConsentChange(consentItem.id as keyof ConsentState, e.target.checked)}
                  className={`w-4 h-4 rounded-none mt-1 flex-shrink-0 ${
                    hasError
                      ? 'border-destructive text-destructive focus:ring-destructive/20'
                      : 'border-muted text-primary focus:ring-primary/20'
                  } accent-primary`}
                />
                <div className="flex-1">
                  <label
                    htmlFor={consentItem.id}
                    className={`text-sm leading-relaxed cursor-pointer ${
                      isRequired ? 'font-semibold' : 'font-normal'
                    } ${
                      hasError ? 'text-destructive' : 'text-primary'
                    }`}
                  >
                    {consentItem.label}
                    {isRequired && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </label>
                  
                  {consentItem.details && (
                    <div className="mt-2">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => toggleDetails(consentItem.id)}
                        className="text-[10px] text-secondary hover:text-primary p-0 h-auto font-normal"
                      >
                        {showDetails === consentItem.id ? 'Hide Details' : 'Show Details'}
                      </Button>
                      
                      <AnimatePresence>
                        {showDetails === consentItem.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-[10px] text-muted-foreground mt-2 italic">
                              {consentItem.details}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {hasError && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertCircle className="h-3 w-3 text-destructive" />
                      <p className="text-[10px] text-destructive">{hasError}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-4 bg-white border border-muted">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Consent Summary
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              By proceeding, you acknowledge that you have read, understood, and agreed to all applicable terms. 
              You can withdraw marketing consent at any time by contacting us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
