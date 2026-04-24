"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Phone, MapPin, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSiteSettings } from "@/hooks/use-site-settings";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/car-finder", label: "Car Finder" },
  {
    href: "#",
    label: "Finance",
    children: [
      { href: "/finance", label: "Finance Department" },
      { href: "/finance", label: "Finance Calculator" },
    ],
  },
  {
    href: "#",
    label: "Services",
    children: [
      { href: "/about", label: "About Us" },
      { href: "/team", label: "Our Team" },
      { href: "/contact", label: "Contact Us" },
      { href: "/directions", label: "Directions" },
    ],
  },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { settings } = useSiteSettings();
  const phone = settings.phone || "+1 7789907468";
  const address = settings.address || "Parking lot, 21320 Westminster Hwy #2128";
  const city = settings.city || "Richmond";
  const state = settings.state || "BC";
  const hours = settings.hours || "Mon - Sat: 10am - 7pm";
  const facebook = settings.facebook || "#";
  const instagram = settings.instagram || "#";
  const x = settings.x || "#";
  const youtube = settings.youtube || "#";
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const logoUrl = settings.logoUrl || "/logo.png";
  const logoHeight = settings.logoHeight || "40";
  const logoPosition = settings.logoPosition || "left"; // left | center

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      {/* Top bar */}
      <div className="bg-[#111] border-b border-white/5 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs text-white/70">
            <div className="flex items-center gap-4">
              <a
                href={phoneHref}
                className="flex items-center gap-1.5 hover:text-[#C0A66A] transition-colors"
                aria-label="Call SKay Auto group"
              >
                <Phone className="w-3 h-3" />
                <span>{phone}</span>
              </a>
              <span className="hidden sm:inline text-white/20">|</span>
              <a
                href="/directions"
                className="hidden sm:flex items-center gap-1.5 hover:text-[#C0A66A] transition-colors"
                aria-label="Get directions to SKay Auto group"
              >
                <MapPin className="w-3 h-3" />
                <span>{address}, {city}, {state}</span>
              </a>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/contact"
                className="hover:text-[#C0A66A] transition-colors"
                aria-label="Contact Us"
              >
                Contact
              </Link>
              <span className="text-white/20">|</span>
              <span>{hours}</span>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-2">
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-[#C0A66A] transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-[#C0A66A] transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.512c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.126-5.864 10.126-11.854z" />
                  </svg>
                </a>
                <a
                  href={x}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-[#C0A66A] transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-[#C0A66A] transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center h-16 md:h-20 ${logoPosition === "center" ? "justify-center" : "justify-between"}`}>
          {/* Logo */}
          <Link href="/" className={`flex items-center gap-2 ${logoPosition === "center" ? "absolute left-1/2 -translate-x-1/2" : ""}`} aria-label="SKay Auto group Home">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
              <img src={logoUrl} alt="SKay Auto group" className="w-auto object-contain" style={{ height: `${parseInt(logoHeight) || 40}px` }} />
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-[#C0A66A] transition-colors py-2"
                  aria-label={link.label}
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-4 h-4" />}
                </Link>
                <AnimatePresence>
                  {link.children && openDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-56 pt-2"
                    >
                      <div className="glass overflow-hidden shadow-2xl shadow-black/50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href + child.label}
                            href={child.href}
                            className="block px-4 py-3 text-sm text-white/80 hover:text-[#C0A66A] hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                            aria-label={child.label}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/sell-us-your-car"
              className="px-5 py-2.5 text-sm font-medium text-white border border-white/20 hover:border-[#C0A66A] hover:text-[#C0A66A] transition-colors"
              aria-label="Sell Your Vehicle"
            >
              Sell Your Vehicle
            </Link>
            <Link
              href="/inventory"
              className="px-5 py-2.5 text-sm font-medium text-black bg-[#C0A66A] hover:bg-[#D4BC86] transition-colors"
              aria-label="View Inventory"
            >
              View Inventory
            </Link>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <button
                  className="lg:hidden p-2 text-white hover:text-[#C0A66A] transition-colors"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              }
            />
            <SheetContent side="right" className="w-full sm:w-80 bg-[#111] border-white/10 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <span className="text-lg font-semibold">Menu</span>
                  {/* Close is handled by Sheet */}
                </div>
                <div className="flex-1 py-6">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      <Link
                        href={link.href === "#" ? (link.children?.[0].href || "/") : link.href}
                        className="block px-6 py-4 text-lg font-medium text-white hover:text-[#C0A66A] hover:bg-white/5 transition-colors"
                        aria-label={link.label}
                      >
                        {link.label}
                      </Link>
                      {link.children && (
                        <div className="pl-10 border-l border-white/10 ml-6">
                          {link.children.map((child) => (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              className="block py-2.5 text-sm text-white/60 hover:text-[#C0A66A] transition-colors"
                              aria-label={child.label}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-white/10 space-y-3">
                  <Link
                    href="/inventory"
                    className="block w-full text-center px-5 py-3 text-sm font-medium text-black bg-[#C0A66A] hover:bg-[#D4BC86] transition-colors"
                    aria-label="View Inventory"
                  >
                    View Inventory
                  </Link>
                  <Link
                    href="/sell-us-your-car"
                    className="block w-full text-center px-5 py-3 text-sm font-medium text-white border border-white/20 hover:border-[#C0A66A] hover:text-[#C0A66A] transition-colors"
                    aria-label="Sell Your Vehicle"
                  >
                    Sell Your Vehicle
                  </Link>
                  <a
                    href={phoneHref}
                    className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white border border-white/20 hover:border-[#C0A66A] hover:text-[#C0A66A] transition-colors"
                    aria-label="Call SKay Auto group"
                  >
                    <Phone className="w-4 h-4" />
                    Call Us
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
