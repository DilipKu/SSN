import React from 'react';
import PageHeader from '../components/luxury/PageHeader';
import { motion } from 'motion/react';

export default function CareInstructionsPage() {
  const careSections = [
    {
      title: "Garment Care Guide",
      content: [
        {
          subtitle: "General Instructions",
          text: "Kirdaar Celebrations products are crafted with premium fabrics and intricate detailing. To ensure the longevity of your heirloom pieces, please follow these general care guidelines:\n\n• Always prefer professional dry cleaning for ethnic wear, especially those with embroidery, sequins, or beadwork.\n• Store garments in a cool, dry place away from direct sunlight to prevent color fading.\n• Use padded hangers for heavy lehengas and sarees to maintain their shape.\n• Handle embellishments with care to avoid snagging or loosening of threads."
        },
        {
          subtitle: "Washing & Cleaning",
          text: "• Do not machine wash or hand wash unless explicitly mentioned on the product tag.\n• Avoid using harsh detergents, bleaches, or fabric softeners.\n• For minor stains, consult a professional dry cleaner immediately rather than attempting home remedies."
        },
        {
          subtitle: "Ironing & Steaming",
          text: "• Use low heat settings for ironing. Always iron on the reverse side of the fabric.\n• For garments with heavy embroidery or sequins, use a steam iron at a distance or place a thin cotton cloth between the iron and the garment.\n• Avoid direct contact of the iron with zari work or delicate embellishments."
        }
      ]
    },
    {
      title: "Artisanal Disclaimer & Representation",
      content: [
        {
          subtitle: "Product Representation",
          text: "We make every effort to display products as accurately as possible. However, please acknowledge that:\n\n• Slight variations in color may occur due to photography lighting, screen resolution, and device display settings.\n• Embroidery, zari work, sequins, beadwork, prints, textures, and handcrafted detailing may contain minor irregularities that are inherent characteristics of artisanal craftsmanship and not considered defects."
        },
        {
          subtitle: "Handcrafted Details",
          text: "Many of our products feature hand embroidery, sequins, beadwork, and artisanal prints. These elements are delicate and should be handled with utmost care. Minor variations are a mark of authenticity and artisanal heritage."
        },
        {
          subtitle: "Fabric & Color",
          text: "• Natural fabrics may have slight variations in texture and weave.\n• Slight color variations may occur due to traditional dyeing processes.\n• We recommend dry cleaning to preserve the vibrancy of the colors and the integrity of the fabric."
        }
      ]
    },
    {
      title: "Storage Recommendations",
      content: [
        {
          subtitle: "Preserving Your Heritage Pieces",
          text: "• Store heavy garments like Lehengas and Bridal Sarees in breathable cotton garment bags.\n• Avoid storing in plastic covers for extended periods as they can trap moisture and cause damage.\n• Periodically air out your stored garments to maintain fabric freshness.\n• Keep garments away from moisture, perfumes, and excessive heat."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader 
        title="Care Instructions" 
        subtitle="Preserving the beauty and longevity of your handcrafted Kirdaar pieces."
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: 'Care Instructions' }
        ]}
      />

      <div className="global-container py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {careSections.map((section, sectionIdx) => (
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
            <p className="text-sm text-primary font-medium">Need more specific care advice?</p>
            <p className="text-xs text-muted-foreground">
              Our styling experts are here to help. Contact us at <a href="mailto:avneesh.kumar@kirdaarcelebrations.com" className="text-secondary font-bold underline">avneesh.kumar@kirdaarcelebrations.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
