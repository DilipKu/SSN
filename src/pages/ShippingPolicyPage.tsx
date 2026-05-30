import React from 'react';
import PageHeader from '../components/luxury/PageHeader';
import { motion } from 'motion/react';

export default function ShippingPolicyPage() {
  const policySections = [
    {
      title: "Shipping & Delivery Policy",
      content: [
        {
          subtitle: "Domestic Shipping",
          text: "At Kirdaar Celebrations, we strive to deliver your orders as quickly and efficiently as possible. For domestic orders within India, the estimated delivery timeline is approximately 7 business days.\n\nPlease note that delivery timelines may vary during festive seasons, public holidays, peak order periods, or due to courier delays beyond our control."
        },
        {
          subtitle: "International Shipping",
          text: "For our global patrons, we offer international shipping with an estimated delivery timeline of approximately 15 business days. Delivery delays due to customs clearance are beyond the control of Kirdaar Celebrations."
        },
        {
          subtitle: "Customs, Duties & Taxes",
          text: "For international orders, customers are solely responsible for any customs duties, import taxes, and local levies applicable in their respective countries. These charges are not included in the product price or shipping cost and must be paid by the recipient upon delivery."
        },
        {
          subtitle: "Order Tracking",
          text: "Once your order is dispatched, you will receive a confirmation email and/or message with tracking details to monitor your shipment's progress."
        }
      ]
    },
    {
      title: "Returns & Exchanges",
      content: [
        {
          subtitle: "Return Policy",
          text: "Returns are only accepted in cases of damaged products received, manufacturing defects, or incorrect products delivered. All return requests must be raised within 7 days from the date of delivery."
        },
        {
          subtitle: "Exchange Conditions",
          text: "Exchange requests are subject to stock availability and must be requested within 7 days of delivery. The product must be unused, unwashed, and in its original condition with all tags intact. Customers shall bear all reverse shipping charges for exchange requests."
        },
        {
          subtitle: "Non-Returnable Conditions",
          text: "Products shall not qualify for return or exchange if:\n• The product has been worn or used\n• Product tags are removed\n• The product has been altered by the customer or a third party\n• The return request is raised after the 7-day timeline\n• Damage occurs after delivery\n• Minor color variations occur due to photography or screen settings"
        },
        {
          subtitle: "Refund Policy",
          text: "We do not provide monetary refunds. Approved returns are compensated through Store Credit or Replacement Products. Store credit can be used for future purchases on Kirdaar Celebrations."
        },
        {
          subtitle: "Sizing & Fit Responsibility",
          text: "Customers are strongly advised to carefully review product descriptions and refer to the size chart before placing orders. As stitching, alteration, and customization services are not offered by Kirdaar Celebrations, customers are solely responsible for selecting the correct size. Minor fitting adjustments after purchase shall remain the customer's responsibility."
        }
      ]
    },
    {
      title: "Cash on Delivery (COD) Policy",
      content: [
        {
          subtitle: "COD Availability",
          text: "Cash on Delivery is available for selected pin codes within India. We reserve the right to enable or disable COD service for specific locations or orders based on operational feasibility."
        },
        {
          subtitle: "Order Confirmation",
          text: "For COD orders, customers may receive confirmation via SMS, WhatsApp, or Phone. Failure to respond to verification requests may result in order cancellation."
        }
      ]
    },
    {
      title: "Order Cancellations",
      content: [
        {
          subtitle: "Cancellation Policy",
          text: "Orders may be cancelled before dispatch only. Kirdaar Celebrations reserves the right to cancel orders for payment failure, unavailability, or suspicious activity."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader 
        title="Shipping & Returns" 
        subtitle="Our global delivery timelines, shipping practices, and return guidelines."
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: 'Shipping & Returns' }
        ]}
      />

      <div className="global-container py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {policySections.map((section, sectionIdx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIdx * 0.1 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-secondary" />
                <h2 className="text-3xl font-serif text-primary">{section.title}</h2>
              </div>
              
              <div className="grid gap-8 pl-4 border-l border-slate-100">
                {section.content.map((item, itemIdx) => (
                  <div key={itemIdx} className="space-y-3">
                    <h3 className="text-lg font-serif text-secondary">{item.subtitle}</h3>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm">
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          
          <div className="pt-12 p-8 bg-slate-50 rounded-2xl text-center space-y-4">
            <p className="text-sm text-primary font-medium">Questions about your shipment?</p>
            <p className="text-xs text-muted-foreground">
              Contact our logistics team at <a href="mailto:avneesh.kumar@kirdaarcelebrations.com" className="text-secondary font-bold underline">avneesh.kumar@kirdaarcelebrations.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
