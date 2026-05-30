import React from 'react';
import PageHeader from '../components/luxury/PageHeader';
import { motion } from 'motion/react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { HelpCircle, Mail, MessageCircle } from 'lucide-react';

export default function FAQPage() {
  const faqSections = [
    {
      title: "Orders & Shopping",
      questions: [
        {
          q: "How do I place an order?",
          a: "You can place an order directly through our website by selecting your preferred product, choosing the required size (if applicable), adding it to your cart, and proceeding to secure checkout. You will receive an order confirmation via email or SMS once confirmed."
        },
        {
          q: "Do I need to create an account to place an order?",
          a: "No, you may place an order as a guest user. However, creating an account helps you track orders easily, save addresses, access order history, and receive exclusive updates and offers."
        },
        {
          q: "How can I track my order?",
          a: "Once your order is shipped, tracking details will be shared through email, SMS, or WhatsApp. You can use the provided tracking link to monitor the delivery status in real-time."
        }
      ]
    },
    {
      title: "Products & Sizing",
      questions: [
        {
          q: "Are the product colors exactly the same as shown in the images?",
          a: "We make every effort to display product colors accurately. However, slight variations may occur due to studio lighting, professional photography, or your specific screen resolution and display settings."
        },
        {
          q: "Do you provide size charts?",
          a: "Yes, detailed size charts are available on all applicable product pages to help you choose the most suitable fit."
        },
        {
          q: "Are your products ready stock or made-to-order?",
          a: "All products listed on our website are ready stock unless explicitly mentioned as made-to-order on the product page."
        },
        {
          q: "Do you offer customization or stitching services?",
          a: "Currently, we do not offer product customization, personalized orders, stitching, or alteration services."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      questions: [
        {
          q: "Do you ship internationally?",
          a: "Yes, we offer both domestic and international shipping to selected countries across the globe."
        },
        {
          q: "What is the estimated delivery time?",
          a: "Domestic orders typically arrive within 7 business days, while international orders take approximately 15 business days. Timelines may vary during festive seasons or due to courier delays."
        },
        {
          q: "Will I need to pay customs duties for international orders?",
          a: "International customers are responsible for any customs duties, import taxes, or local government charges determined by the destination country."
        }
      ]
    },
    {
      title: "Returns, Refunds & Exchanges",
      questions: [
        {
          q: "What is your return policy?",
          a: "Returns are accepted within 7 days of delivery only for damaged, defective, or incorrectly delivered products."
        },
        {
          q: "Do you offer refunds?",
          a: "We do not provide monetary refunds. Approved returns are processed through Store Credit or a Replacement Product."
        },
        {
          q: "Do you offer exchanges?",
          a: "Yes, exchanges are accepted within 7 days of delivery, subject to stock availability. Please note that reverse shipping charges are to be borne by the customer."
        },
        {
          q: "How do I request a return or exchange?",
          a: "Contact our support team with your Order ID, product images/videos, and a description of the issue via email (avneesh.kumar@kirdaarcelebrations.com) or WhatsApp (+91-9871434777)."
        },
        {
          q: "What products are not eligible for return or exchange?",
          a: "Used or washed products, products without tags, accessories (unless defective), and requests raised after 7 days of delivery are not eligible."
        }
      ]
    },
    {
      title: "Payments",
      questions: [
        {
          q: "Which payment methods are accepted?",
          a: "We accept UPI, Credit Cards, Debit Cards, Net Banking, and Cash on Delivery (COD) for selected locations."
        },
        {
          q: "Is Cash on Delivery (COD) available?",
          a: "Yes, COD is available for selected locations based on delivery pin code, order history, and operational feasibility."
        },
        {
          q: "Is online payment secure?",
          a: "Yes. All online payments are securely processed through Razorpay using encrypted systems. We do not store sensitive card or banking information."
        }
      ]
    },
    {
      title: "Product Quality",
      questions: [
        {
          q: "What should I do if I receive a defective product?",
          a: "Manufacturing defects must be reported within 3 days of delivery with clear images/videos and packaging photos. Our team will review and assist you immediately."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader 
        title="Frequently Asked Questions" 
        subtitle="Find answers to common questions about our masterpieces and services."
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: 'FAQs' }
        ]}
      />

      <div className="global-container py-16">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-6">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif text-primary">Still Need Help?</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If your query is not covered here, please feel free to contact our support team. We are always happy to assist you.
                  </p>
                </div>
                <div className="pt-4 space-y-4">
                  <a href="mailto:avneesh.kumar@kirdaarcelebrations.com" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-600">avneesh.kumar@kirdaarcelebrations.com</span>
                  </a>
                  <a href="tel:+919871434777" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-600">+91-9871434777</span>
                  </a>
                </div>
              </div>

              <div className="p-8 border border-slate-100 rounded-3xl">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Support Hours</h3>
                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                  <span className="text-xs text-slate-500">Availability</span>
                  <span className="text-xs font-bold text-primary">24 × 7</span>
                </div>
                <p className="mt-4 text-[10px] text-slate-400 italic">
                  We celebrate with you every day, ensuring your Kirdaar journey is seamless.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Accordions */}
          <div className="lg:col-span-8 space-y-16">
            {faqSections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-secondary" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">{section.title}</h3>
                </div>
                
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {section.questions.map((faq, i) => (
                    <AccordionItem 
                      key={i} 
                      value={`${idx}-${i}`}
                      className="border border-slate-100 rounded-2xl px-6 bg-white overflow-hidden"
                    >
                      <AccordionTrigger className="text-left font-serif text-lg text-primary hover:no-underline py-6">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-500 leading-relaxed pb-6">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
