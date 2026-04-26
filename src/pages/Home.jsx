import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Shield, Clock, Award, ShieldCheck, Lock, Star, Users, Gem, MapPin, Navigation, Phone, Mail } from 'lucide-react';
import HeroSearchSection from '@/components/HeroSearchSection';
import VehicleCard from '@/components/VehicleCard';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import SEO, { localBusinessSchema, websiteSchema } from '@/components/SEO';

const iconMap = { Shield, Clock, Award, ShieldCheck, Lock, Star, Users, Gem };

const stats = [
  { value: '500+', label: 'Vehicles Sold' },
  { value: '15+', label: 'Years Experience' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'Support' },
];

const features = [
  { icon: 'Shield', title: 'Certified Quality', description: 'Every vehicle undergoes a rigorous 150-point inspection before reaching our showroom.' },
  { icon: 'Users', title: 'Seamless Process', description: 'From browsing to driving away, we make your luxury car purchase effortless.' },
  { icon: 'Gem', title: 'Premium Selection', description: 'Curated inventory of the world\'s finest automobiles, hand-picked for excellence.' },
];

const trustBadges = [
  { icon: 'ShieldCheck', label: 'BBB Accredited' },
  { icon: 'Lock', label: 'Secure Financing' },
  { icon: 'Award', label: 'Certified Pre-Owned' },
  { icon: 'Star', label: '5-Star Rated' },
];

const aboutBullets = [
  'Hand-selected premium inventory',
  'Transparent pricing and history',
  'White-glove customer service',
  'Nationwide delivery available',
];

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useSiteSettings();

  let brands = [];
  try {
    const parsed = JSON.parse(settings.brands || '[]');
    brands = Array.isArray(parsed) ? parsed : [];
  } catch {
    brands = [];
  }

  // Default brands if none configured
  const defaultBrands = [
    { name: 'BMW', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80' },
    { name: 'Mercedes-Benz', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80' },
    { name: 'Audi', image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&q=80' },
    { name: 'Porsche', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80' },
    { name: 'Lexus', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80' },
    { name: 'Land Rover', image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400&q=80' },
  ];
  const displayBrands = brands.length > 0 ? brands : defaultBrands;

  const financingBgImage = settings.financingBgImage || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80';
  const aboutImage = settings.aboutImage || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80';
  const mapEmbedUrl = settings.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2606.8377!2d-123.1364!3d49.1983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDExJzUzLjkiTiAxMjPCsDA4JzEwLjkiVw!5e0!3m2!1sen!2sca!4v1600000000000!5m2!1sen!2sca';
  const phone = settings.phone || '+1 7789907468';
  const email = settings.email || 'info@skayautogroup.ca';
  const address = settings.address || 'Parking lot, 21320 Westminster Hwy #2128';
  const city = settings.city || 'Richmond';
  const state = settings.state || 'BC';
  const zip = settings.zip || 'V5W 3A3';
  const hours = settings.hours || 'Mon - Sat: 10am - 7pm';

  useEffect(() => {
    fetch('/api/vehicles?featured=true')
      .then((res) => res.json())
      .then((data) => {
        setFeaturedVehicles(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => {
        setFeaturedVehicles([]);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <SEO
        title="Luxury & Exotic Car Dealership"
        description="Discover the finest collection of luxury and exotic vehicles at SKay Auto Group. Premium pre-owned cars, SUVs, and supercars with world-class service in Richmond, BC."
        keywords="luxury cars, exotic cars, pre-owned vehicles, car dealership, Richmond BC, Vancouver, BMW, Mercedes, Porsche"
        url="/"
        jsonLd={[localBusinessSchema, websiteSchema]}
      />
      <div className="overflow-x-hidden">
        <HeroSearchSection />

      {/* Stats Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 overflow-hidden">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-[#0a0a0a] p-6 md:p-8 text-center">
                <p className="text-3xl md:text-4xl font-light text-[#C0A66A] mb-1">{stat.value}</p>
                <p className="text-sm text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Inventory */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">Featured Collection</motion.p>
              <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-light text-white">
                Exceptional <span className="text-gradient-gold">Vehicles</span>
              </motion.h2>
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <Link to="/inventory" className="group inline-flex items-center gap-2 text-white hover:text-[#C0A66A] transition-colors">
                View All Inventory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <div key={i} className="bg-[#111] border border-white/5 h-[400px] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.slice(0, 6).map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">The SKay Difference</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-light text-white">
              Why Choose <span className="text-gradient-gold">Us</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Shield;
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} className="group p-8 border border-white/5 bg-[#111] hover:border-[#C0A66A]/20 transition-all duration-500">
                  <div className="w-14 h-14 bg-[#C0A66A]/10 flex items-center justify-center mb-6 group-hover:bg-[#C0A66A]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#C0A66A]" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brands Showcase */}
      <BrandsMarquee brands={displayBrands} />

      {/* Financing CTA */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[700px]">
          <div className="relative flex items-center bg-[#0a0a0a] px-6 sm:px-10 lg:px-16 xl:px-24 py-20 md:py-28 order-2 lg:order-1">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#C0A66A] via-[#C0A66A]/30 to-transparent" />
            <div className="relative max-w-xl">
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">Flexible Financing</motion.p>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-light text-white mb-6">
                Transforming Dreams into <span className="text-gradient-gold">Reality</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white/60 text-lg mb-10 leading-relaxed">
                Our finance specialists work with leading institutions to secure competitive rates tailored to your needs. Experience a seamless approval process designed around you.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }} className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 mb-10">
                <div><p className="text-3xl font-light text-[#C0A66A] mb-1">2.9%</p><p className="text-sm text-white/50">Starting APR</p></div>
                <div><p className="text-3xl font-light text-[#C0A66A] mb-1">24h</p><p className="text-sm text-white/50">Approval Time</p></div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
                <Link to="/finance" className="group px-8 py-4 bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86] transition-all duration-300 inline-flex items-center justify-center gap-2">
                  Apply For Financing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="px-8 py-4 border border-white/20 text-white font-medium hover:border-[#C0A66A] hover:text-[#C0A66A] transition-all duration-300 inline-flex items-center justify-center">
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-auto order-1 lg:order-2">
            <img src={financingBgImage} alt="Luxury vehicle financing" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent lg:via-[#0a0a0a]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative aspect-[4/3] overflow-hidden">
              <img src={aboutImage} alt="SKay Auto group Showroom" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 border border-white/10" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <p className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">About SKay Auto group</p>
              <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
                A Legacy of <span className="text-gradient-gold">Excellence</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                For over 15 years, SKay Auto group has been the destination of choice for discerning automotive enthusiasts. We don't just sell cars — we curate experiences and build lifelong relationships.
              </p>
              <ul className="space-y-3 mb-8">
                {aboutBullets.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-white/70">
                    <CheckCircle2 className="w-5 h-5 text-[#C0A66A] shrink-0" />{item}
                  </li>
                ))}
              </ul>
              <Link to="/about" className="group inline-flex items-center gap-2 text-[#C0A66A] hover:text-[#D4BC86] transition-colors">
                Learn More About Us <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 md:py-20 bg-[#0a0a0a] px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => {
              const Icon = iconMap[badge.icon] || ShieldCheck;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex flex-col items-center text-center p-6">
                  <div className="w-14 h-14 bg-[#C0A66A]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#C0A66A]" />
                  </div>
                  <h3 className="text-white font-medium">{badge.label}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map / Visit Us */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-[#0a0a0a] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#C0A66A]/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">Visit Our Showroom</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-light text-white">
              Find Us in <span className="text-gradient-gold">Richmond</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info Card — Floating */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 h-fit shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-[#C0A66A]/[0.04] hover:shadow-[#C0A66A]/[0.08] hover:border-[#C0A66A]/20 transition-all duration-500"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#C0A66A]/20 to-[#C0A66A]/5 rounded-xl flex items-center justify-center mb-6 border border-[#C0A66A]/20">
                <MapPin className="w-6 h-6 text-[#C0A66A]" />
              </div>
              <h3 className="text-xl font-medium text-white mb-4">SKay Auto Group</h3>
              <div className="space-y-1.5 text-white/60 mb-8">
                <p>{address}</p>
                <p>{city}, {state} {zip}</p>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-8 h-8 bg-white/[0.03] rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#C0A66A]" />
                  </div>
                  <span className="text-sm">{hours}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-8 h-8 bg-white/[0.03] rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-[#C0A66A]" />
                  </div>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-sm hover:text-[#C0A66A] transition-colors">{phone}</a>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-8 h-8 bg-white/[0.03] rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#C0A66A]" />
                  </div>
                  <a href={`mailto:${email}`} className="text-sm hover:text-[#C0A66A] transition-colors">{email}</a>
                </div>
              </div>
              <Link
                to="/directions"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-[#C0A66A] to-[#9A854C] text-black font-medium hover:from-[#D4BC86] hover:to-[#C0A66A] transition-all duration-300 rounded-xl"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </Link>
            </motion.div>

            {/* Map — Floating */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 bg-[#111]/60 backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden min-h-[400px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-[#C0A66A]/[0.04] hover:shadow-[#C0A66A]/[0.08] hover:border-[#C0A66A]/20 transition-all duration-500"
            >
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '100%' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SKay Auto Group Location"
                className="grayscale-[20%] contrast-[1.05]"
              />
            </motion.div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

function BrandsMarquee({ brands }) {
  const [isPaused, setIsPaused] = useState(false);

  if (brands.length === 0) return null;

  // Triple the items for a truly seamless infinite loop
  const tripleBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">Premium Brands</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl font-light text-white">
            World-Class <span className="text-gradient-gold">Manufacturers</span>
          </motion.h2>
        </div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

        {/* Scrolling track */}
        <div
          className="flex gap-5 md:gap-7 w-max animate-marquee will-change-transform"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {tripleBrands.map((brand, index) => (
            <Link
              key={`${brand.name}-${index}`}
              to={`/inventory?make=${encodeURIComponent(brand.name)}`}
              className="group relative w-[170px] md:w-[240px] h-[240px] md:h-[320px] overflow-hidden shrink-0 rounded-2xl border border-white/[0.06] bg-[#111] shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_40px_rgba(192,166,106,0.12)] hover:border-[#C0A66A]/30 transition-all duration-500"
            >
              {/* Image */}
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Top shimmer line on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C0A66A]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Brand name */}
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <h3 className="text-white text-base md:text-lg font-medium tracking-wide text-center group-hover:text-[#C0A66A] transition-colors duration-300">
                  {brand.name}
                </h3>
                <p className="text-white/0 group-hover:text-white/50 text-xs text-center mt-1 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  View Inventory
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#C0A66A]/0 group-hover:bg-[#C0A66A] transition-all duration-500 shadow-[0_0_8px_rgba(192,166,106,0)] group-hover:shadow-[0_0_8px_rgba(192,166,106,0.6)]" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
