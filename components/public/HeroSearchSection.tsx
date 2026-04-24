"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSiteSettings } from "@/hooks/use-site-settings";
import type { Vehicle } from "@/types";

type QuickLink = { title: string; href: string; image: string };

export default function HeroSearchSection() {
  const router = useRouter();
  const { settings } = useSiteSettings();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  const heroVideo = settings.heroVideo || "/videos/hero-video.mp4";
  const heroPoster =
    settings.heroPoster && settings.heroPoster.startsWith("http")
      ? settings.heroPoster
      : "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80";
  const homeHeroEyebrow = "Richmond's Trusted Auto Group";
  const homeHeroTitle = "Drive Your\nDream";
  const homeHeroSubtitle = "Discover an exclusive collection of the world's finest automobiles.";
  const homeHeroSearchBadge = "Find Your Perfect Vehicle";
  const homeHeroSearchButton = "SEARCH";
  const homeHeroVehicleCountTemplate = "{{count}} vehicles available";
  const homeHeroQuickLinkHover = "Explore";
  const quickLinks: QuickLink[] = useMemo(() => {
    try {
      const parsed = JSON.parse(settings.quickLinks || "[]");
      return Array.isArray(parsed) ? parsed : [
        { title: "VIEW INVENTORY", href: "/inventory", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80" },
        { title: "APPLY FOR FINANCING", href: "/finance/application", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80" },
        { title: "SELL YOUR VEHICLE", href: "/sell-us-your-car", image: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&q=80" },
        { title: "CONTACT US", href: "/contact", image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80" },
      ];
    } catch {
      return [
        { title: "VIEW INVENTORY", href: "/inventory", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80" },
        { title: "APPLY FOR FINANCING", href: "/finance/application", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80" },
        { title: "SELL YOUR VEHICLE", href: "/sell-us-your-car", image: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&q=80" },
        { title: "CONTACT US", href: "/contact", image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80" },
      ];
    }
  }, [settings.quickLinks]);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((res) => res.json())
      .then((data) => setVehicles(Array.isArray(data) ? data : []))
      .catch(() => setVehicles([]));
  }, []);

  const uniqueMakes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
  const uniqueModels = Array.from(
    new Set(vehicles.filter((v) => !make || v.make === make).map((v) => v.model))
  ).sort();
  const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() + 1 - i).toString());

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (minYear) params.set("minYear", minYear);
    if (maxYear) params.set("maxYear", maxYear);
    const query = params.toString();
    router.push(query ? `/inventory?${query}` : "/inventory");
  };

  return (
    <section className="relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={heroPoster}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      </div>

      <div className="relative z-10 pt-24 md:pt-36 pb-10 md:pb-16">
        {/* Hero headline */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            {homeHeroEyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 leading-[1.1] whitespace-pre-line"
          >
            {homeHeroTitle.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line.includes("Dream") ? (
                  <>
                    {line.replace("Dream", "")}
                    <span className="text-gradient-gold font-medium">Dream</span>
                  </>
                ) : line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-light"
          >
            {homeHeroSubtitle}
          </motion.p>
        </div>

        {/* Premium Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="relative p-[1px] bg-gradient-to-br from-[#C0A66A]/40 via-white/10 to-[#C0A66A]/40 shadow-2xl shadow-black/50">
            <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl overflow-hidden">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
              
              {/* Header badge */}
              <div className="relative px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C0A66A]" />
                  <span className="text-[#C0A66A] text-xs tracking-[0.2em] uppercase font-medium">{homeHeroSearchBadge}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-white/30 text-xs">
                  <span className="w-1.5 h-1.5 bg-emerald-500" />
                  {homeHeroVehicleCountTemplate.replace("{{count}}", String(vehicles.length))}
                </div>
              </div>

              {/* Inputs grid */}
              <div className="relative p-5 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
                  {/* Make */}
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] uppercase tracking-[0.15em] font-medium ml-1">Make</label>
                    <Select value={make} onValueChange={(v) => { setMake(v || ""); setModel(""); }}>
                      <SelectTrigger className="w-full h-12 bg-white/[0.03] border-white/10 hover:border-[#C0A66A]/30 text-white focus:border-[#C0A66A] focus:ring-1 focus:ring-[#C0A66A]/30 transition-all">
                        <SelectValue placeholder="Select Make" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10">
                        <SelectItem value="" className="text-white/60 focus:bg-[#C0A66A]/10 focus:text-white text-sm">
                          Any Make
                        </SelectItem>
                        {uniqueMakes.map((m) => (
                          <SelectItem key={m} value={m} className="text-white focus:bg-[#C0A66A]/10 focus:text-white text-sm">
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Model */}
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] uppercase tracking-[0.15em] font-medium ml-1">Model</label>
                    <Select value={model} onValueChange={(v) => setModel(v || "")}>
                      <SelectTrigger className="w-full h-12 bg-white/[0.03] border-white/10 hover:border-[#C0A66A]/30 text-white focus:border-[#C0A66A] focus:ring-1 focus:ring-[#C0A66A]/30 transition-all">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10">
                        <SelectItem value="" className="text-white/60 focus:bg-[#C0A66A]/10 focus:text-white text-sm">
                          Any Model
                        </SelectItem>
                        {uniqueModels.map((m) => (
                          <SelectItem key={m} value={m} className="text-white focus:bg-[#C0A66A]/10 focus:text-white text-sm">
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Min Year */}
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] uppercase tracking-[0.15em] font-medium ml-1">Min Year</label>
                    <Select value={minYear} onValueChange={(v) => setMinYear(v || "")}>
                      <SelectTrigger className="w-full h-12 bg-white/[0.03] border-white/10 hover:border-[#C0A66A]/30 text-white focus:border-[#C0A66A] focus:ring-1 focus:ring-[#C0A66A]/30 transition-all">
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10 max-h-64">
                        <SelectItem value="" className="text-white/60 focus:bg-[#C0A66A]/10 focus:text-white text-sm">
                          From
                        </SelectItem>
                        {years.map((y) => (
                          <SelectItem key={y} value={y} className="text-white focus:bg-[#C0A66A]/10 focus:text-white text-sm">
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Max Year */}
                  <div className="space-y-2">
                    <label className="text-white/40 text-[10px] uppercase tracking-[0.15em] font-medium ml-1">Max Year</label>
                    <Select value={maxYear} onValueChange={(v) => setMaxYear(v || "")}>
                      <SelectTrigger className="w-full h-12 bg-white/[0.03] border-white/10 hover:border-[#C0A66A]/30 text-white focus:border-[#C0A66A] focus:ring-1 focus:ring-[#C0A66A]/30 transition-all">
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10 max-h-64">
                        <SelectItem value="" className="text-white/60 focus:bg-[#C0A66A]/10 focus:text-white text-sm">
                          To
                        </SelectItem>
                        {years.map((y) => (
                          <SelectItem key={y} value={y} className="text-white focus:bg-[#C0A66A]/10 focus:text-white text-sm">
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Button */}
                  <div className="space-y-2">
                    <label className="text-transparent text-[10px] uppercase tracking-[0.15em] font-medium ml-1 select-none hidden sm:block">Search</label>
                    <button
                      onClick={handleSearch}
                      className="h-12 w-full bg-gradient-to-r from-[#C0A66A] to-[#D4BC86] hover:from-[#D4BC86] hover:to-[#E8D2A0] text-black font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#C0A66A]/20 hover:shadow-[#C0A66A]/30 hover:scale-[1.02]"
                    >
                      <Search className="w-4 h-4" />
                      {homeHeroSearchButton}
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative bottom line */}
              <div className="h-px bg-gradient-to-r from-transparent via-[#C0A66A]/30 to-transparent" />
            </div>
          </div>
        </motion.div>

        {/* Quick Link Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="group relative h-[160px] sm:h-[200px] md:h-[280px] overflow-hidden block shadow-xl shadow-black/50 border border-white/5 hover:border-[#C0A66A]/40 transition-all duration-500"
                >
                  {/* Image */}
                  <Image
                    src={link.image}
                    alt={link.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover:from-black/70 group-hover:via-black/20 transition-all duration-500" />

                  {/* Gold top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C0A66A] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-white text-xl md:text-2xl font-bold tracking-wider uppercase drop-shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {link.title}
                    </h3>
                    <div className="mt-4 flex items-center gap-2 text-white/0 group-hover:text-white transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <span className="text-sm font-medium tracking-wide">{homeHeroQuickLinkHover}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Corner arrow icon */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 border border-white/10">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
