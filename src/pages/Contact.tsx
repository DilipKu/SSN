import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Heading, Text } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Sparkles, MessageSquare, ChevronDown, Check, Send, Award, Clock } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    occasion: 'Festival Gifting',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" as const }
  };

  const contactCards = [
    {
      title: 'Phone Support',
      desc: 'Speak directly with our concierge team for custom suggestions.',
      info: '+91 98765 43210',
      actionText: 'Call Now',
      href: 'tel:+919876543210',
      icon: <Phone className="w-5 h-5 text-primary-gold" />
    },
    {
      title: 'WhatsApp Concierge',
      desc: 'Quick chat for orders, tracking, and fast query resolutions.',
      info: '+91 98765 43211',
      actionText: 'Chat on WhatsApp',
      href: 'https://wa.me/919876543211',
      icon: <MessageSquare className="w-5 h-5 text-primary-gold" />
    },
    {
      title: 'Email Queries',
      desc: 'Write to us for corporate queries, bills, or vendor partnerships.',
      info: 'care@sudarshansweets.com',
      actionText: 'Send Email',
      href: 'mailto:care@sudarshansweets.com',
      icon: <Mail className="w-5 h-5 text-primary-gold" />
    },
    {
      title: 'Corporate Flagship',
      desc: 'Visit our flagship sweet kitchen and executive offices.',
      info: 'Connaught Place, New Delhi',
      actionText: 'Get Directions',
      href: 'https://maps.google.com',
      icon: <MapPin className="w-5 h-5 text-primary-gold" />
    }
  ];

  const faqItems = [
    {
      question: 'What is your shipping timeline across India?',
      answer: 'We ship orders within 24 hours of preparation. Metro cities generally receive vacuum-sealed fresh deliveries within 2 to 3 business days, while other locations may take 4 to 5 business days.'
    },
    {
      question: 'How do you guarantee freshness during transit?',
      answer: 'All our sweets are packed in food-grade, airtight vacuum trays that prevent air entry and moisture loss. This preserves taste, texture, and aroma naturally, without any chemical preservatives.'
    },
    {
      question: 'Do you offer customized corporate gifting hampers?',
      answer: 'Yes, we specialize in high-end B2B corporate confections. We offer customization of wooden, brass, and velvet gift boxes, custom logo engraving, personalized greeting cards, and address list dispatch.'
    },
    {
      question: 'Can we place large wedding orders (Shagun box / sweets)?',
      answer: 'Absolutely. We offer complete custom wedding consultation, allowing you to sample sweets, design bespoke packaging matching your wedding theme, and coordinate fresh deliveries to the venue.'
    },
    {
      question: 'Do you ship sweets internationally?',
      answer: 'Currently, we ship to select international locations (US, UK, UAE, and Singapore) via express courier partnerships. International transit times range from 4 to 7 days depending on customs.'
    },
    {
      question: 'What is your refund or order return policy?',
      answer: 'As our confections are fresh food items, we do not accept returns. However, if your order arrives damaged or incomplete, contact our support within 24 hours of delivery, and we will issue a direct replacement or refund.'
    }
  ];

  const stores = [
    {
      name: 'Connaught Place Flagship',
      address: 'Block E, Inner Circle, Connaught Place, New Delhi, 110001',
      phone: '+91 98765 43210',
      hours: '9:00 AM – 10:00 PM (Daily)',
      mapLink: 'https://maps.google.com'
    },
    {
      name: 'Galleria Market Store',
      address: 'First Floor, Sector 28, Galleria Market, Gurugram, 122002',
      phone: '+91 98765 43215',
      hours: '10:00 AM – 9:30 PM (Daily)',
      mapLink: 'https://maps.google.com'
    },
    {
      name: 'Sector 18 Flagship',
      address: 'Pocket K, Sector 18 Market, Noida, 201301',
      phone: '+91 98765 43218',
      hours: '9:30 AM – 10:00 PM (Daily)',
      mapLink: 'https://maps.google.com'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        occasion: 'Festival Gifting',
        message: ''
      });
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary-cream">
      <Navbar />

      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <section className="relative py-24 flex items-center justify-center overflow-hidden border-b border-secondary-sand/30 bg-[#1E0C05]">
          <div className="absolute inset-0 z-0 opacity-20">
            {/* Background texture or mandala */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,160,23,0.15)_0%,_transparent_65%)]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl space-y-6">
            <span className="text-primary-gold font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-gold" /> Dedicated Support
            </span>
            <Heading level={1} className="text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-cream leading-tight">
              Let’s Make Every <br/>
              <span className="text-primary-gold italic font-serif">Celebration Sweeter</span>
            </Heading>
            <Text className="text-secondary-cream/70 font-inter font-light max-w-xl mx-auto leading-relaxed">
              We are here to assist you with customized gifting, corporate hampers, wedding orders, order updates, and premium delivery care.
            </Text>
          </div>
        </section>

        {/* Section 2: Contact Info Cards */}
        <section className="py-16 container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactCards.map((card, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                className="bg-white p-6 rounded-2xl border border-secondary-sand/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                    {card.icon}
                  </div>
                  <h4 className="font-playfair font-bold text-lg text-text-brown">{card.title}</h4>
                  <p className="text-xs text-text-brown/60 font-inter leading-relaxed">{card.desc}</p>
                  <p className="text-sm font-bold text-primary font-inter">{card.info}</p>
                </div>
                <div className="pt-6">
                  <a href={card.href} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full border-secondary-sand text-text-brown hover:bg-secondary-cream">
                      {card.actionText}
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 3: Luxury Contact Form */}
        <section className="py-16 bg-white/40 border-y border-secondary-sand/30">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-3xl overflow-hidden border border-secondary-sand/50 shadow-xl">
              
              {/* Left Column: Form Info */}
              <div className="lg:col-span-4 bg-primary text-secondary-cream p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-[200px] h-[200px] rounded-full bg-primary-gold/5 blur-2xl pointer-events-none"></div>
                <div className="space-y-6 relative z-10 text-left">
                  <span className="text-primary-gold font-bold text-[10px] uppercase tracking-wider block">Gifting Consultation</span>
                  <Heading level={3} className="text-2xl font-bold text-white">Sweet Inquiries</Heading>
                  <p className="text-xs text-secondary-cream/70 font-inter leading-relaxed">
                    Planning a corporate campaign or family celebration? Fill out our form, and our design lead will contact you within 12 hours.
                  </p>
                </div>

                <div className="space-y-4 pt-8 relative z-10 text-left">
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-primary-gold" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary-gold">Pure Desi Ghee</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary-gold" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary-gold">Fast Dispatch Care</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Form */}
              <div className="lg:col-span-8 p-8 md:p-10 text-left">
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12 space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-md">
                      <Check className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-playfair font-bold text-2xl text-text-brown">Inquiry Received</h4>
                      <p className="text-sm text-text-brown/60 font-inter max-w-sm">
                        Thank you for reaching out. A packaging consultant will call or email you shortly to design your celebration boxes.
                      </p>
                    </div>
                    <Button onClick={() => setFormSubmitted(false)} className="bg-primary hover:bg-primary/95 text-secondary-cream border-none">
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Full Name *</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="E.g. Rajesh Kumar"
                          className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Email Address *</label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="E.g. rajesh@email.com"
                          className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Phone Number *</label>
                        <input 
                          type="tel" 
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="E.g. +91 98765 43210"
                          className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Occasion Type</label>
                        <select 
                          name="occasion"
                          value={formData.occasion}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-secondary-sand rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors appearance-none"
                          style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232B1B12' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundPosition: 'right 16px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                        >
                          <option value="Festival Gifting">Festival Gifting</option>
                          <option value="Corporate Orders">Corporate Orders</option>
                          <option value="Wedding Orders">Wedding Orders</option>
                          <option value="Bulk Orders">Bulk Orders</option>
                          <option value="Product Inquiry">Product Inquiry</option>
                          <option value="Delivery Support">Delivery Support</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Subject *</label>
                      <input 
                        type="text" 
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="E.g. Inquiry for Corporate Diwali Hampers"
                        className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs uppercase font-bold tracking-wider text-text-brown/70 font-inter">Message *</label>
                      <textarea 
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Describe your sweet requirement, estimated quantity, and event date..."
                        className="w-full bg-secondary-cream/30 border border-secondary-sand rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-secondary-cream border-none flex items-center justify-center gap-2 h-12">
                      Send Sweet Inquiry <Send className="w-4 h-4 text-primary-gold" />
                    </Button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Section 4: Store Showcase */}
        <section className="py-24 container mx-auto px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">Our Boutiques</span>
            <Heading level={2} className="text-3xl md:text-5xl font-bold text-text-brown">
              Visit Our Flagship Stores
            </Heading>
            <div className="w-12 h-[1.5px] bg-primary-gold mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group overflow-hidden rounded-2xl border border-secondary-sand/30 shadow-md bg-white">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/15014918/pexels-photo-15014918.jpeg" 
                  alt="Connaught Place Sweet Boutique" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 text-left space-y-2">
                <h4 className="font-playfair font-bold text-xl text-text-brown">Connaught Place Flagship</h4>
                <p className="text-xs text-text-brown/60 font-inter">Beautiful vintage store offering live counter sampling and direct gift packaging options.</p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-2xl border border-secondary-sand/30 shadow-md bg-white">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/31617910/pexels-photo-31617910.jpeg" 
                  alt="Galleria Market Boutique" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 text-left space-y-2">
                <h4 className="font-playfair font-bold text-xl text-text-brown">Galleria Market Gurugram</h4>
                <p className="text-xs text-text-brown/60 font-inter">State-of-the-art boutique housing premium sugar-free sections and our corporate design catalog table.</p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-2xl border border-secondary-sand/30 shadow-md bg-white">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/20699855/pexels-photo-20699855.jpeg" 
                  alt="Sector 18 Noida Boutique" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 text-left space-y-2">
                <h4 className="font-playfair font-bold text-xl text-text-brown">Sector 18 Noida Outlet</h4>
                <p className="text-xs text-text-brown/60 font-inter">Convenient store located right in Noida, featuring live baking, warm namkeens, and festive collection ranges.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Store Locator */}
        <section className="py-24 bg-white/40 border-y border-secondary-sand/30">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Directory Column */}
              <div className="lg:col-span-5 space-y-8">
                <div className="text-left space-y-4">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest block">Store Locator</span>
                  <Heading level={2} className="text-3xl md:text-4xl font-bold text-text-brown">Flagships Directory</Heading>
                  <p className="text-sm text-text-brown/70 font-inter leading-relaxed">
                    Stop by to sample our handcrafted range, check gift box samples, or consult directly with our managers for custom deliveries.
                  </p>
                </div>

                <div className="space-y-6">
                  {stores.map((store, i) => (
                    <div key={i} className="p-6 bg-white border border-secondary-sand/40 rounded-2xl text-left space-y-3 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-playfair font-bold text-lg text-text-brown">{store.name}</h4>
                      <p className="text-xs text-text-brown/70 font-inter flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{store.address}</span>
                      </p>
                      <p className="text-xs text-text-brown/70 font-inter flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{store.phone}</span>
                      </p>
                      <p className="text-xs text-text-brown/60 font-inter flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{store.hours}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Simulator Column */}
              <div className="lg:col-span-7 h-[450px] lg:h-[600px] w-full rounded-3xl overflow-hidden border border-secondary-sand/65 shadow-2xl relative">
                {/* Simulated luxury dark map */}
                <div className="absolute inset-0 bg-[#E8DCCB] flex flex-col items-center justify-center p-8 text-center space-y-4 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')] bg-blend-luminosity bg-cover">
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
                  
                  <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-sm border border-secondary-sand relative z-10 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/5 mx-auto flex items-center justify-center text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-playfair font-bold text-lg text-text-brown">Delhi NCR Coverage</h5>
                      <p className="text-xs text-text-brown/60 font-inter leading-relaxed">
                        We deliver fresh products directly from our three central hubs across Delhi, Noida, and Gurugram.
                      </p>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/95 text-secondary-cream border-none font-bold text-xs" onClick={() => window.open('https://maps.google.com')}>
                      Open Active Google Maps
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 6: FAQ Accordion */}
        <section className="py-24 container mx-auto px-4 md:px-8 max-w-3xl">
          <div className="text-center space-y-4 mb-16">
            <span className="text-primary font-bold text-xs uppercase tracking-widest block">Customer Support</span>
            <Heading level={2} className="text-3xl md:text-5xl font-bold text-text-brown">Frequently Asked Queries</Heading>
            <div className="w-12 h-[1.5px] bg-primary-gold mx-auto mt-4"></div>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-secondary-sand/30 shadow-sm overflow-hidden"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-secondary-cream/20 transition-colors"
                >
                  <span className="font-playfair font-bold text-base md:text-lg text-text-brown pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-primary-gold shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-secondary-sand/20 text-sm text-text-brown/70 font-inter leading-relaxed text-left">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Social Connect */}
        <section className="py-24 bg-white/40 border-t border-secondary-sand/30 text-center">
          <div className="max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary font-bold text-xs uppercase tracking-widest block">Social Connection</span>
            <Heading level={2} className="text-3xl md:text-4xl font-bold text-text-brown">Share Your Sweet Moments</Heading>
            <p className="text-sm text-text-brown/60 font-inter">Join our community online. Mention us on social media using tag <span className="text-primary font-bold">#SudarshanSweets</span></p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-8">
            <div className="group relative aspect-square overflow-hidden rounded-2xl border border-secondary-sand/30 shadow-sm">
              <img src="https://images.pexels.com/photos/18488310/pexels-photo-18488310.jpeg" alt="Insta Moment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                <p className="font-playfair text-sm font-bold">@SudarshanSweets</p>
              </div>
            </div>
            <div className="group relative aspect-square overflow-hidden rounded-2xl border border-secondary-sand/30 shadow-sm">
              <img src="https://images.pexels.com/photos/19151502/pexels-photo-19151502.jpeg" alt="Insta Moment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                <p className="font-playfair text-sm font-bold">@SudarshanSweets</p>
              </div>
            </div>
            <div className="group relative aspect-square overflow-hidden rounded-2xl border border-secondary-sand/30 shadow-sm">
              <img src="https://images.pexels.com/photos/15014918/pexels-photo-15014918.jpeg" alt="Insta Moment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                <p className="font-playfair text-sm font-bold">@SudarshanSweets</p>
              </div>
            </div>
            <div className="group relative aspect-square overflow-hidden rounded-2xl border border-secondary-sand/30 shadow-sm">
              <img src="https://images.pexels.com/photos/20699855/pexels-photo-20699855.jpeg" alt="Insta Moment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                <p className="font-playfair text-sm font-bold">@SudarshanSweets</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Final CTA */}
        <section className="relative py-24 overflow-hidden border-t border-secondary-sand/30 bg-[#1E0C05]">
          <div className="absolute inset-0 z-0 opacity-15">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary-gold)_0%,_transparent_60%)]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl space-y-6">
            <Heading level={2} className="text-3xl md:text-5xl font-bold text-secondary-cream leading-tight">
              Bring Home the <br/>
              <span className="text-primary-gold italic font-serif">Taste of Tradition</span>
            </Heading>
            <p className="text-sm text-secondary-cream/70 font-inter max-w-md mx-auto leading-relaxed">
              Browse our collections of pure desi ghee sweets, and let us elevate your festivals and celebrations.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-2">
              <Link to="/category/all" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/95 text-secondary-cream border-none font-bold">
                  Shop Now
                </Button>
              </Link>
              <a href="tel:+919876543210" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 border-primary-gold text-primary-gold hover:bg-primary-gold/10 bg-transparent font-bold">
                  Contact Support
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
