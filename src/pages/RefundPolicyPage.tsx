import React from 'react';
import PageHeader from '../components/luxury/PageHeader';
import { motion } from 'motion/react';

export default function RefundPolicyPage() {
  const policySections = [
    {
      title: "Refund, Return & Exchange Policy",
      content: [
        {
          subtitle: "Return & Exchange Policy",
          text: "Returns shall only be accepted in cases of damaged product received, manufacturing defect, or incorrect product delivered. Return requests must be raised within 7 days from the date of delivery."
        },
        {
          subtitle: "Exchange Conditions",
          text: "Exchange requests are subject to stock availability and must be requested within 7 days of delivery. Require the product to be unused, unwashed, and in original condition with tags intact. Customers shall bear all reverse shipping charges for exchange requests."
        },
        {
          subtitle: "Non-Returnable Conditions",
          text: "Products shall not qualify for return or exchange under the following circumstances:\n\n• Product has been worn or used\n• Product tags are removed\n• Product has been altered by customer or third party\n• Return request is raised after the permitted timeline\n• Damage occurs after delivery\n• Minor color variation due to photography or screen settings\n• Dissatisfaction arising from personal preference after purchase"
        },
        {
          subtitle: "Product Inspection Upon Delivery",
          text: "Customers are advised to inspect products immediately upon delivery. Any issue relating to damage, manufacturing defects, missing components, or incorrect item must be reported within 3 days of delivery along with clear product photographs/videos, packaging images, and order details. Claims raised after the specified reporting period may not be accepted."
        },
        {
          subtitle: "Refund Policy",
          text: "We do not provide monetary refunds. Approved returns are compensated through Store Credit or Replacement Products. Store credit can be used for future purchases on Kirdaar Celebrations."
        },
        {
          subtitle: "Return & Exchange for COD Orders",
          text: "COD orders are subject to the same Return and Exchange policies. Approved returns for COD orders shall be processed through Store Credit or Replacement Product. No cash refund shall be provided for COD orders."
        },
        {
          subtitle: "Order Cancellation Policy",
          text: "Orders may be cancelled before dispatch only. Kirdaar Celebrations reserves the right to cancel orders for payment failure, unavailability, or fraudulent activity."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader 
        title="Refund & Return Policy" 
        subtitle="Our guidelines for returns, exchanges, and order cancellations."
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: 'Refund Policy' }
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
            <p className="text-sm text-primary font-medium">Need help with a return or exchange?</p>
            <p className="text-xs text-muted-foreground">
              Please contact our support team at <a href="mailto:avneesh.kumar@kirdaarcelebrations.com" className="text-secondary font-bold underline">avneesh.kumar@kirdaarcelebrations.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
