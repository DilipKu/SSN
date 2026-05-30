import React, { useState } from 'react';
import PageHeader from '../components/luxury/PageHeader';
import { motion } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { ContactService, ContactMessage } from '@/src/services/ContactService';
import { toast } from 'sonner';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Clock, 
  FileText, 
  Truck, 
  RefreshCcw, 
  HelpCircle, 
  CreditCard, 
  Globe, 
  Info 
} from 'lucide-react';
import { SOCIAL_LINKS } from '@/src/constants';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await ContactService.sendMessage(formData);
      toast.success('Message sent successfully! We will get back to you within 24 business hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHeader
        title="Contact Us"
        subtitle="We are always here to assist you with your shopping experience, product inquiries, and order support."
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: 'Contact Us' }
        ]}
      />

      <div className="global-container py-16 space-y-24">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Contact Info & Business Details */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-serif text-primary">Get in Touch</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you are looking for assistance with an order, product information, shipping details, or general support, our team will be happy to help you.
                </p>
              </div>

              {/* Direct Support */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Customer Support</h3>
                <div className="grid gap-6">
                  {[
                    { icon: Mail, label: 'Email Support', value: 'avneesh.kumar@kirdaarcelebrations.com', link: 'mailto:avneesh.kumar@kirdaarcelebrations.com' },
                    { icon: MessageCircle, label: 'Phone / WhatsApp', value: '+91-9871434777', link: 'https://wa.me/919871434777' },
                    { icon: Clock, label: 'Availability', value: '24 Hours × 7 Days', subValue: 'We aim to respond within 24 business hours' }
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-start gap-4 group">
                      <div className="p-3 bg-slate-50 border border-slate-100 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 rounded-lg">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{item.label}</span>
                        {item.link ? (
                          <a href={item.link} className="block text-primary hover:text-secondary transition-colors font-medium">
                            {item.value}
                          </a>
                        ) : (
                          <span className="block text-primary font-medium">{item.value}</span>
                        )}
                        {item.subValue && <p className="text-[10px] text-slate-400 italic">{item.subValue}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Details */}
              <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Business Information</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <MapPin className="h-5 w-5 text-secondary shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Registered Address</span>
                      <p className="text-sm text-primary leading-relaxed">
                        Kirdaar Celebrations<br />
                        Mangal Vihar, Sunehara Main Road,<br />
                        Roorkee-247667, Uttarakhand, India.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <FileText className="h-5 w-5 text-secondary shrink-0" />
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Firm Details</span>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                        <div>
                          <p className="text-slate-400 uppercase tracking-tighter">Business Type</p>
                          <p className="text-primary font-bold">Partnership Firm</p>
                        </div>
                        <div>
                          <p className="text-slate-400 uppercase tracking-tighter">GSTIN</p>
                          <p className="text-primary font-bold">05ABBFK4539N2Z1</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Support Topics & Form */}
          <div className="lg:col-span-7 space-y-10">
            {/* Support Topics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Truck, label: 'Order Tracking' },
                { icon: RefreshCcw, label: 'Returns' },
                { icon: CreditCard, label: 'Payments' },
                { icon: Globe, label: 'International' },
              ].map((topic, i) => (
                <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl text-center space-y-2 hover:border-secondary/20 transition-all shadow-sm">
                  <topic.icon className="h-5 w-5 mx-auto text-secondary" />
                  <p className="text-[10px] font-bold uppercase tracking-tight text-primary">{topic.label}</p>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-primary text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden"
            >
              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif">Send us a Message</h3>
                  <p className="text-white/60 text-sm">We'll get back to you within 24 business hours.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/70">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                      className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:outline-none focus:border-secondary transition-colors rounded-lg placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/70">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                      className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:outline-none focus:border-secondary transition-colors rounded-lg placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/70">Subject</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:outline-none focus:border-secondary transition-colors rounded-lg appearance-none text-white"
                  >
                    <option value="General Inquiry" className="text-black">General Inquiry</option>
                    <option value="Order Status" className="text-black">Order Status</option>
                    <option value="Shipping & Delivery" className="text-black">Shipping & Delivery</option>
                    <option value="Returns & Exchanges" className="text-black">Returns & Exchanges</option>
                    <option value="Product Information" className="text-black">Product Information</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/70">Your Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us how we can help..."
                    required
                    className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:outline-none focus:border-secondary transition-colors resize-none rounded-lg placeholder:text-white/20"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white rounded-lg uppercase tracking-[0.2em] font-bold shadow-lg transition-all"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>

                {/* Important Note */}
                <div className="pt-6 border-t border-white/10 flex gap-4 items-start">
                  <Info className="h-5 w-5 text-secondary shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Faster Assistance</p>
                    <p className="text-[10px] text-white/50 leading-relaxed italic">
                      For order-related issues, please include your Order ID, registered mobile number, and relevant images/videos.
                    </p>
                  </div>
                </div>
              </form>
              <HelpCircle className="absolute -top-10 -right-10 w-64 h-64 text-white/5" />
            </motion.div>
          </div>
        </div>

        {/* Map & Social */}
        <section className="grid lg:grid-cols-3 gap-12 mt-24">
          <div className="lg:col-span-2">
            <div className="w-full aspect-[21/9] border border-slate-100 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-xl rounded-3xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221401.30010703258!2d77.607353125!3d29.881708000000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390eb5f902b9451f%3A0x41c37f4053db31b5!2sKirdaar%20Celebrations!5e0!3m2!1sen!2sin!4v1777798881176!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div className="bg-slate-50 p-10 rounded-3xl space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-primary">Stay Connected</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Follow us for new arrivals, festive collections, and exclusive launches.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Instagram', href: SOCIAL_LINKS.instagram },
                { name: 'Facebook', href: SOCIAL_LINKS.facebook },
                { name: 'WhatsApp', href: SOCIAL_LINKS.whatsapp },
                { name: 'Youtube', href: SOCIAL_LINKS.youtube }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all text-center flex items-center justify-center"
                >
                  {social.name}
                </a>
              ))}
            </div>
            <div className="pt-6 border-t border-slate-200">
              <p className="text-[10px] text-slate-400 italic">
                Thank you for choosing Kirdaar Celebrations. We look forward to being a part of your journey.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
