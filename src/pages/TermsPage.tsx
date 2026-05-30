import React from 'react';
import PageHeader from '../components/luxury/PageHeader';
import { motion } from 'motion/react';

export default function TermsPage() {
  const sections = [
    {
      title: 'Usage Terms',
      content: 'By accessing and using the Kirdaar Celebrations website, you agree to comply with and be bound by these Terms and Conditions. The content of this site is for your general information and use only, and is subject to change without notice.'
    },
    {
      title: 'Orders & Payments',
      content: 'All orders placed through our website are subject to acceptance and availability. We reserve the right to refuse service to anyone for any reason at any time. Payment must be received in full before an order is dispatched for shipping.'
    },
    {
      title: 'Returns & Refunds',
      content: 'Due to the customized and delicate nature of our couture pieces, returns are generally not accepted unless the product is damaged or defective upon arrival. Please review our specific Return Policy for detailed information on the process.'
    },
    {
      title: 'Liability & Intellectual Property',
      content: 'All designs, logos, and content on this website are the intellectual property of Kirdaar Celebrations. Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.'
    },
    {
      title: 'Business Information',
      content: 'Business Name: Kirdaar Celebrations\nBusiness Type: Partnership Firm\nRegistered Address: Mangal Vihar, Sunehara Main Road, Roorkee, Uttarakhand, India\nCustomer Support Email: avneesh.kumar@kirdaarcelebrations.com\nCustomer Support Contact: +91-9871434777\nGSTIN: 05ABBFK4539N2Z1'
    },
    {
      title: 'Eligibility',
      content: 'By using this website, you confirm that you are legally capable of entering binding contracts, the information provided is accurate, and you will use the website only for lawful purposes.'
    },
    {
      title: 'User Conduct',
      content: 'Users shall not misuse the website, attempt unauthorized access, use false identities, or upload harmful or malicious content.'
    },
    {
      title: 'Limitation of Liability',
      content: 'Kirdaar Celebrations shall not be liable for indirect or consequential damages, delays caused by courier/logistics partners, or losses due to force majeure events.'
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader 
        title="Terms & Conditions" 
        subtitle="Please read these terms carefully before using our services or placing an order."
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: 'Terms & Conditions' }
        ]}
      />

      <div className="global-container py-16">
        <div className="max-w-3xl space-y-12">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-serif text-primary">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {section.content}
              </p>
              {i < sections.length - 1 && <div className="h-[1px] w-12 bg-secondary/20 pt-4" />}
            </motion.div>
          ))}
          
          <div className="pt-12 text-xs text-muted-foreground italic">
            Last Updated: May 2026. Use of this site implies acceptance of these terms.
          </div>
        </div>
      </div>
    </div>
  );
}
