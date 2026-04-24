"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Vehicle } from "@/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
  layout?: "grid" | "list";
  compareIds?: string[];
  onToggleCompare?: (id: string) => void;
  maxCompareReached?: boolean;
}

export default function VehicleCard({
  vehicle,
  index = 0,
  layout = "grid",
  compareIds = [],
  onToggleCompare,
  maxCompareReached = false,
}: VehicleCardProps) {
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

  const hasSavings = vehicle.msrp && vehicle.msrp > vehicle.price;
  const savings = hasSavings ? vehicle.msrp! - vehicle.price : 0;

  const isList = layout === "list";
  const isCompared = compareIds.includes(vehicle.id);

  const isJustListed = (() => {
    const created = new Date(vehicle.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  })();

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleCompare?.(vehicle.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <Link href={`/inventory/${vehicle.slug}`} className="block">
        <div
          className={`relative bg-[#111] border border-white/5 overflow-hidden hover:border-[#C0A66A]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(192,166,106,0.1)] ${
            isList ? "flex flex-col sm:flex-row" : ""
          }`}
        >
          {/* Image */}
          <div
            className={`relative overflow-hidden ${
              isList
                ? "w-full sm:w-56 md:w-64 flex-shrink-0 aspect-[4/3] sm:aspect-auto sm:min-h-[180px]"
                : "aspect-[4/3]"
            }`}
          >
            <Image
              src={vehicle.images[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800/placeholder-car.jpgq=80"}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes={
                isList
                  ? "(max-width: 640px) 100vw, 256px"
                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badges - top left */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {vehicle.status !== "available" && (
                <Badge className="bg-red-600 text-white hover:bg-red-600 uppercase text-[10px] tracking-wider">
                  {vehicle.status === "sold" ? "SOLD" : "PENDING"}
                </Badge>
              )}
              {hasSavings && (
                <Badge className="bg-[#C0A66A] text-black hover:bg-[#C0A66A] text-[10px] tracking-wider uppercase">
                  Reduced Price
                </Badge>
              )}
              {isJustListed && vehicle.status === "available" && (
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 text-[10px] tracking-wider uppercase">
                  Just Listed
                </Badge>
              )}
              {vehicle.featured && vehicle.status === "available" && (
                <Badge className="bg-white/90 text-black hover:bg-white/90 text-[10px] tracking-wider uppercase">
                  Featured
                </Badge>
              )}
              {vehicle.videoUrl && (
                <Badge className="bg-blue-600 text-white hover:bg-blue-600 text-[10px] tracking-wider uppercase">
                  Video
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col justify-center flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <h3 className="text-lg font-medium text-white group-hover:text-[#C0A66A] transition-colors">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              {isList && hasSavings && (
                <Badge className="self-start sm:self-auto bg-[#C0A66A]/10 text-[#C0A66A] border-[#C0A66A]/20 hover:bg-[#C0A66A]/10">
                  Save {formatPrice(savings)}
                </Badge>
              )}
            </div>

            <div
              className={`flex ${
                isList
                  ? "flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
                  : "items-center justify-between"
              } mb-3`}
            >
              <div className="flex items-center gap-3">
                {hasSavings && (
                  <span className="text-sm text-white/40 line-through">
                    {formatPrice(vehicle.msrp!)}
                  </span>
                )}
                <p className="text-xl font-semibold text-[#C0A66A]">
                  {formatPrice(vehicle.price)}
                </p>
                {!isList && hasSavings && (
                  <Badge className="bg-[#C0A66A]/10 text-[#C0A66A] border-[#C0A66A]/20 hover:bg-[#C0A66A]/10">
                    Save {formatPrice(savings)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-white/50">{formatMileage(vehicle.mileage)} km</p>
            </div>

            {isList && (
              <div className="flex flex-wrap gap-2 mb-3">
                {vehicle.bodyStyle && (
                  <span className="text-xs text-white/60 px-2 py-1 bg-white/5">
                    {vehicle.bodyStyle}
                  </span>
                )}
                {vehicle.transmission && (
                  <span className="text-xs text-white/60 px-2 py-1 bg-white/5">
                    {vehicle.transmission}
                  </span>
                )}
                {vehicle.fuelType && (
                  <span className="text-xs text-white/60 px-2 py-1 bg-white/5">
                    {vehicle.fuelType}
                  </span>
                )}
                {vehicle.exteriorColor && (
                  <span className="text-xs text-white/60 px-2 py-1 bg-white/5">
                    {vehicle.exteriorColor}
                  </span>
                )}
              </div>
            )}

            <div
              className={`mt-auto pt-4 border-t border-white/5 ${
                isList ? "hidden sm:block" : ""
              }`}
            >
              <span className="text-sm text-white/40 group-hover:text-[#C0A66A] transition-colors">
                View Details &rarr;
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Compare checkbox - outside link to prevent navigation */}
      {onToggleCompare && (
        <button
          onClick={handleCompareClick}
          className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white px-2 py-1.5 transition-colors"
          aria-label={isCompared ? "Remove from compare" : "Add to compare"}
          disabled={!isCompared && maxCompareReached}
          title={
            !isCompared && maxCompareReached
              ? "You can compare up to 3 vehicles"
              : undefined
          }
        >
          <Checkbox
            checked={isCompared}
            className="pointer-events-none"
          />
          <span className="text-xs font-medium">Compare</span>
        </button>
      )}
    </motion.div>
  );
}
