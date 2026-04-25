import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Users, Gem, Target } from 'lucide-react';

const iconMap = { Shield, Users, Gem, Target };

const storyParagraphs = [
  'SKay Auto group was founded with a singular vision: to create a dealership experience worthy of the extraordinary vehicles we sell. What began as a small showroom in Metro Vancouver has grown into one of Canada\'s most respected automotive destinations.',
  'Our team consists of passionate automotive experts who understand that purchasing a luxury vehicle is about more than transportation — it\'s about lifestyle, passion, and the pursuit of perfection.',
  'Every car in our collection is hand-selected, rigorously inspected, and presented with the transparency and professionalism our clients deserve.',
];

const values = [
  { icon: 'Shield', title: 'Integrity', description: 'We believe in complete transparency. Every vehicle comes with full history reports and honest pricing with no hidden fees.' },
  { icon: 'Users', title: 'Client First', description: 'Your satisfaction is our priority. Our team takes time to understand your needs and guide you to the perfect vehicle.' },
  { icon: 'Gem', title: 'Excellence', description: 'We only accept the finest automobiles into our collection. Quality is never compromised at SKay Auto group.' },
  { icon: 'Target', title: 'Precision', description: 'From detailed inspections to seamless deliveries, every step of our process is executed with meticulous attention.' },
];

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1562141989-c5c79ac8f576?w=800&q=80', alt: 'Showroom Floor' },
  { src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80', alt: 'Luxury Vehicle Detail' },
  { src: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', alt: 'Sports Car Collection' },
  { src: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80', alt: 'Client Consultation' },
];

export default function About() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80" alt="About SKay Auto group" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4">Our Story</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6">
            About SKay Auto <span className="text-gradient-gold font-medium">group</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            Curating exceptional automobiles and unforgettable experiences for over 15 years.
          </motion.p>
        </div>
      </section>

      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden"><img src="https://images.unsplash.com/photo-1562141989-c5c79ac8f576?w=800&q=80" alt="Showroom Interior" className="w-full h-full object-cover" loading="lazy" /></div>
              <div className="relative aspect-[3/4] overflow-hidden mt-8"><img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80" alt="Luxury Porsche" className="w-full h-full object-cover" loading="lazy" /></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
              <p className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">Established 2008</p>
              <h2 className="text-3xl md:text-5xl font-light text-white mb-6">A Legacy of <span className="text-gradient-gold">Excellence</span></h2>
              <div className="space-y-4 text-white/60 text-lg leading-relaxed">
                {storyParagraphs.map((p, idx) => <p key={idx}>{p}</p>)}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#0a0a0a] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">What We Stand For</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-light text-white">
              Our Core <span className="text-gradient-gold">Values</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = iconMap[value.icon] || Shield;
              return (
                <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group p-8 bg-[#111] border border-white/5 hover:border-[#C0A66A]/20 transition-all duration-500">
                  <div className="w-14 h-14 bg-[#C0A66A]/10 flex items-center justify-center mb-6 group-hover:bg-[#C0A66A]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#C0A66A]" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">{value.title}</h3>
                  <p className="text-white/50 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">The Experience</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-light text-white">
              Showroom & <span className="text-gradient-gold">Team</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div key={image.alt} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group relative aspect-[4/5] overflow-hidden">
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="text-lg font-medium text-white">{image.alt}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#0a0a0a] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-light text-white mb-6">
            Ready to Find Your Dream <span className="text-gradient-gold">Car</span>?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Browse our curated inventory or get in touch with our team to schedule a private viewing.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/inventory" className="group px-8 py-4 bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86] transition-all duration-300 inline-flex items-center gap-2">
              View Inventory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="px-8 py-4 border border-white/20 text-white font-medium hover:border-[#C0A66A] hover:text-[#C0A66A] transition-all duration-300 inline-flex items-center gap-2">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
