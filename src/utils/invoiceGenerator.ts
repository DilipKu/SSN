import { Order } from '../types';

/**
 * Generates the HTML for the invoice based on the provided template.
 * Uses snake_case properties as returned by the Supabase backend.
 */
export const generateInvoiceHtml = (order: any): string => {
  // Use order: any because the actual data structure differs slightly from the TypeScript interface
  const dateStr = order.created_at || order.createdAt || new Date().toISOString();
  const dateObj = new Date(dateStr);
  const date = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const orderNo = order.order_number || order.id?.slice(0, 8).toUpperCase() || 'NEW';
  const items = order.items || [];
  
  // GST Calculations
  const gstPercentage = Number(import.meta.env.VITE_GST_PERCENTAGE) || 12;
  const subTotal = items.reduce((sum: number, item: any) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const gstAmount = subTotal - (subTotal / (1 + gstPercentage / 100));
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const paymentMethod = order.payment_id ? 'Online Payment' : 'Cash on Delivery';
  const codFee = paymentMethod === 'Cash on Delivery' ? 50 : 0;
  const totalAmount = subTotal + codFee;
  
  const totalInWords = numberToWords(totalAmount);
  
  const itemsHtml = items.map((item: any, index: number) => {
    const productName = item.product?.name || item.name || 'Product';
    const size = item.selected_size || item.selectedSize || 'Standard';
    const color = item.selected_color || item.selectedColor || 'Standard';
    const price = item.price || 0;
    const qty = item.quantity || 1;
    const amount = price * qty;
    const hsn = item.product?.hsn || '6204'; // Default HSN for apparel

    return `
      <tr>
        <td class="center">${index + 1}</td>
        <td>
          <div class="item-name">${productName}</div>
          <div class="item-sub">Size: ${size} | Color: ${color}</div>
        </td>
        <td class="center">${hsn}</td>
        <td class="right">₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td class="center">${qty}</td>
        <td class="right">₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    `;
  }).join('');

  const shippingAddr = order.shipping_address || order.address || {};
  const customerName = shippingAddr.full_name || shippingAddr.street || 'Valued Customer';
  const addr1 = shippingAddr.address_line1 || shippingAddr.street || '';
  const addr2 = shippingAddr.address_line2 || '';
  const city = shippingAddr.city || '';
  const state = shippingAddr.state || '';
  const postalCode = shippingAddr.postal_code || shippingAddr.zip_code || '';
  const phone = shippingAddr.phone || '';

  const paymentStatus = order.payment_status || order.paymentStatus || 'Pending';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Tax Invoice #${orderNo} – Kirdaar Celebrations</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
    font-size: 13px;
    background: #f4f4f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 10px;
    color: #000;
  }
  .page {
    background: #fff;
    width: 794px; /* A4 width in pixels at 96dpi is ~794px */
    min-height: 1123px; /* A4 height */
    border: 1px solid #e2e8f0;
    margin-bottom: 40px;
    padding: 0;
    position: relative;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  /* ── PRINT CONTROLS ── */
  .no-print {
    position: fixed;
    top: 30px;
    right: 30px;
    z-index: 1000;
    background: #7c2d12;
    color: white;
    padding: 14px 28px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 15px;
    box-shadow: 0 10px 15px -3px rgba(124, 45, 18, 0.3);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .no-print:hover { background: #92400e; transform: translateY(-1px); }
  .no-print:active { transform: translateY(0); }

  /* ── PAGE TITLE ROW ── */
  .page-title-row {
    display: flex;
    justify-content: center;
    align-items: baseline;
    padding: 12px 24px;
    border-bottom: 2px solid #000;
    position: relative;
  }
  .page-title-row .tax-invoice {
    font-size: 26px;
    font-weight: 800;
    color: #334155;
    letter-spacing: 0.5px;
  }
  .page-title-row .original-label {
    position: absolute;
    right: 24px;
    font-size: 16px;
    font-weight: 500;
    color: #64748b;
    letter-spacing: 0.5px;
  }

  /* ── HEADER ── */
  .header {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    border: 1px solid #000;
    margin: 15px 24px;
  }
  .header-logo {
    width: 110px;
    height: 110px;
    object-fit: cover;
    flex-shrink: 0;
  }
  .header-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .company-name {
    font-size: 22px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 2px;
  }
  .company-address {
    font-size: 13px;
    color: #475569;
    margin-bottom: 4px;
  }
  .company-details-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 2px 20px;
    font-size: 13px;
    color: #475569;
  }
  .company-details-grid strong {
    color: #0f172a;
    font-weight: 700;
  }

  /* ── BILL TO / INVOICE DETAILS ── */
  .bill-inv-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid #e2e8f0;
  }
  .bill-cell, .inv-cell {
    padding: 16px 24px;
    font-size: 13px;
    line-height: 1.6;
  }
  .bill-cell { border-right: 1px solid #e2e8f0; }
  .cell-label {
    font-size: 11px;
    font-weight: 800;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    display: block;
  }
  .customer-name { font-size: 15px; font-weight: 700; color: #000; margin-bottom: 4px; }

  /* ── ITEMS TABLE ── */
  table.items {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  table.items th {
    background: #f8fafc;
    font-weight: 700;
    padding: 12px 14px;
    border-bottom: 2px solid #000;
    text-align: left;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  table.items th.right, table.items td.right { text-align: right; }
  table.items th.center, table.items td.center { text-align: center; }
  table.items td {
    padding: 12px 14px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
  }
  .item-name { font-weight: 700; color: #000; margin-bottom: 2px; }
  .item-sub { font-size: 11px; color: #6b7280; }

  /* ── BOTTOM SECTION: Payment left, Totals right ── */
  .bottom-section {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
  }
  .payment-col {
    padding: 20px 24px;
    border-right: 1px solid #e2e8f0;
    font-size: 13px;
    line-height: 1.6;
  }
  .payment-col .label { 
    font-size: 11px; font-weight: 800; color: #6b7280; 
    text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 10px; display: block;
  }
  
  .totals-col {
    padding: 0;
    font-size: 13px;
    background: #f8fafc;
  }
  .total-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 24px;
    border-bottom: 1px solid #e2e8f0;
  }
  .total-line.bold { 
    font-weight: 900; 
    background: #fff;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
    font-size: 18px;
    color: #7c2d12;
    padding: 14px 24px;
  }
  .total-line-label { flex: 1; }
  .total-line-value { font-weight: 700; text-align: right; }

  .inv-words-label { font-size: 11px; font-weight: 800; color: #6b7280; padding: 16px 24px 4px; text-transform: uppercase; }
  .inv-words-value { padding: 0 24px 20px; font-size: 12px; font-weight: 600; font-style: italic; }

  /* ── TERMS & SIGNATORY CONTAINER ── */
  .footer-row {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    margin: 20px 24px;
    border: 1px solid #000;
  }

  .terms-col {
    flex: 2;
    border-right: 1px solid #000;
    display: flex;
    flex-direction: column;
  }
  .terms-header {
    background: #f1f5f9;
    padding: 8px 12px;
    font-weight: 800;
    border-bottom: 1px solid #000;
    font-size: 11px;
    text-transform: uppercase;
  }
  .terms-content {
    padding: 12px;
    font-size: 11px;
    line-height: 1.6;
    color: #4b5563;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .terms-content ol {
    padding-left: 18px;
    margin-bottom: auto; /* pushes thanks message to bottom */
  }
  .thanks-msg {
    margin-top: 15px;
    font-weight: 700;
    font-size: 13px;
    color: #1e293b;
    font-style: italic;
  }

  .signatory-col {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    background: #fff;
  }
  .signatory-header {
    background: #f1f5f9;
    padding: 8px 12px;
    font-weight: 800;
    border-bottom: 1px solid #000;
    font-size: 11px;
    text-transform: uppercase;
  }
  .signatory-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 15px 10px 10px;
  }
  .sig-img {
    max-width: 140px;
    max-height: 60px;
    object-fit: contain;
  }
  .sig-label {
    font-size: 12px;
    font-weight: 700;
    color: #334155;
    text-transform: uppercase;
    text-align: center;
    border-top: 1px dashed #cbd5e1;
    padding-top: 8px;
    width: 80%;
  }

  /* ═════════ PAGE 2 ═════════ */
  .cut-row {
    width: 794px;
    padding: 30px 0;
    text-align: center;
    color: #94a3b8;
    border-top: 2px dashed #cbd5e1;
    margin: 40px 0;
    font-weight: 600;
    letter-spacing: 6px;
    text-transform: uppercase;
    font-size: 10px;
  }
  .ack-title {
    text-align: center;
    font-size: 24px;
    font-weight: 900;
    padding: 30px 0 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .ack-outer {
    border: 2px solid #000;
    margin: 0 24px 60px;
    overflow: hidden;
  }
  .ack-company-row {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px 24px;
    background: #f8fafc;
    border-bottom: 2px solid #000;
  }
  .ack-logo { width: 70px; height: 70px; object-fit: contain; }
  .ack-header-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-bottom: 1px solid #000;
    background: #f1f5f9;
  }
  .ack-header-cell {
    padding: 12px 20px;
    font-weight: 800;
    font-size: 11px;
    text-transform: uppercase;
    border-right: 1px solid #000;
  }
  .ack-header-cell:last-child { border-right: none; }
  .ack-data-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .ack-data-cell {
    padding: 20px;
    font-size: 13px;
    line-height: 1.6;
    border-right: 1px solid #000;
    min-height: 150px;
  }
  .ack-data-cell:last-child { border-right: none; }

  @media print {
    body { background: #fff; padding: 0; margin: 0; }
    .page { border: none; margin: 0; box-shadow: none; width: 100%; min-height: auto; }
    .cut-row, .no-print { display: none; }
    @page { size: A4; margin: 0; }
    .page { page-break-after: always; }
    .page:last-child { page-break-after: auto; }
  }
</style>
</head>
<body>

<button class="no-print" onclick="window.print()">
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
  </svg>
  Print / Save as PDF
</button>

<!-- ══════════════════════════════ PAGE 1 ══════════════════════════════ -->
<div class="page">
  <div class="page-title-row">
    <span class="tax-invoice">Tax Invoice</span>
    <span class="original-label">ORIGINAL FOR RECIPIENT</span>
  </div>

  <div class="header">
    <img class="header-logo" src="/logo.png" alt="Logo" />
    <div class="header-info">
      <div class="company-name">KIRDAAR CELEBRATIONS</div>
      <div class="company-address">Mangal Vihar, Sunhara Road, Roorkee.</div>
      <div class="company-details-grid">
        <div>Phone: <strong>9871434777</strong></div>
        <div>Email: <strong>avneesh.kumar@kirdaarcelebrations.com</strong></div>
        <div>GSTIN: <strong>05ABBFK4539N2Z1</strong></div>
        <div>State: <strong>05-Uttarakhand</strong></div>
      </div>
    </div>
  </div>

  <div class="bill-inv-row">
    <div class="bill-cell">
      <span class="cell-label">BILL TO</span>
      <div class="customer-name">${customerName}</div>
      <div>${addr1}</div>
      ${addr2 ? `<div>${addr2}</div>` : ''}
      <div>${city}, ${state} - ${postalCode}</div>
      <div><strong>Phone:</strong> ${phone}</div>
    </div>
    <div class="inv-cell">
      <span class="cell-label">INVOICE DETAILS</span>
      <div><strong>Invoice No:</strong> #SALE-${orderNo}</div>
      <div><strong>Date:</strong> ${date}</div>
      <div><strong>Reverse Charge:</strong> No</div>
      <div><strong>Place of Supply:</strong> ${state}</div>
    </div>
  </div>

  <table class="items">
    <thead>
      <tr>
        <th class="center" style="width: 60px">S.No</th>
        <th>Item Name</th>
        <th class="center" style="width: 100px">HSN/SAC</th>
        <th class="right" style="width: 120px">Price</th>
        <th class="center" style="width: 80px">Qty</th>
        <th class="right" style="width: 140px">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div class="bottom-section">
    <div class="payment-col">
      <span class="label">PAYMENT INFORMATION</span>
      <div><strong>Method:</strong> ${paymentMethod}</div>
      <div><strong>Status:</strong> ${paymentStatus.toUpperCase()}</div>
    </div>
    <div class="totals-col">
      <div class="total-line">
        <span class="total-line-label">Sub Total (Incl. Taxes)</span>
        <span class="total-line-value">₹${subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="total-line" style="color: #6b7280; font-size: 11px; border: none; padding-top: 5px; padding-bottom: 5px;">
        <span class="total-line-label">Included CGST (${gstPercentage / 2}%)</span>
        <span class="total-line-value">₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="total-line" style="color: #6b7280; font-size: 11px;">
        <span class="total-line-label">Included SGST (${gstPercentage / 2}%)</span>
        <span class="total-line-value">₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      ${codFee > 0 ? `
      <div class="total-line">
        <span class="total-line-label">COD Handling Fee</span>
        <span class="total-line-value">₹${codFee.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>` : ''}
      <div class="total-line bold">
        <span class="total-line-label">Grand Total</span>
        <span class="total-line-value">₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="inv-words-label">Amount in Words:</div>
      <div class="inv-words-value">${totalInWords} RUPEES ONLY</div>
    </div>
  </div>

  <div class="footer-row">
    <div class="terms-col">
      <div class="terms-header">TERMS AND CONDITIONS</div>
      <div class="terms-content">
        <ol>
          <li>Goods once sold will not be taken back or exchanged.</li>
          <li>Subject to Roorkee Jurisdiction only.</li>
          <li>We are not responsible for any damage after the goods leave our premises.</li>
        </ol>
        <div class="thanks-msg">Thank you for shopping with Kirdaar Celebrations!</div>
      </div>
    </div>

    <div class="signatory-col">
      <div class="signatory-header">For KIRDAAR CELEBRATIONS:</div>
      <div class="signatory-body">
        <img class="sig-img" src="data:image/png;base64,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" alt="Authorized Signature"/>
        <div class="sig-label">Authorized Signatory</div>
      </div>
    </div>
  </div>
</div>

<!-- ══════════════════════════════ PAGE 2: ACKNOWLEDGEMENT ══════════════════════════════ -->
<div class="cut-row">âœ‚---------------------------- CUT HERE ----------------------------âœ‚</div>

<div class="page">
  <div class="ack-title">DELIVERY ACKNOWLEDGEMENT</div>
  <div class="ack-outer">
    <div class="ack-company-row">
      <img class="ack-logo" src="/logo.png" alt="Logo" />
      <div style="flex: 1">
        <div style="font-size: 20px; font-weight: 900; color: #7c2d12;">KIRDAAR CELEBRATIONS</div>
        <div style="font-size: 12px; color: #4b5563;">Mangal Vihar, Sunhara Road, Roorkee</div>
      </div>
      <div style="text-align: right; font-size: 13px;">
        <strong>Invoice:</strong> #SALE-${orderNo}<br>
        <strong>Date:</strong> ${date}
      </div>
    </div>
    
    <div class="ack-header-row">
      <div class="ack-header-cell">CUSTOMER DETAILS</div>
      <div class="ack-header-cell">ORDER SUMMARY</div>
      <div class="ack-header-cell">SIGNATURE</div>
    </div>
    
    <div class="ack-data-row">
      <div class="ack-data-cell">
        <strong>${customerName}</strong><br>
        ${addr1}<br>
        ${city}, ${state}<br>
        Ph: ${phone}
      </div>
      <div class="ack-data-cell">
        Total Items: ${items.length}<br>
        Total Qty: ${items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0)}<br>
        <strong>Amount: ₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
      </div>
      <div class="ack-data-cell" style="display: flex; align-items: flex-end; justify-content: center; color: #cbd5e1; font-weight: 700; font-size: 11px;">
        RECEIVER'S SIGNATURE & STAMP
      </div>
    </div>
  </div>
</div>

<script>
  // Auto-trigger print dialog after a short delay to ensure fonts/images are ready
  window.onload = () => {
    setTimeout(() => {
      // window.print();
    }, 1000);
  };
</script>

</body>
</html>
  `;
};

function numberToWords(num: number): string {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if ((num = Math.floor(num)).toString().length > 9) return 'overflow';
  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += n[1] !== '00' ? (a[Number(n[1])] || b[parseInt(n[1][0])] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += n[2] !== '00' ? (a[Number(n[2])] || b[parseInt(n[2][0])] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += n[3] !== '00' ? (a[Number(n[3])] || b[parseInt(n[3][0])] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += n[4] !== '0' ? (a[Number(n[4])] || b[parseInt(n[4][0])] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += n[5] !== '00' ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[parseInt(n[5][0])] + ' ' + a[n[5][1]]) : '';
  return str.trim().toUpperCase();
}
