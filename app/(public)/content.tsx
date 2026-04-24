"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, Clock, Award, ShieldCheck, Lock, Star, Users, Gem } from "lucide-react";
import HeroSearchSection from "@/components/public/HeroSearchSection";
import VehicleCard from "@/components/public/VehicleCard";
import { useSiteSettings } from "@/hooks/use-site-settings";
import type { Vehicle } from "@/types";

type Brand = { name: string; image: string };

const iconMap: Record<string, React.ElementType> = { Shield, Clock, Award, ShieldCheck, Lock, Star, Users, Gem };

const stats = [
  { value: "500+", label: "Vehicles Sold" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support" },
];

const features = [
  { icon: "Shield", title: "Certified Quality", description: "Every vehicle undergoes a rigorous 150-point inspection before reaching our showroom." },
  { icon: "Users", title: "Seamless Process", description: "From browsing to driving away, we make your luxury car purchase effortless." },
  { icon: "Gem", title: "Premium Selection", description: "Curated inventory of the world's finest automobiles, hand-picked for excellence." },
];

const trustBadges = [
  { icon: "ShieldCheck", label: "BBB Accredited" },
  { icon: "Lock", label: "Secure Financing" },
  { icon: "Award", label: "Certified Pre-Owned" },
  { icon: "Star", label: "5-Star Rated" },
];

const aboutBullets = [
  "Hand-selected premium inventory",
  "Transparent pricing and history",
  "White-glove customer service",
  "Nationwide delivery available",
];

const homeFeaturedEyebrow = "Featured Collection";
const homeFeaturedTitle = "Exceptional Vehicles";
const homeFeaturedCta = "View All Inventory";
const homeFinanceEyebrow = "Flexible Financing";
const homeFinanceTitle = "Transforming Dreams into Reality";
const homeFinanceBody = "Our finance specialists work with leading institutions to secure competitive rates tailored to your needs. Experience a seamless approval process designed around you.";
const homeFinanceAprValue = "2.9%";
const homeFinanceAprLabel = "Starting APR";
const homeFinanceApprovalValue = "24h";
const homeFinanceApprovalLabel = "Approval Time";
const homeFinancePrimaryCta = "Apply For Financing";
const homeFinanceSecondaryCta = "Contact Us";
const homeAboutEyebrow = "About SKay Auto group";
const homeAboutTitle = "A Legacy of Excellence";
const homeAboutBody = "For over 15 years, SKay Auto group has been the destination of choice for discerning automotive enthusiasts. We don't just sell cars — we curate experiences and build lifelong relationships.";
const homeAboutCta = "Learn More About Us";

export default function HomePage() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useSiteSettings();

  let brands: Brand[] = [];
  try {
    const parsed = JSON.parse(settings.brands || "[]");
    brands = Array.isArray(parsed) ? parsed : [];
  } catch {
    brands = [];
  }

  const financingBgImage = settings.financingBgImage || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80";
  const aboutImage = settings.aboutImage || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80";

  useEffect(() => {
    fetch("/api/vehicles?featured=true")
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
    <div className="overflow-x-hidden">
      {/* Hero Section with Video + Search + Quick Links */}
      <HeroSearchSection />

      {/* Stats Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 overflow-hidden">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0a0a0a] p-6 md:p-8 text-center"
              >
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
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3"
              >
                {homeFeaturedEyebrow}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-light text-white"
              >
                {homeFeaturedTitle.split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{homeFeaturedTitle.split(" ").pop()}</span>
              </motion.h2>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/inventory"
                className="group inline-flex items-center gap-2 text-white hover:text-[#C0A66A] transition-colors"
                aria-label={homeFeaturedCta}
              >
                {homeFeaturedCta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#111] border border-white/5 h-[400px] animate-pulse" />
              ))}
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
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3"
            >
              The SKay Difference
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-light text-white"
            >
              Why Choose <span className="text-gradient-gold">Us</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = (iconMap[feature.icon] || Shield) as any;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="group p-8 border border-white/5 bg-[#111] hover:border-[#C0A66A]/20 transition-all duration-500"
                >
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
      <BrandsMarquee brands={brands} />

      {/* Financing CTA */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[700px]">
          {/* Left Content */}
          <div className="relative flex items-center bg-[#0a0a0a] px-6 sm:px-10 lg:px-16 xl:px-24 py-20 md:py-28 order-2 lg:order-1">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#C0A66A] via-[#C0A66A]/30 to-transparent" />
            <div className="relative max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3"
              >
                {homeFinanceEyebrow}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-light text-white mb-6"
              >
                {homeFinanceTitle.split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{homeFinanceTitle.split(" ").pop()}</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/60 text-lg mb-10 leading-relaxed"
              >
                {homeFinanceBody}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 mb-10"
              >
                <div>
                  <p className="text-3xl font-light text-[#C0A66A] mb-1">{homeFinanceAprValue}</p>
                  <p className="text-sm text-white/50">{homeFinanceAprLabel}</p>
                </div>
                <div>
                  <p className="text-3xl font-light text-[#C0A66A] mb-1">{homeFinanceApprovalValue}</p>
                  <p className="text-sm text-white/50">{homeFinanceApprovalLabel}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/finance"
                  className="group px-8 py-4 bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86] transition-all duration-300 inline-flex items-center justify-center gap-2"
                  aria-label={homeFinancePrimaryCta}
                >
                  {homeFinancePrimaryCta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 border border-white/20 text-white font-medium hover:border-[#C0A66A] hover:text-[#C0A66A] transition-all duration-300 inline-flex items-center justify-center"
                  aria-label={homeFinanceSecondaryCta}
                >
                  {homeFinanceSecondaryCta}
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[400px] lg:h-auto order-1 lg:order-2">
            <Image
              src={financingBgImage}
              alt="Luxury vehicle financing"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent lg:via-[#0a0a0a]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] overflow-hidden"
            >
              <Image
                src={aboutImage}
                alt="SKay Auto group Showroom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 border border-white/10" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">
                {homeAboutEyebrow}
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
                {homeAboutTitle.split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{homeAboutTitle.split(" ").pop()}</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                {homeAboutBody}
              </p>
              <ul className="space-y-3 mb-8">
                {aboutBullets.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-white/70">
                    <CheckCircle2 className="w-5 h-5 text-[#C0A66A] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-[#C0A66A] hover:text-[#D4BC86] transition-colors"
                aria-label={homeAboutCta}
              >
                {homeAboutCta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              const Icon = (iconMap[badge.icon] || ShieldCheck) as any;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-6"
                >
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
    </div>
  );
}

function BrandsMarquee({ brands }: { brands: { name: string; image: string }[] }) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3"
          >
            Premium Brands
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-light text-white"
          >
            World-Class <span className="text-gradient-gold">Manufacturers</span>
          </motion.h2>
        </div>
      </div>

      {/* Marquee track */}
      <div
        className="relative group/marquee"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

        <div
          className="flex gap-5 md:gap-6 w-max animate-marquee"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {/* Double the items for seamless loop */}
          {[...brands, ...brands].map((brand, index) => (
            <Link
              key={`${brand.name}-${index}`}
              href={`/inventory?make=${encodeURIComponent(brand.name)}`}
              className="relative w-[160px] md:w-[220px] h-[220px] md:h-[300px] overflow-hidden shrink-0 shadow-xl shadow-black/40 border border-white/5 hover:border-[#C0A66A]/40 transition-colors"
            >
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
                sizes="220px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end justify-center p-4 md:p-5">
                <h3 className="text-white text-base md:text-lg font-medium tracking-wide text-center">
                  {brand.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
}
