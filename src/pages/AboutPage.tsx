import React from 'react';
import PageHeader from '../components/luxury/PageHeader';
import { motion } from 'motion/react';
import { Mail, Phone, CheckCircle2, ShieldCheck, Truck, Headphones, Star, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader 
        title="About Kirdaar" 
        subtitle="Celebrate Tradition. Celebrate Elegance. Celebrate Your Kirdaar."
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: 'About Us' }
        ]}
      />

      <div className="global-container py-16 space-y-24">
        {/* Intro Section */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <img 
                src="/logo.png" 
                alt="Kirdaar Celebrations Logo" 
                className="h-24 w-auto object-contain rounded-xl shadow-lg"
              />
              <div className="space-y-4">
                <span className="text-secondary font-bold tracking-[0.3em] uppercase text-xs">Our Essence</span>
                <h2 className="text-4xl font-serif text-primary leading-tight">Welcome to Kirdaar Celebrations</h2>
              </div>
            </div>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg italic font-light text-primary/80">
                A destination where tradition, elegance, and timeless Indian craftsmanship come together to celebrate every special moment of life.
              </p>
              <p>
                At Kirdaar Celebrations, we believe that ethnic fashion is more than just clothing — it is an expression of identity, culture, confidence, and celebration. Every saree, lehenga, gown, and ethnic ensemble we curate is designed to reflect grace, individuality, and the beauty of Indian traditions.
              </p>
              <p>
                Founded with a passion for celebrating the richness of Indian ethnic wear, Kirdaar Celebrations brings together carefully selected collections that blend traditional artistry with contemporary aesthetics. Whether it is a wedding celebration, festive gathering, family occasion, or cultural event, our collections are created to make every moment memorable.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/18166782/pexels-photo-18166782.jpeg" 
                alt="Kirdaar Tradition" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-primary p-10 text-white hidden md:block rounded-xl shadow-xl">
              <p className="text-4xl font-serif mb-1">Authentic</p>
              <p className="text-xs uppercase tracking-[0.2em] opacity-70">Craftsmanship</p>
            </div>
          </motion.div>
        </section>

        {/* Our Collection */}
        <section className="bg-[#FAF9F6] py-20 -mx-[max(1rem,calc((100vw-1280px)/2))] px-[max(1rem,calc((100vw-1280px)/2))]">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-serif text-primary">Our Masterpiece Collection</h2>
              <p className="text-muted-foreground">A thoughtfully curated range of ethnic excellence.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                'Sarees', 'Lehengas', 'Gowns', 
                'Ethnic Wear', 'Bridal Wear', 'Fashion Accessories'
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 border border-slate-100 shadow-sm rounded-lg hover:shadow-md transition-all group"
                >
                  <p className="text-primary font-serif group-hover:text-secondary transition-colors">{item}</p>
                </motion.div>
              ))}
            </div>

            <div className="pt-10 space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-bold">Uncompromising Standards</p>
              <div className="flex flex-wrap justify-center gap-8">
                {['Fabric Quality', 'Design Detailing', 'Craftsmanship', 'Comfort', 'Elegance'].map((standard) => (
                  <div key={standard} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium text-primary/80">{standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Kirdaar */}
        <section className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-primary text-white space-y-8 rounded-3xl overflow-hidden relative group"
          >
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-serif">Our Vision</h3>
              <p className="text-white/80 leading-relaxed">
                Our vision is to become a trusted name in ethnic fashion by delivering products that inspire confidence, celebrate individuality, and preserve the beauty of Indian culture through fashion.
              </p>
              <p className="text-white/80 leading-relaxed">
                We aim to create an experience where customers not only shop for clothing, but also connect with stories, traditions, emotions, and celebrations.
              </p>
            </div>
            <Award className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 border-2 border-primary/10 space-y-8 rounded-3xl"
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-serif text-primary">Celebrating Every Kirdaar</h3>
              <p className="text-muted-foreground leading-relaxed">
                The word <span className="text-primary font-bold italic">“Kirdaar”</span> represents character, identity, and the unique role every individual plays in life’s celebrations. Through our collections, we aspire to empower every customer to express their own elegance, confidence, and personality.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you are dressing for a wedding, festive occasion, cultural celebration, or cherished family event, Kirdaar Celebrations is here to become a part of your memorable journey.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Commitment Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-serif text-primary">Our Commitment</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Customer satisfaction and product quality remain at the heart of everything we do.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: 'Quality Checks', desc: 'Every masterpiece undergoes rigorous quality inspection.' },
              { icon: Star, title: 'Seamless Shopping', desc: 'Secure and fluid experience from selection to checkout.' },
              { icon: Headphones, title: 'Reliable Support', desc: 'Our team is here to assist with your every celebration need.' },
              { icon: Truck, title: 'Handled with Care', desc: 'Ensuring your package arrives as special as the occasion.' }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white border border-slate-100 rounded-2xl space-y-4 hover:border-secondary/30 transition-all shadow-sm"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-primary">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-primary py-20 -mx-[max(1rem,calc((100vw-1280px)/2))] px-[max(1rem,calc((100vw-1280px)/2))] text-white">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-serif">Why Choose Kirdaar?</h2>
              <div className="grid gap-6">
                {[
                  'Carefully curated ethnic fashion collections',
                  'Elegant traditional and contemporary designs',
                  'Quality-focused product selection',
                  'Secure payment options',
                  'Domestic and international shipping',
                  'Customer-first service approach'
                ].map((reason, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                    </div>
                    <span className="text-white/80">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <img 
                src="https://images.pexels.com/photos/14072957/pexels-photo-14072957.jpeg" 
                alt="Why Choose Us" 
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        {/* Connect With Us */}
        <section className="text-center py-16 space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif text-primary">Connect With Us</h2>
            <p className="text-muted-foreground">We would love to be a part of your celebrations.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
            <a href="mailto:avneesh.kumar@kirdaarcelebrations.com" className="flex items-center justify-center gap-4 group">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Email Support</p>
                <p className="text-primary font-medium">avneesh.kumar@kirdaarcelebrations.com</p>
              </div>
            </a>

            <a href="tel:+919871434777" className="flex items-center justify-center gap-4 group">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Phone className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Call Support</p>
                <p className="text-primary font-medium">+91-9871434777</p>
              </div>
            </a>
          </div>

          <div className="pt-16 border-t border-slate-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif text-primary italic mb-6">Celebrate Tradition. Celebrate Elegance. Celebrate Your Kirdaar.</h3>
            <p className="text-slate-400 text-sm">Thank you for choosing Kirdaar Celebrations.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
