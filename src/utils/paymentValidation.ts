import { CardDetails, PaymentValidationErrors, PaymentMethod } from '@/src/components/checkout/PaymentMethodSelector';

// Luhn algorithm for card validation
function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

export function validateCardDetails(details: CardDetails): PaymentValidationErrors {
  const errors: PaymentValidationErrors = {};

  // Card number validation (Luhn algorithm)
  if (!details.cardNumber || details.cardNumber.replace(/\s/g, '').length < 13) {
    errors.cardNumber = 'Please enter a valid card number';
  } else if (!luhnCheck(details.cardNumber.replace(/\s/g, ''))) {
    errors.cardNumber = 'Invalid card number';
  }

  // Card holder validation
  if (!details.cardHolder || details.cardHolder.trim().length < 3) {
    errors.cardHolder = 'Please enter card holder name';
  }

  // Expiry month validation
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  if (!details.expiryMonth || parseInt(details.expiryMonth) < 1 || parseInt(details.expiryMonth) > 12) {
    errors.expiryMonth = 'Invalid month';
  } else if (
    parseInt(details.expiryYear) < currentYear ||
    (parseInt(details.expiryYear) === currentYear && parseInt(details.expiryMonth) < currentMonth)
  ) {
    errors.expiryMonth = 'Card has expired';
  }

  // Expiry year validation
  if (!details.expiryYear || details.expiryYear.length !== 2) {
    errors.expiryYear = 'Invalid year';
  }

  // CVV validation
  if (!details.cvv || details.cvv.length < 3 || details.cvv.length > 4) {
    errors.cvv = 'Please enter a valid CVV';
  }

  return errors;
}

export function validateUPIId(upiId: string): string | undefined {
  if (!upiId || upiId.trim().length === 0) {
    return 'UPI ID is required';
  }
  
  // UPI ID format: username@bankcode
  const upiPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  if (!upiPattern.test(upiId)) {
    return 'Invalid UPI ID format (e.g., yourname@upi)';
  }
  
  return undefined;
}

export function validatePayment(
  method: PaymentMethod,
  cardDetails: CardDetails,
  upiId: string
): { isValid: boolean; errors: PaymentValidationErrors } {
  const errors: PaymentValidationErrors = {};

  if (method === 'CARD') {
    const cardErrors = validateCardDetails(cardDetails);
    Object.assign(errors, cardErrors);
  }

  if (method === 'UPI') {
    const upiError = validateUPIId(upiId);
    if (upiError) {
      errors.upiId = upiError;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Format card number with spaces
export function formatCardNumber(value: string): string {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(' ');
  }
  return v;
}

// Get card type from number
export function getCardType(number: string): string | null {
  const num = number.replace(/\s/g, '');
  if (/^4/.test(num)) return 'Visa';
  if (/^5[1-5]/.test(num)) return 'Mastercard';
  if (/^6/.test(num)) return 'RuPay';
  if (/^3[47]/.test(num)) return 'Amex';
  return null;
}