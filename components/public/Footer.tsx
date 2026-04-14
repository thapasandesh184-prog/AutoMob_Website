"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

const footerLinks = {
  inventory: [
    { label: "All Inventory", href: "/inventory" },
    { label: "Car Finder", href: "/car-finder" },
    { label: "Luxury Sedans", href: "/inventory" },
    { label: "SUVs", href: "/inventory" },
    { label: "Supercars", href: "/inventory" },
  ],
  services: [
    { label: "Finance Department", href: "/finance" },
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/team" },
    { label: "Contact Us", href: "/contact" },
    { label: "Directions", href: "/directions" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  const { settings } = useSiteSettings();
  const phone = settings.phone || "+1 (778) 123-4567";
  const email = settings.email || "sales@prestigemotors.com";
  const address = settings.address || "123 Luxury Lane";
  const city = settings.city || "Vancouver";
  const state = settings.state || "BC";
  const zip = settings.zip || "V6B 1A1";
  const hours = settings.hours || "Mon - Sat: 10am - 7pm";
  const siteName = settings.siteName || "Prestige Motors";
  const facebook = settings.facebook || "#";
  const instagram = settings.instagram || "#";
  const x = settings.x || "#";
  const youtube = settings.youtube || "#";
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const emailHref = `mailto:${email}`;
  const footerTagline = "Curating the world's finest automobiles for discerning collectors and enthusiasts. Experience automotive excellence.";
  const footerColInventoryTitle = "Inventory";
  const footerColServicesTitle = "Services";
  const footerColContactTitle = "Contact Us";
  const footerCopyrightSuffix = "All rights reserved.";

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6" aria-label="Prestige Motors Home">
              <div className="w-10 h-10 bg-gradient-to-br from-[#C0A66A] to-[#9A854C] flex items-center justify-center">
                <span className="text-black font-bold text-lg">P</span>
              </div>
              <div>
                <span className="text-lg font-semibold tracking-tight text-white">PRESTIGE</span>
                <span className="block -mt-1 text-[10px] tracking-[0.3em] text-[#C0A66A]">MOTORS</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              {footerTagline}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C0A66A] hover:border-[#C0A66A] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C0A66A] hover:border-[#C0A66A] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.512c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.126-5.864 10.126-11.854z" />
                </svg>
              </a>
              <a
                href={x}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C0A66A] hover:border-[#C0A66A] transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={youtube}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#C0A66A] hover:border-[#C0A66A] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="text-white font-medium mb-6">{footerColInventoryTitle}</h4>
            <ul className="space-y-3">
              {footerLinks.inventory.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-[#C0A66A] transition-colors"
                    aria-label={link.label}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">{footerColServicesTitle}</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-[#C0A66A] transition-colors"
                    aria-label={link.label}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-white font-medium mb-6">{footerColContactTitle}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C0A66A] mt-0.5 shrink-0" />
                <span className="text-sm text-white/50">
                  {address}<br />
                  {city}, {state} {zip}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C0A66A] shrink-0" />
                <a
                  href={phoneHref}
                  className="text-sm text-white/50 hover:text-[#C0A66A] transition-colors"
                  aria-label="Call Prestige Motors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#C0A66A] shrink-0" />
                <a
                  href={emailHref}
                  className="text-sm text-white/50 hover:text-[#C0A66A] transition-colors"
                  aria-label="Email Prestige Motors"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C0A66A] mt-0.5 shrink-0" />
                <span className="text-sm text-white/50">
                  {hours}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              &copy; {new Date().getFullYear()} {siteName}. {footerCopyrightSuffix}
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/40 hover:text-[#C0A66A] transition-colors"
                  aria-label={link.label}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
