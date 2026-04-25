import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Loader2 } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const subjects = [
  'General Inquiry', 'Vehicle Information', 'Financing', 'Trade-In', 'Service', 'Parts', 'Other',
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { settings } = useSiteSettings();

  const phone = settings.phone || '+1 7789907468';
  const email = settings.email || 'info@skayautogroup.ca';
  const address = settings.address || 'Parking lot, 21320 Westminster Hwy #2128';
  const city = settings.city || 'Richmond';
  const state = settings.state || 'BC';
  const zip = settings.zip || 'V5W 3A3';
  const hours = settings.hours || 'Mon - Sat: 10am - 7pm';
  const mapEmbedUrl = settings.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2606.8377!2d-123.1364!3d49.1983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDExJzUzLjkiTiAxMjPCsDA4JzEwLjkiVw!5e0!3m2!1sen!2sca!4v1600000000000!5m2!1sen!2sca';

  const contactInfo = [
    { icon: MapPin, title: 'Visit Us', lines: [address, `${city}, ${state} ${zip}`], href: '/directions' },
    { icon: Phone, title: 'Call Us', lines: [phone], href: `tel:${phone.replace(/\s+/g, '')}` },
    { icon: Mail, title: 'Email Us', lines: [email], href: `mailto:${email}` },
    { icon: Clock, title: 'Hours', lines: [hours, 'Sunday: Closed'] },
  ];

  const validate = () => {
    const e = {};
    if (!formData.name.trim() || formData.name.length < 2) e.name = 'Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email';
    if (!formData.phone.trim() || formData.phone.length < 10) e.phone = 'Please enter a valid phone number';
    if (!formData.subject) e.subject = 'Please select a subject';
    if (!formData.message.trim() || formData.message.length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error('Failed');
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80')" }} />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4">Get in Touch</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6">
            Contact <span className="text-gradient-gold font-medium">Us</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            Have questions? We'd love to hear from you. Reach out and our team will respond as soon as possible.
          </motion.p>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => (
              <motion.div key={info.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-[#111] border border-white/5 p-6 hover:border-[#C0A66A]/20 transition-all duration-300">
                <div className="w-12 h-12 bg-[#C0A66A]/10 flex items-center justify-center mb-4">
                  <info.icon className="w-5 h-5 text-[#C0A66A]" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{info.title}</h3>
                {info.href ? (
                  <a href={info.href} className="text-white/60 hover:text-[#C0A66A] transition-colors">
                    {info.lines.map((line, i) => <p key={i} className="text-sm">{line}</p>)}
                  </a>
                ) : (
                  <div className="text-white/60">
                    {info.lines.map((line, i) => <p key={i} className="text-sm">{line}</p>)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.form initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} onSubmit={onSubmit} className="bg-[#111] border border-white/5 p-6 md:p-10 space-y-6">
              <div>
                <h2 className="text-2xl font-light text-white mb-2">Send us a Message</h2>
                <p className="text-white/50 text-sm">Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>
              {success && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 text-sm">Message sent successfully! We'll be in touch soon.</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm block">Full Name</label>
                  <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                  {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-white/80 text-sm block">Email Address</label>
                  <input type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                  {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-white/80 text-sm block">Phone Number</label>
                <input type="tel" placeholder="+1 7789907468" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                {errors.phone && <p className="text-sm text-red-400">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-white/80 text-sm block">Subject</label>
                <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none appearance-none">
                  <option value="">Select a subject</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.subject && <p className="text-sm text-red-400">{errors.subject}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-white/80 text-sm block">Message</label>
                <textarea placeholder="How can we help you?" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none resize-none" />
                {errors.message && <p className="text-sm text-red-400">{errors.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full h-12 bg-[#C0A66A] text-black hover:bg-[#D4BC86] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send Message'}
              </button>
            </motion.form>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-[#111] border border-white/5 overflow-hidden h-full min-h-[400px]">
              <iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0, minHeight: '100%' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="SKay Auto group Location" className="grayscale-[30%]" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
