"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const mainPages = [
  { label: "Home", href: "/" },
  { label: "Inventory", href: "/inventory" },
  { label: "Sell Us Your Car", href: "/sell-us-your-car" },
  { label: "Financing", href: "/finance" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Directions", href: "/directions" },
  { label: "Book Appointment", href: "/book-appointment" },
];

const legalPages = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function SitemapPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            Navigation
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6"
          >
            Site <span className="text-gradient-gold font-medium">Map</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto font-light"
          >
            Find your way around our website
          </motion.p>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Main Pages */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#111] border border-white/5 p-8"
            >
              <h2 className="text-xl font-medium text-white mb-6 border-b border-white/10 pb-4">
                Main Pages
              </h2>
              <ul className="space-y-3">
                {mainPages.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="text-white/60 hover:text-[#C0A66A] transition-colors"
                    >
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Pages */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#111] border border-white/5 p-8"
            >
              <h2 className="text-xl font-medium text-white mb-6 border-b border-white/10 pb-4">
                Legal
              </h2>
              <ul className="space-y-3">
                {legalPages.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="text-white/60 hover:text-[#C0A66A] transition-colors"
                    >
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Admin */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#111] border border-white/5 p-8"
            >
              <h2 className="text-xl font-medium text-white mb-6 border-b border-white/10 pb-4">
                Admin
              </h2>
              <ul className="space-y-3">
                <li className="text-white/40">Login</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
