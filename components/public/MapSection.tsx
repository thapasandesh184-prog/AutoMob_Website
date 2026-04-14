"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { getSafeMapEmbedUrl } from "@/lib/utils";

export default function MapSection() {
  const { settings } = useSiteSettings();
  const phone = settings.phone || "+1 (778) 123-4567";
  const address = settings.address || "123 Luxury Lane";
  const city = settings.city || "Vancouver";
  const state = settings.state || "BC";
  const zip = settings.zip || "V6B 1A1";
  const siteName = settings.siteName || "Prestige Motors";
  const fullAddress = `${address}, ${city}, ${state} ${zip}`;
  const mapEmbedUrl = getSafeMapEmbedUrl(settings.mapEmbedUrl);
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
  const mapSectionEyebrow = "Visit Our Showroom";
  const mapSectionTitle = "Find Us Here";
  const mapSectionBody = "Experience our curated collection of world-class automobiles in person at our premier Vancouver showroom.";
  const mapSectionLiveBadge = "Live";
  const mapSectionDirectionsTitle = "Get Directions";
  const mapSectionDirectionsSubtitle = "Open in Google Maps";
  const mapSectionAddressTitle = "Showroom Address";
  const mapSectionCallTitle = "Call Us";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-[#0a0a0a] py-20 md:py-28">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C0A66A]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3"
          >
            {mapSectionEyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-light text-white mb-4"
          >
            {mapSectionTitle.split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{mapSectionTitle.split(" ").pop()}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            {mapSectionBody}
          </motion.p>
        </div>

        {/* TV Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative mx-auto max-w-5xl"
          style={{ perspective: "1200px" }}
        >
          {/* TV Stand / Base shadow */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-black/60 blur-xl" />

          {/* TV Frame / Bezel */}
          <div
            className="relative border-[6px] md:border-[10px] border-[#1a1a1a] bg-[#0f0f0f] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]"
            style={{
              transform: "rotateX(12deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Inner bezel */}
            <div className="overflow-hidden border border-white/5 bg-black">
              {/* Screen header bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C0A66A]" />
                  <span className="text-xs text-white/60 truncate max-w-[200px] md:max-w-md">
                    {fullAddress}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-white/40 uppercase tracking-wide">{mapSectionLiveBadge}</span>
                </div>
              </div>

              {/* Map iframe */}
              <div className="relative aspect-[16/9] md:aspect-[21/9]">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Prestige Motors Showroom Location"
                  className="absolute inset-0 grayscale-[20%] contrast-[1.05]"
                />

                {/* Screen glare / reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
              </div>
            </div>

            {/* TV brand logo detail */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-[#1a1a1a] border border-white/5 shadow-lg">
              <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">{siteName}</span>
            </div>
          </div>

          {/* TV Stand legs */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-8 flex items-start justify-center"
            style={{ transform: "translateX(-50%) rotateX(12deg)", transformStyle: "preserve-3d" }}
          >
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />
          </div>
        </motion.div>

        {/* Action cards below map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 md:mt-24 max-w-4xl mx-auto"
        >
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-5 bg-[#111] border border-white/5 hover:border-[#C0A66A]/30 transition-all"
          >
            <div className="w-12 h-12 bg-[#C0A66A]/10 flex items-center justify-center group-hover:bg-[#C0A66A]/20 transition-colors">
              <Navigation className="w-5 h-5 text-[#C0A66A]" />
            </div>
            <div>
              <p className="text-white font-medium">{mapSectionDirectionsTitle}</p>
              <p className="text-sm text-white/40">{mapSectionDirectionsSubtitle}</p>
            </div>
          </a>

          <div className="flex items-center gap-4 p-5 bg-[#111] border border-white/5">
            <div className="w-12 h-12 bg-[#C0A66A]/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#C0A66A]" />
            </div>
            <div>
              <p className="text-white font-medium">{mapSectionAddressTitle}</p>
              <p className="text-sm text-white/40">{address}, {city}</p>
            </div>
          </div>

          <a
            href={phoneHref}
            className="group flex items-center gap-4 p-5 bg-[#111] border border-white/5 hover:border-[#C0A66A]/30 transition-all"
          >
            <div className="w-12 h-12 bg-[#C0A66A]/10 flex items-center justify-center group-hover:bg-[#C0A66A]/20 transition-colors">
              <Phone className="w-5 h-5 text-[#C0A66A]" />
            </div>
            <div>
              <p className="text-white font-medium">{mapSectionCallTitle}</p>
              <p className="text-sm text-white/40">{phone}</p>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
