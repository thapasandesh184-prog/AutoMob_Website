"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, Scale, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@/types";

const MAX_COMPARE = 3;
const STORAGE_KEY = "prestige_compare_ids";

export default function ComparePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate compare IDs from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCompareIds(parsed.slice(0, MAX_COMPARE));
        }
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  // Fetch vehicles
  useEffect(() => {
    fetch("/api/vehicles")
      .then((res) => res.json())
      .then((data: Vehicle[]) => {
        setVehicles(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Persist compare IDs
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
    }
  }, [compareIds, isHydrated]);

  const comparedVehicles = useMemo(
    () => vehicles.filter((v) => compareIds.includes(v.id)),
    [vehicles, compareIds]
  );

  const removeVehicle = (id: string) => {
    setCompareIds((prev) => prev.filter((x) => x !== id));
  };

  const clearAll = () => {
    setCompareIds([]);
  };

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

  const rows = [
    { label: "Price", getValue: (v: Vehicle) => formatPrice(v.price) },
    { label: "Mileage", getValue: (v: Vehicle) => `${formatMileage(v.mileage)} km` },
    { label: "Year", getValue: (v: Vehicle) => v.year },
    { label: "Make", getValue: (v: Vehicle) => v.make },
    { label: "Model", getValue: (v: Vehicle) => v.model },
    { label: "Trim", getValue: (v: Vehicle) => v.trim || "—" },
    { label: "Body Style", getValue: (v: Vehicle) => v.bodyStyle || "—" },
    { label: "Transmission", getValue: (v: Vehicle) => v.transmission || "—" },
    { label: "Fuel Type", getValue: (v: Vehicle) => v.fuelType || "—" },
    { label: "Drive Type", getValue: (v: Vehicle) => v.driveType || "—" },
    { label: "Doors", getValue: (v: Vehicle) => v.doors ?? "—" },
    { label: "Seats", getValue: (v: Vehicle) => v.seats ?? "—" },
    { label: "Engine", getValue: (v: Vehicle) => v.engine || "—" },
    { label: "Exterior Color", getValue: (v: Vehicle) => v.exteriorColor || "—" },
    { label: "Interior Color", getValue: (v: Vehicle) => v.interiorColor || "—" },
  ];

  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-black pt-8 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-white/5 animate-pulse w-1/3 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#111] border border-white/5 overflow-hidden"
              >
                <div className="aspect-[4/3] bg-white/5 animate-pulse" />
                <div className="p-5 space-y-4">
                  <div className="h-5 bg-white/5 animate-pulse w-3/4" />
                  <div className="h-4 bg-white/5 animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (comparedVehicles.length < 2) {
    return (
      <div className="min-h-screen bg-black pt-8 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#C0A66A] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Inventory
            </Link>
            <div className="text-center py-24">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#111] border border-white/5 flex items-center justify-center">
                <Scale className="w-6 h-6 text-white/30" />
              </div>
              <h2 className="text-2xl font-light text-white mb-3">
                Not enough vehicles to compare
              </h2>
              <p className="text-white/50 max-w-md mx-auto mb-8">
                Select at least 2 vehicles from the inventory to start comparing.
              </p>
              <Link href="/inventory">
                <Button className="bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86]">
                  Browse Inventory
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-8 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#C0A66A] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inventory
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-white">
                Compare <span className="text-[#C0A66A]">Vehicles</span>
              </h1>
              <p className="text-white/50 mt-1">
                Comparing {comparedVehicles.length} vehicle
                {comparedVehicles.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearAll}
              className="border-white/10 text-white hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[640px]">
            {/* Header row with vehicle cards */}
            <div className="grid" style={{ gridTemplateColumns: `160px repeat(${comparedVehicles.length}, minmax(200px, 1fr))` }}>
              <div className="p-4 border-b border-white/10" />
              {comparedVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="p-4 border-b border-white/10 relative"
                >
                  <button
                    onClick={() => removeVehicle(vehicle.id)}
                    className="absolute top-3 right-3 p-1.5 text-white/40 hover:text-white hover:bg-white/10 transition-colors z-10"
                    aria-label={`Remove ${vehicle.make} ${vehicle.model}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <Link href={`/inventory/${vehicle.slug}`} className="block group">
                    <div className="relative aspect-[4/3] overflow-hidden mb-3">
                      <Image
                        src={vehicle.images[0] || "/placeholder-car.jpg"}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="300px"
                      />
                    </div>
                    <h3 className="text-white font-medium group-hover:text-[#C0A66A] transition-colors">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-[#C0A66A] font-semibold mt-1">
                      {formatPrice(vehicle.price)}
                    </p>
                  </Link>
                </div>
              ))}
            </div>

            {/* Spec rows */}
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                style={{ gridTemplateColumns: `160px repeat(${comparedVehicles.length}, minmax(200px, 1fr))` }}
              >
                <div className="p-4 text-white/50 text-sm font-medium flex items-center">
                  {row.label}
                </div>
                {comparedVehicles.map((vehicle) => (
                  <div
                    key={`${row.label}-${vehicle.id}`}
                    className="p-4 text-white text-sm flex items-center"
                  >
                    {row.getValue(vehicle)}
                  </div>
                ))}
              </div>
            ))}

            {/* Features row */}
            <div
              className="grid border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              style={{ gridTemplateColumns: `160px repeat(${comparedVehicles.length}, minmax(200px, 1fr))` }}
            >
              <div className="p-4 text-white/50 text-sm font-medium flex items-start pt-5">
                Features
              </div>
              {comparedVehicles.map((vehicle) => (
                <div
                  key={`features-${vehicle.id}`}
                  className="p-4 text-white text-sm"
                >
                  {vehicle.features.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="border-white/10 bg-[#111] text-white/80 px-2 py-0.5 text-xs"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1 text-[#C0A66A]" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-white/40">—</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
