import React from 'react';
import PageHeader from '../components/luxury/PageHeader';
import { motion } from 'motion/react';

export default function PrivacyPage() {
  const policySections = [
    {
      title: "Special Product Terms for Kirdaar Celebrations",
      content: [
        {
          subtitle: "Introduction",
          text: "Products offered by Kirdaar Celebrations are carefully curated occasion-based ethnic fashion garments designed for celebrations, weddings, festive events, cultural occasions, parties, and special gatherings.\n\nDue to the premium nature, craftsmanship, detailing, fabrics, embroidery, and occasion-focused usage of our products, the following special terms shall apply to all purchases made through Kirdaar Celebrations.\n\nBy purchasing products from our website, customers agree to the terms mentioned below."
        },
        {
          subtitle: "Product Representation",
          text: "We make every effort to display products as accurately as possible. However, customers acknowledge that:\n\n• Slight variations in color may occur due to photography lighting, screen resolution, and device display settings.\n• Embroidery, zari work, sequins, beadwork, prints, textures, and handcrafted detailing may contain minor irregularities that are inherent characteristics of artisanal craftsmanship and not considered defects.\n• Product styling images may include additional accessories used for presentation purposes only unless specifically mentioned in the product description."
        },
        {
          subtitle: "Product Availability",
          text: "All collections are subject to stock availability.\n\nIn rare situations involving inventory mismatch, manufacturing issues, logistics constraints, or quality inspection failure, Kirdaar Celebrations reserves the right to cancel the order, offer an alternate product, or provide store credit or refund at its discretion."
        },
        {
          subtitle: "Sizing & Fit Responsibility",
          text: "Customers are strongly advised to carefully review product descriptions and refer to the size chart before placing orders. As stitching, alteration, and customization services are not offered by Kirdaar Celebrations:\n\n• Customers are solely responsible for selecting the correct size.\n• Minor fitting adjustments after purchase shall remain the customer's responsibility.\n\nKirdaar Celebrations shall not be liable for incorrect size selection by the customer or alteration costs incurred after delivery."
        },

        {
          subtitle: "Care Instructions",
          text: "Many products may include delicate fabrics, embellishments, embroidery, sequins, beadwork, prints, and handcrafted detailing. Customers are advised to:\n\n• Prefer dry cleaning where applicable\n• Store garments carefully\n• Avoid direct exposure to moisture and excessive heat\n• Handle embellishments and embroidery with care\n\nKirdaar Celebrations shall not be responsible for damage caused due to improper handling, washing, storage, or alterations after delivery."
        },
        {
          subtitle: "Delivery Timelines",
          text: "Estimated delivery timelines:\n\n• Domestic Orders: Approximately 7 business days\n• International Orders: Approximately 15 business days\n\nDelivery timelines may vary during festive seasons, public holidays, peak order periods, or courier/customs delays."
        },
        {
          subtitle: "International Orders",
          text: "For international orders, customers are responsible for customs duties, import taxes, and local levies applicable in their country. Delivery delays due to customs clearance are beyond the control of Kirdaar Celebrations."
        },
        {
          subtitle: "Limitation of Liability",
          text: "Kirdaar Celebrations shall not be liable for event-related losses arising from delayed deliveries, third-party tailoring or alteration outcomes, minor handmade irregularities, or delays caused by logistics or customs authorities. Customers are encouraged to place orders well in advance of their planned occasions or events."
        },
        {
          subtitle: "Intellectual Property",
          text: "All product designs, product images, website content, branding materials, logos, and marketing creatives remain the intellectual property of Kirdaar Celebrations. Unauthorized reproduction or commercial usage is strictly prohibited."
        },
        {
          subtitle: "Governing Jurisdiction",
          text: "These Special Product Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts located in Roorkee, Uttarakhand."
        }
      ]
    },
    {
      title: "Cash on Delivery (COD) Policy for Kirdaar Celebrations",
      content: [
        {
          subtitle: "Introduction",
          text: "Kirdaar Celebrations offers Cash on Delivery (COD) as a payment option for selected locations within India, subject to service availability and operational feasibility. By selecting Cash on Delivery as the payment method, customers agree to the terms and conditions mentioned below."
        },
        {
          subtitle: "COD Availability",
          text: "Cash on Delivery service is available only for selected pin codes and delivery locations within India. Kirdaar Celebrations reserves the right to enable or disable COD service for specific locations, restrict COD availability for certain products or order values, or refuse COD orders based on operational limitations or order history."
        },
        {
          subtitle: "Order Confirmation for COD Orders",
          text: "For COD orders, customers may receive confirmation via SMS, WhatsApp, Phone, or Email. Failure to respond to verification requests may result in order cancellation."
        },
        {
          subtitle: "Valid Contact Information",
          text: "Customers placing COD orders must provide correct full name, accurate shipping address, and a valid mobile number. Orders with incomplete or incorrect information may be cancelled without prior notice."
        },
        {
          subtitle: "COD Order Acceptance",
          text: "Kirdaar Celebrations reserves the right to reject or cancel COD orders in cases of repeated order refusals, fake or suspicious orders, high-value order risk assessment, or non-serviceable locations."
        },
        {
          subtitle: "Payment at the Time of Delivery",
          text: "Customers are required to make full payment at the time of delivery before accepting the package. Accepted payment methods may include cash or UPI payment to the delivery agent (if supported)."
        },
        {
          subtitle: "Failed Delivery Attempts",
          text: "If a customer refuses delivery without valid reason, is unavailable repeatedly, or fails to accept the order after multiple attempts, Kirdaar Celebrations reserves the right to cancel the order and restrict future COD access."
        }
      ]
    },

    {
      title: "Privacy Policy",
      content: [
        {
          subtitle: "Information We Collect",
          text: "We may collect name, email address, phone number, shipping address, billing information, IP address, and device/browser information."
        },
        {
          subtitle: "Use of Information",
          text: "Customer information may be used for order processing, shipping updates, customer support, marketing communications, website analytics, and fraud prevention."
        },
        {
          subtitle: "Marketing Consent",
          text: "By using our website, users may receive promotional emails, SMS campaigns, and WhatsApp notifications. Users may opt out anytime."
        },
        {
          subtitle: "Cookies & Tracking",
          text: "Our website uses Cookies, Google Analytics, and Meta/Facebook Pixel to help improve website performance and customer experience."
        }
      ]
    },
    {
      title: "Warranty Claim Policy for Kirdaar Celebrations",
      content: [
        {
          subtitle: "Introduction",
          text: "At Kirdaar Celebrations, we are committed to delivering quality products crafted with attention to detail, design, and workmanship. This Warranty Claim Policy outlines the terms and process for reporting manufacturing defects or quality-related concerns associated with products purchased through our website.\n\nBy purchasing products from Kirdaar Celebrations, customers agree to the terms mentioned in this policy."
        },
        {
          subtitle: "Scope of Warranty Coverage",
          text: "This policy covers genuine manufacturing defects identified at the time of delivery or during initial inspection of the product.\n\nWarranty claims may be considered only for:\n• Manufacturing defects\n• Stitching defects\n• Fabric damage existing prior to usage\n• Incorrect product received\n• Major workmanship defects"
        },
        {
          subtitle: "Warranty Claim Reporting Timeline",
          text: "Customers must report warranty-related concerns within 30 days from the date of delivery. Claims raised after the specified timeline may not be eligible for review or approval."
        },
        {
          subtitle: "Mandatory Requirements for Claim Submission",
          text: "To initiate a warranty claim, customers must provide:\n• Order ID\n• Registered mobile number or email address\n• Clear photographs of the product\n• Images/videos clearly showing the issue\n• Packaging images (if applicable)\n\nIncomplete claims may experience delays or rejection."
        },
        {
          subtitle: "Claim Review Process",
          text: "Once a warranty claim is submitted:\n• Our quality team will review the claim details.\n• Additional information or images may be requested.\n• The product may require physical inspection before final approval.\n• Customers may be requested to return the product for verification.\n\nKirdaar Celebrations reserves the right to determine the validity of all claims after inspection."
        },
        {
          subtitle: "Resolution Options",
          text: "Approved warranty claims may be resolved through any of the following methods at the discretion of Kirdaar Celebrations:\n• Replacement product\n• Exchange with another available product\n• Store credit for future purchases\n• Repair assistance (where applicable)\n\nMonetary refunds may not be provided unless specifically approved by Kirdaar Celebrations."
        },
        {
          subtitle: "Non-Covered Conditions",
          text: "The warranty claim policy shall not apply in the following circumstances:\n• Damage caused after delivery\n• Products that have been worn, washed, altered, or misused\n• Normal wear and tear\n• Minor thread variations or handcrafted irregularities\n• Color variation due to photography or screen settings\n• Damage caused by improper storage, ironing, washing, or dry cleaning\n• Products altered by third-party tailors or service providers\n• Claims raised beyond the permitted reporting timeline\n• Dissatisfaction based on personal preference or fitting expectations"
        },
        {
          subtitle: "Handcrafted Product Disclaimer",
          text: "Many products offered by Kirdaar Celebrations may include hand embroidery, sequins, beadwork, zari work, print variations, and artisanal craftsmanship. Minor irregularities associated with handcrafted products are considered part of the product's unique aesthetic and shall not be treated as manufacturing defects."
        },
        {
          subtitle: "Customer Responsibilities",
          text: "Customers are advised to:\n• Inspect products immediately upon delivery\n• Follow garment care instructions carefully\n• Preserve original packaging until inspection is completed\n• Avoid using or altering products before reporting concerns"
        },
        {
          subtitle: "Reverse Shipping for Claims",
          text: "If requested by Kirdaar Celebrations, customers may need to ship the product back for inspection. Reverse shipping responsibilities shall be communicated during claim processing. Unauthorized returns without prior approval may not be accepted."
        },
        {
          subtitle: "Fraudulent or Misleading Claims",
          text: "Kirdaar Celebrations reserves the right to reject fraudulent or misleading claims, restrict future purchases or services, and initiate appropriate legal action in cases of misuse or abuse of the warranty process."
        },
        {
          subtitle: "Limitation of Liability",
          text: "Kirdaar Celebrations shall not be liable for:\n• Indirect or consequential damages\n• Event-related losses due to delayed claims or deliveries\n• Alteration expenses\n• Third-party repair costs\n• Courier-related damages occurring after delivery confirmation"
        },
        {
          subtitle: "Policy Modification Rights",
          text: "Kirdaar Celebrations reserves the right to modify, update, revise, or discontinue this Warranty Claim Policy at any time without prior notice."
        },
        {
          subtitle: "Contact Information",
          text: "For warranty-related support, customers may contact:\nEmail: avneesh.kumar@kirdaarcelebrations.com\nPhone / WhatsApp: +91-9871434777\nSupport Availability: 24×7"
        }
      ]
    },
    {
      title: "Policies Overview",
      content: [
        {
          subtitle: "Shipping & Delivery Policy",
          text: "Domestic delivery within 7 business days; International within 15 business days. International customers are responsible for customs duties and taxes."
        },
        {
          subtitle: "Product Quality Assurance",
          text: "Each product undergoes inspection before dispatch. Manufacturing defects must be reported within 3 days."
        },
        {
          subtitle: "Disclaimer Policy",
          text: "Product colors may slightly vary from images displayed online. Handcrafted products may contain minor irregularities."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader
        title="Privacy & Policies"
        subtitle="Our comprehensive terms, privacy guidelines, and purchase policies."
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: 'Privacy Policy' }
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
            <p className="text-sm text-primary font-medium">Have questions about our policies?</p>
            <p className="text-xs text-muted-foreground">
              Please contact our support team at <a href="mailto:avneesh.kumar@kirdaarcelebrations.com" className="text-secondary font-bold underline">avneesh.kumar@kirdaarcelebrations.com</a>
            </p>
            <div className="text-[10px] text-slate-400 italic pt-4">
              Last Updated: May 2026. Kirdaar Celebrations reserves all rights.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
