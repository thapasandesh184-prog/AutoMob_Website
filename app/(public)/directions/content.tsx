"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Plane, Train, Car } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { getSafeMapEmbedUrl } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = { Plane, Train, Car };

const directions = [
  {
    icon: "Plane",
    title: "From Vancouver International Airport (YVR)",
    steps: [
      "Head north on Grant McConachie Way toward Airport Rd (2 km)",
      "Take Arthur Laing Bridge N toward Richmond",
      "Continue onto SW Marine Dr and then Oak St",
      "Turn right onto Westminster Hwy — SKay Auto group will be on your right",
    ],
    time: "~20 minutes",
  },
  {
    icon: "Train",
    title: "From Downtown Vancouver",
    steps: [
      "Head south on Cambie St toward the Cambie St Bridge",
      "Cross the bridge and continue onto Cambie Rd in Richmond",
      "Turn left onto No. 3 Rd",
      "Turn right onto Westminster Hwy — destination on your right",
    ],
    time: "~25 minutes",
  },
  {
    icon: "Car",
    title: "From Burnaby / Metrotown",
    steps: [
      "Head south on Willingdon Ave",
      "Merge onto Hwy 91 S toward Richmond",
      "Take the Westminster Hwy exit",
      "Turn right onto Westminster Hwy — showroom ahead on your right",
    ],
    time: "~20 minutes",
  },
];

export default function DirectionsPage() {
  const { settings } = useSiteSettings();
  const siteName = settings.siteName || "SKay Auto group";
  const address = settings.address || "Parking lot, 21320 Westminster Hwy #2128";
  const city = settings.city || "Richmond";
  const state = settings.state || "BC";
  const zip = settings.zip || "V5W 3A3";
  const country = settings.country || "Canada";
  const hours = settings.hours || "Mon - Sat: 10am - 7pm";
  const fullAddress = `${address}, ${city}, ${state} ${zip}`;
  const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            Visit Our Showroom
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6"
          >
            <span className="text-gradient-gold font-medium">Directions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto font-light"
          >
            Located in Richmond, our showroom is easily accessible from all major landmarks across Metro Vancouver.
          </motion.p>
        </div>
      </section>

      {/* Address Card + Large Map */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Address Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#111] border border-white/5 p-8 h-fit"
            >
              <div className="w-14 h-14 bg-[#C0A66A]/10 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-[#C0A66A]" />
              </div>
              <h2 className="text-2xl font-light text-white mb-4">{siteName}</h2>
              <div className="space-y-2 text-white/60 mb-8">
                <p>{address}</p>
                <p>{city}, {state} {zip}</p>
                <p>{country}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-2 h-2 bg-[#C0A66A]" />
                  <span className="text-sm">{hours}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <div className="w-2 h-2 bg-white/20" />
                  <span className="text-sm">Sunday: Closed</span>
                </div>
              </div>

              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86] transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </motion.div>

            {/* Large Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 bg-[#111] border border-white/5 overflow-hidden min-h-[400px]"
            >
              <iframe
                src={getSafeMapEmbedUrl(settings.mapEmbedUrl)}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "100%" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SKay Auto group Location"
                className="grayscale-[30%]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Written Directions */}
      <section className="py-16 md:py-20 bg-[#0a0a0a] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3"
            >
              How to Find Us
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-light text-white"
            >
              Directions from Major <span className="text-gradient-gold">Landmarks</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {directions.map((item, index) => {
              const Icon = (iconMap[item.icon] || Car) as any;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#111] border border-white/5 p-6 md:p-8 hover:border-[#C0A66A]/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#C0A66A]/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#C0A66A]" />
                    </div>
                    <span className="text-sm text-[#C0A66A] font-medium">{item.time}</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-4">{item.title}</h3>
                  <ol className="space-y-3">
                    {item.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3 text-white/60 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 bg-white/5 flex items-center justify-center text-xs text-white/70 mt-0.5">
                          {stepIndex + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
