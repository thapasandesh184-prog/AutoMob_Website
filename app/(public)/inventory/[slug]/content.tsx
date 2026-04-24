"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Gauge,
  Calendar,
  Tag,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Info,
  Link2,
  Scale,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VehicleCard from "@/components/public/VehicleCard";
import type { Vehicle } from "@/types";

interface VehicleDetailContentProps {
  vehicle: Vehicle;
}

export default function VehicleDetailContent({ vehicle }: VehicleDetailContentProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  // Compare state
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareHydrated, setIsCompareHydrated] = useState(false);

  // Payment calculator state
  const [calcPrice, setCalcPrice] = useState<string>(vehicle.price.toString());
  const [downPayment, setDownPayment] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("60");
  const [calcOpen, setCalcOpen] = useState(false);

  // Copy link state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSimilarLoading(true);
    fetch(`/api/vehicles?status=available&make=${encodeURIComponent(vehicle.make)}`)
      .then((res) => res.json())
      .then((data: Vehicle[]) => {
        const filtered = data.filter((v) => v.id !== vehicle.id).slice(0, 3);
        setSimilarVehicles(filtered);
        setSimilarLoading(false);
      })
      .catch(() => setSimilarLoading(false));
  }, [vehicle]);

  // Hydrate compare from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("skay_compare_ids");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCompareIds(parsed.slice(0, 3));
      }
    } catch {
      // ignore
    }
    setIsCompareHydrated(true);
  }, []);

  // Persist compare to localStorage
  useEffect(() => {
    if (isCompareHydrated) {
      localStorage.setItem("skay_compare_ids", JSON.stringify(compareIds));
    }
  }, [compareIds, isCompareHydrated]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const isCompared = compareIds.includes(vehicle.id);
  const maxCompareReached = compareIds.length >= 3;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("en-CA").format(mileage);
  };

  const monthlyPayment = useMemo(() => {
    const price = parseFloat(calcPrice || "0");
    const down = parseFloat(downPayment || "0");
    const rate = parseFloat(interestRate || "0");
    const term = parseInt(loanTerm || "0", 10);

    if (!price || !term || down >= price) return 0;

    const principal = price - down;
    const monthlyRate = rate / 1200;

    if (monthlyRate === 0) {
      return principal / term;
    }

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
      (Math.pow(1 + monthlyRate, term) - 1);

    return isFinite(payment) ? payment : 0;
  }, [calcPrice, downPayment, interestRate, loanTerm]);

  const nextImage = () => {
    setSelectedImageIndex((i) => (i + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (i) => (i - 1 + vehicle.images.length) % vehicle.images.length
    );
  };

  const statusColors: Record<Vehicle["status"], string> = {
    available: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    sold: "bg-red-500/15 text-red-400 border-red-500/20",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  };

  const hasSavings = vehicle.msrp && vehicle.msrp > vehicle.price;
  const savings = hasSavings ? vehicle.msrp! - vehicle.price : 0;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/inventory/${vehicle.slug}`
      : "";

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleShareX = () => {
    const text = `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const specs = [
    { label: "Year", value: vehicle.year },
    { label: "Make", value: vehicle.make },
    { label: "Model", value: vehicle.model },
    { label: "Trim", value: vehicle.trim },
    { label: "Mileage", value: `${formatMileage(vehicle.mileage)} km` },
    { label: "Body Style", value: vehicle.bodyStyle },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Fuel Type", value: vehicle.fuelType },
    { label: "Drive Type", value: vehicle.driveType },
    { label: "Doors", value: vehicle.doors },
    { label: "Seats", value: vehicle.seats },
    { label: "Engine", value: vehicle.engine },
    { label: "Exterior Color", value: vehicle.exteriorColor },
    { label: "Interior Color", value: vehicle.interiorColor },
    { label: "Status", value: vehicle.status },
  ];

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Breadcrumb / Back */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#C0A66A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Inventory
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4"
          >
            {/* Main Image */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
              <DialogTrigger
                render={
                  <button className="relative w-full aspect-[4/3] bg-[#111] border border-white/5 overflow-hidden cursor-zoom-in group">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={
                            vehicle.images[selectedImageIndex] ||
                            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800/placeholder-car.jpgq=80"
                          }
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                    {vehicle.featured && (
                      <Badge className="absolute top-4 left-4 bg-[#C0A66A] text-black hover:bg-[#C0A66A] font-medium">
                        Featured
                      </Badge>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-black/60 text-white text-sm px-4 py-2 backdrop-blur-sm">
                        Click to enlarge
                      </span>
                    </div>
                  </button>
                }
              />
              <DialogContent className="max-w-6xl w-full bg-black border-white/10 p-0 overflow-hidden">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={
                      vehicle.images[selectedImageIndex] ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800/placeholder-car.jpgq=80"
                    }
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                  {vehicle.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Thumbnails */}
            {vehicle.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden border transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-[#C0A66A] ring-1 ring-[#C0A66A]/50"
                        : "border-white/10 hover:border-[#C0A66A]/30"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Video */}
            {vehicle.videoUrl && (
              <div className="border border-white/10 bg-[#111] p-4">
                <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">Video Walkaround</h3>
                <video
                  src={vehicle.videoUrl}
                  className="w-full aspect-video object-cover"
                  controls
                  playsInline
                  poster={vehicle.images[0]}
                />
              </div>
            )}
          </motion.div>

          {/* Vehicle Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col"
          >
            {/* Title & Price */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-3 mb-3"
              >
                <Badge
                  variant="outline"
                  className={`text-xs font-medium uppercase tracking-wider ${statusColors[vehicle.status]}`}
                >
                  {vehicle.status}
                </Badge>
                <span className="text-white/40 text-sm">
                  {formatMileage(vehicle.mileage)} km
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4"
              >
                {vehicle.year} {vehicle.make} {vehicle.model}
                {vehicle.trim && (
                  <span className="text-white/60"> {vehicle.trim}</span>
                )}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap items-center gap-4"
              >
                {hasSavings && (
                  <>
                    <span className="text-xl text-white/40 line-through">
                      MSRP: {formatPrice(vehicle.msrp!)}
                    </span>
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 px-3 py-1">
                      Save {formatPrice(savings)}
                    </Badge>
                  </>
                )}
                <p className="text-3xl md:text-4xl font-semibold text-[#C0A66A]">
                  {formatPrice(vehicle.price)}
                </p>
              </motion.div>
            </div>

            {/* Key Specs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-[#111] border border-white/5 p-4">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Year</span>
                </div>
                <p className="text-white text-lg font-medium">{vehicle.year}</p>
              </div>
              <div className="bg-[#111] border border-white/5 p-4">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Gauge className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">
                    Mileage
                  </span>
                </div>
                <p className="text-white text-lg font-medium">
                  {formatMileage(vehicle.mileage)} km
                </p>
              </div>
              <div className="bg-[#111] border border-white/5 p-4">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">
                    Status
                  </span>
                </div>
                <p className="text-white text-lg font-medium capitalize">
                  {vehicle.status}
                </p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-white text-lg font-medium mb-3">
                Description
              </h2>
              <p className="text-white/60 leading-relaxed">
                {vehicle.description}
              </p>
            </motion.div>

            {/* Full Specs Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
              className="mb-10"
            >
              <h2 className="text-white text-lg font-medium mb-4">
                Specifications
              </h2>
              <div className="bg-[#111] border border-white/5 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {specs.map((spec) =>
                    spec.value !== undefined && spec.value !== null ? (
                      <div
                        key={spec.label}
                        className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0"
                      >
                        <span className="text-white/50 text-sm">
                          {spec.label}
                        </span>
                        <span className="text-white text-sm font-medium text-right">
                          {typeof spec.value === "number"
                            ? spec.value
                            : spec.value}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </motion.div>

            {/* Features */}
            {vehicle.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mb-10"
              >
                <h2 className="text-white text-lg font-medium mb-4">
                  Features
                </h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.03, duration: 0.3 }}
                    >
                      <Badge
                        variant="outline"
                        className="border-white/10 bg-[#111] text-white/80 hover:border-[#C0A66A]/30 hover:text-[#C0A66A] transition-colors px-3 py-1"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1.5 text-[#C0A66A]" />
                        {feature}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-white/5"
            >
              <Dialog open={calcOpen} onOpenChange={setCalcOpen}>
                <DialogTrigger
                  render={
                    <Button className="flex-1 h-12 bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86] transition-all duration-300">
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculate Payment
                    </Button>
                  }
                />
                <DialogContent className="bg-[#111] border-white/10 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-[#C0A66A]" />
                      Payment Calculator
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5 pt-2">
                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs uppercase tracking-wider">
                        Vehicle Price
                      </Label>
                      <Input
                        type="number"
                        value={calcPrice}
                        onChange={(e) => setCalcPrice(e.target.value)}
                        className="bg-black border-white/10 text-white focus-visible:border-[#C0A66A]/50 focus-visible:ring-[#C0A66A]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs uppercase tracking-wider">
                        Down Payment
                      </Label>
                      <Input
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        className="bg-black border-white/10 text-white focus-visible:border-[#C0A66A]/50 focus-visible:ring-[#C0A66A]/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white/60 text-xs uppercase tracking-wider">
                          Interest Rate (%)
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          className="bg-black border-white/10 text-white focus-visible:border-[#C0A66A]/50 focus-visible:ring-[#C0A66A]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/60 text-xs uppercase tracking-wider">
                          Loan Term (months)
                        </Label>
                        <Select
                          value={loanTerm}
                          onValueChange={(v) => v && setLoanTerm(v)}
                        >
                          <SelectTrigger className="w-full bg-black border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                            <SelectValue placeholder="Term" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#111] border-white/10">
                            {[36, 48, 60, 72, 84].map((t) => (
                              <SelectItem
                                key={t}
                                value={t.toString()}
                                className="text-white focus:bg-[#C0A66A]/10 focus:text-white"
                              >
                                {t} mo
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-black border border-white/5 p-5 text-center">
                      <p className="text-white/50 text-sm mb-1">
                        Estimated Monthly Payment
                      </p>
                      <p className="text-3xl font-semibold text-[#C0A66A]">
                        {formatPrice(monthlyPayment)}
                      </p>
                    </div>

                    <p className="text-xs text-white/40 flex items-start gap-2">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      This estimate is for illustrative purposes only and does
                      not include taxes, fees, or other charges.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <Link href="/finance" className="flex-1">
                <Button className="w-full h-12 bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86] transition-all duration-300">
                  Apply for Financing
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full h-12 border-white/20 text-white font-medium hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent transition-all duration-300"
                >
                  Contact Us
                </Button>
              </Link>
            </motion.div>

            {/* Compare Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-4"
            >
              <button
                onClick={() => toggleCompare(vehicle.id)}
                disabled={!isCompared && maxCompareReached}
                className={`flex items-center gap-2 border px-4 py-2 transition-colors ${
                  isCompared
                    ? "border-[#C0A66A] bg-[#C0A66A]/10 text-[#C0A66A]"
                    : "border-white/10 bg-transparent text-white hover:border-[#C0A66A]/50 hover:text-[#C0A66A]"
                } ${!isCompared && maxCompareReached ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Scale className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isCompared ? "Remove from Compare" : "Add to Compare"}
                </span>
                <span className="text-xs text-white/50">({compareIds.length}/3)</span>
              </button>
            </motion.div>

            {/* Share Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="mt-6"
            >
              <p className="text-white/50 text-sm mb-3">Share this vehicle</p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleShareFacebook}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-[#111] text-white hover:border-[#C0A66A]/50 hover:text-[#C0A66A] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm">Facebook</span>
                </button>
                <button
                  onClick={handleShareX}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-[#111] text-white hover:border-[#C0A66A]/50 hover:text-[#C0A66A] transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-sm">X</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-[#111] text-white hover:border-[#C0A66A]/50 hover:text-[#C0A66A] transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                  <span className="text-sm">
                    {copied ? "Copied!" : "Copy Link"}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Similar Vehicles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light text-white">
              Similar <span className="text-[#C0A66A]">Vehicles</span>
            </h2>
            <Link
              href="/inventory"
              className="text-sm text-white/50 hover:text-[#C0A66A] transition-colors"
            >
              View All &rarr;
            </Link>
          </div>

          {similarLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#111] border border-white/5 overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-white/5 animate-pulse" />
                  <div className="p-5 space-y-4">
                    <div className="h-5 bg-white/5 animate-pulse w-3/4" />
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-white/5 animate-pulse w-1/3" />
                      <div className="h-4 bg-white/5 animate-pulse w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : similarVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((v, index) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  index={index}
                  compareIds={compareIds}
                  onToggleCompare={toggleCompare}
                  maxCompareReached={maxCompareReached}
                />
              ))}
            </div>
          ) : (
            <p className="text-white/50">
              No similar vehicles available at the moment.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
