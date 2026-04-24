"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import VehicleCard from "@/components/public/VehicleCard";
import CompareBar from "@/components/public/CompareBar";
import type { Vehicle } from "@/types";

type SortOption = "newest" | "price-asc" | "price-desc" | "year-desc" | "mileage-asc";

export default function InventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastWrittenUrl = useRef<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Compare state
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareHydrated, setIsCompareHydrated] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [mileageMax, setMileageMax] = useState("");
  const [bodyStyleFilter, setBodyStyleFilter] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("");
  const [driveTypeFilter, setDriveTypeFilter] = useState("");
  const [doorsFilter, setDoorsFilter] = useState("");
  const [seatsFilter, setSeatsFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");

  // View & Sort & Pagination
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((res) => res.json())
      .then((data: Vehicle[] | { error: string }) => {
        setVehicles(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => {
        setVehicles([]);
        setIsLoading(false);
      });
  }, []);

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

  const maxCompareReached = compareIds.length >= 3;

  const uniqueMakes = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.make).filter(Boolean))).sort(),
    [vehicles]
  );

  const uniqueModels = useMemo(() => {
    const source = makeFilter
      ? vehicles.filter((v) => v.make === makeFilter)
      : vehicles;
    return Array.from(new Set(source.map((v) => v.model).filter(Boolean))).sort();
  }, [vehicles, makeFilter]);

  const uniqueBodyStyles = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.bodyStyle).filter(Boolean))).sort(),
    [vehicles]
  );

  const uniqueTransmissions = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.transmission).filter(Boolean))).sort(),
    [vehicles]
  );

  const uniqueFuelTypes = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.fuelType).filter(Boolean))).sort(),
    [vehicles]
  );

  const uniqueDriveTypes = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.driveType).filter(Boolean))).sort(),
    [vehicles]
  );

  const uniqueDoors = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.doors).filter((d) => d !== null && d !== undefined)))
        .sort((a, b) => (a as number) - (b as number))
        .map(String),
    [vehicles]
  );

  const uniqueSeats = useMemo(
    () =>
      Array.from(new Set(vehicles.map((v) => v.seats).filter((s) => s !== null && s !== undefined)))
        .sort((a, b) => (a as number) - (b as number))
        .map(String),
    [vehicles]
  );

  const uniqueColors = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.exteriorColor).filter(Boolean))).sort(),
    [vehicles]
  );

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.year.toString().includes(query)
      );
    }

    if (makeFilter) {
      result = result.filter((v) => v.make === makeFilter);
    }

    if (modelFilter) {
      result = result.filter((v) => v.model === modelFilter);
    }

    const yMin = yearMin ? parseInt(yearMin, 10) : 0;
    const yMax = yearMax ? parseInt(yearMax, 10) : Infinity;
    if (yMin > 0 || yMax < Infinity) {
      result = result.filter((v) => v.year >= yMin && v.year <= yMax);
    }

    const pMin = minPrice ? parseFloat(minPrice) : 0;
    const pMax = maxPrice ? parseFloat(maxPrice) : Infinity;
    if (pMin > 0 || pMax < Infinity) {
      result = result.filter((v) => v.price >= pMin && v.price <= pMax);
    }

    const mMax = mileageMax ? parseFloat(mileageMax) : Infinity;
    if (mMax < Infinity) {
      result = result.filter((v) => v.mileage <= mMax);
    }

    if (bodyStyleFilter) {
      result = result.filter((v) => v.bodyStyle === bodyStyleFilter);
    }

    if (transmissionFilter) {
      result = result.filter((v) => v.transmission === transmissionFilter);
    }

    if (fuelTypeFilter) {
      result = result.filter((v) => v.fuelType === fuelTypeFilter);
    }

    if (driveTypeFilter) {
      result = result.filter((v) => v.driveType === driveTypeFilter);
    }

    if (doorsFilter) {
      const d = parseInt(doorsFilter, 10);
      result = result.filter((v) => v.doors === d);
    }

    if (seatsFilter) {
      const s = parseInt(seatsFilter, 10);
      result = result.filter((v) => v.seats === s);
    }

    if (colorFilter) {
      result = result.filter((v) => v.exteriorColor === colorFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "year-desc":
          return b.year - a.year;
        case "mileage-asc":
          return a.mileage - b.mileage;
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [
    vehicles,
    searchQuery,
    makeFilter,
    modelFilter,
    yearMin,
    yearMax,
    minPrice,
    maxPrice,
    mileageMax,
    bodyStyleFilter,
    transmissionFilter,
    fuelTypeFilter,
    driveTypeFilter,
    doorsFilter,
    seatsFilter,
    colorFilter,
    sortBy,
  ]);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    makeFilter,
    modelFilter,
    yearMin,
    yearMax,
    minPrice,
    maxPrice,
    mileageMax,
    bodyStyleFilter,
    transmissionFilter,
    fuelTypeFilter,
    driveTypeFilter,
    doorsFilter,
    seatsFilter,
    colorFilter,
    sortBy,
    itemsPerPage,
  ]);

  // Initialize / sync filters from URL (e.g. when arriving from homepage or brand links)
  useEffect(() => {
    if (!searchParams) return;
    const current = searchParams.toString();
    if (lastWrittenUrl.current === current) {
      lastWrittenUrl.current = null;
      return;
    }
    setSearchQuery(searchParams.get("q") || searchParams.get("search") || "");
    setMakeFilter(searchParams.get("make") || "");
    setModelFilter(searchParams.get("model") || "");
    setYearMin(searchParams.get("minYear") || "");
    setYearMax(searchParams.get("maxYear") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setMileageMax(searchParams.get("maxMileage") || searchParams.get("mileageMax") || "");
    setBodyStyleFilter(searchParams.get("bodyStyle") || "");
    setTransmissionFilter(searchParams.get("transmission") || "");
    setFuelTypeFilter(searchParams.get("fuelType") || "");
    setDriveTypeFilter(searchParams.get("driveType") || "");
    setDoorsFilter(searchParams.get("doors") || "");
    setSeatsFilter(searchParams.get("seats") || "");
    setColorFilter(searchParams.get("color") || searchParams.get("exteriorColor") || "");
  }, [searchParams]);

  // Sync URL with active filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (makeFilter) params.set("make", makeFilter);
    if (modelFilter) params.set("model", modelFilter);
    if (yearMin) params.set("minYear", yearMin);
    if (yearMax) params.set("maxYear", yearMax);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (mileageMax) params.set("maxMileage", mileageMax);
    if (bodyStyleFilter) params.set("bodyStyle", bodyStyleFilter);
    if (transmissionFilter) params.set("transmission", transmissionFilter);
    if (fuelTypeFilter) params.set("fuelType", fuelTypeFilter);
    if (driveTypeFilter) params.set("driveType", driveTypeFilter);
    if (doorsFilter) params.set("doors", doorsFilter);
    if (seatsFilter) params.set("seats", seatsFilter);
    if (colorFilter) params.set("color", colorFilter);
    const query = params.toString();
    const url = query ? `/inventory?${query}` : "/inventory";
    lastWrittenUrl.current = query;
    router.replace(url, { scroll: false });
  }, [
    searchQuery,
    makeFilter,
    modelFilter,
    yearMin,
    yearMax,
    minPrice,
    maxPrice,
    mileageMax,
    bodyStyleFilter,
    transmissionFilter,
    fuelTypeFilter,
    driveTypeFilter,
    doorsFilter,
    seatsFilter,
    colorFilter,
    router,
  ]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setSearchQuery("");
    setMakeFilter("");
    setModelFilter("");
    setYearMin("");
    setYearMax("");
    setMinPrice("");
    setMaxPrice("");
    setMileageMax("");
    setBodyStyleFilter("");
    setTransmissionFilter("");
    setFuelTypeFilter("");
    setDriveTypeFilter("");
    setDoorsFilter("");
    setSeatsFilter("");
    setColorFilter("");
    setSortBy("newest");
  };

  const activeFilterCount = [
    makeFilter,
    modelFilter,
    yearMin,
    yearMax,
    minPrice,
    maxPrice,
    mileageMax,
    bodyStyleFilter,
    transmissionFilter,
    fuelTypeFilter,
    driveTypeFilter,
    doorsFilter,
    seatsFilter,
    colorFilter,
    searchQuery,
  ].filter((v) => v !== "").length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  const compareVehicles = useMemo(
    () => vehicles.filter((v) => compareIds.includes(v.id)),
    [vehicles, compareIds]
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">
              Premium Selection
            </p>
            <h1 className="text-3xl md:text-5xl font-light text-white">
              Our <span className="text-gradient-gold">Inventory</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Inventory with Sidebar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters((v) => !v)}
                className="w-full border-white/10 text-white hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {showMobileFilters ? "Hide Filters" : "Show Filters"}
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-[#C0A66A] text-black text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Sidebar Filters */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}
            >
              <div className="lg:sticky lg:top-[120px] bg-[#111] border border-white/5 p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-medium flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#C0A66A]" />
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-white/60 hover:text-[#C0A66A] hover:bg-transparent h-auto py-1 px-2"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Make */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Make</Label>
                  <Select value={makeFilter} onValueChange={(v) => v !== null && setMakeFilter(v)}>
                    <SelectTrigger className="w-full bg-black border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                      <SelectValue placeholder="All Makes" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      <SelectItem value="" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                        All Makes
                      </SelectItem>
                      {uniqueMakes.map((make) => (
                        <SelectItem key={make} value={make} className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Model</Label>
                  <Select value={modelFilter} onValueChange={(v) => v !== null && setModelFilter(v)}>
                    <SelectTrigger className="w-full bg-black border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                      <SelectValue placeholder="All Models" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      <SelectItem value="" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                        All Models
                      </SelectItem>
                      {uniqueModels.map((model) => (
                        <SelectItem key={model} value={model} className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Range */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Year Range</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={yearMin}
                      onChange={(e) => setYearMin(e.target.value)}
                      className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:border-[#C0A66A]/50 focus-visible:ring-[#C0A66A]/20 h-10"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={yearMax}
                      onChange={(e) => setYearMax(e.target.value)}
                      className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:border-[#C0A66A]/50 focus-visible:ring-[#C0A66A]/20 h-10"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Price Range</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Min $"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:border-[#C0A66A]/50 focus-visible:ring-[#C0A66A]/20 h-10"
                    />
                    <Input
                      type="number"
                      placeholder="Max $"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:border-[#C0A66A]/50 focus-visible:ring-[#C0A66A]/20 h-10"
                    />
                  </div>
                </div>

                {/* Max Mileage */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Max Mileage</Label>
                  <Input
                    type="number"
                    placeholder="Any"
                    value={mileageMax}
                    onChange={(e) => setMileageMax(e.target.value)}
                    className="w-full bg-black border-white/10 text-white placeholder:text-white/40 focus-visible:border-[#C0A66A]/50 focus-visible:ring-[#C0A66A]/20 h-10"
                  />
                </div>

                {/* Body Style */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Body Style</Label>
                  <Select value={bodyStyleFilter} onValueChange={(v) => v !== null && setBodyStyleFilter(v)}>
                    <SelectTrigger className="w-full bg-black border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                      <SelectValue placeholder="All Body Styles" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      <SelectItem value="" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                        All Body Styles
                      </SelectItem>
                      {uniqueBodyStyles.map((style) => (
                        <SelectItem key={style} value={style} className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transmission */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Transmission</Label>
                  <Select value={transmissionFilter} onValueChange={(v) => v !== null && setTransmissionFilter(v)}>
                    <SelectTrigger className="w-full bg-black border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                      <SelectValue placeholder="All Transmissions" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      <SelectItem value="" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                        All Transmissions
                      </SelectItem>
                      {uniqueTransmissions.map((t) => (
                        <SelectItem key={t} value={t} className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Fuel Type</Label>
                  <Select value={fuelTypeFilter} onValueChange={(v) => v !== null && setFuelTypeFilter(v)}>
                    <SelectTrigger className="w-full bg-black border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                      <SelectValue placeholder="All Fuel Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      <SelectItem value="" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                        All Fuel Types
                      </SelectItem>
                      {uniqueFuelTypes.map((ft) => (
                        <SelectItem key={ft} value={ft} className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          {ft}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Drive Type */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Drive Type</Label>
                  <Select value={driveTypeFilter} onValueChange={(v) => v !== null && setDriveTypeFilter(v)}>
                    <SelectTrigger className="w-full bg-black border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                      <SelectValue placeholder="All Drive Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      <SelectItem value="" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                        All Drive Types
                      </SelectItem>
                      {uniqueDriveTypes.map((dt) => (
                        <SelectItem key={dt} value={dt} className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          {dt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Doors */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Doors</Label>
                  <Select value={doorsFilter} onValueChange={(v) => v !== null && setDoorsFilter(v)}>
                    <SelectTrigger className="w-full bg-black border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      <SelectItem value="" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                        Any
                      </SelectItem>
                      {uniqueDoors.map((d) => (
                        <SelectItem key={d} value={d} className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Seats */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Seats</Label>
                  <Select value={seatsFilter} onValueChange={(v) => v !== null && setSeatsFilter(v)}>
                    <SelectTrigger className="w-full bg-black border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      <SelectItem value="" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                        Any
                      </SelectItem>
                      {uniqueSeats.map((s) => (
                        <SelectItem key={s} value={s} className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Exterior Color */}
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Exterior Color</Label>
                  <Select value={colorFilter} onValueChange={(v) => v !== null && setColorFilter(v)}>
                    <SelectTrigger className="w-full bg-black border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                      <SelectValue placeholder="All Colors" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      <SelectItem value="" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                        All Colors
                      </SelectItem>
                      {uniqueColors.map((color) => (
                        <SelectItem key={color} value={color} className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent"
                >
                  Clear All Filters
                </Button>
              </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Top Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col gap-4 mb-6"
              >
                <div className="flex flex-col md:flex-row gap-4 md:items-end">
                  {/* Search */}
                  <div className="flex-1 min-w-0">
                    <Label className="text-white/60 mb-2 block text-xs uppercase tracking-wider">
                      Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input
                        type="text"
                        placeholder="Search by make, model, or year..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-[#111] border-white/10 text-white placeholder:text-white/40 focus-visible:border-[#C0A66A]/50 focus-visible:ring-[#C0A66A]/20 h-10"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="w-full md:w-56">
                    <Label className="text-white/60 mb-2 block text-xs uppercase tracking-wider">
                      Sort By
                    </Label>
                    <Select value={sortBy} onValueChange={(value) => value && setSortBy(value as SortOption)}>
                      <SelectTrigger className="w-full bg-[#111] border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="w-4 h-4 text-white/40" />
                          <SelectValue placeholder="Sort by" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10">
                        <SelectItem value="newest" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          Newest Arrival
                        </SelectItem>
                        <SelectItem value="price-asc" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-desc" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="year-desc" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          Year: New to Old
                        </SelectItem>
                        <SelectItem value="mileage-asc" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          Mileage: Low to High
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Items per page */}
                  <div className="w-full md:w-36">
                    <Label className="text-white/60 mb-2 block text-xs uppercase tracking-wider">
                      Per Page
                    </Label>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => value && setItemsPerPage(parseInt(value, 10))}
                    >
                      <SelectTrigger className="w-full bg-[#111] border-white/10 text-white focus:border-[#C0A66A]/50 focus:ring-[#C0A66A]/20 h-10">
                        <SelectValue placeholder="12" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10">
                        <SelectItem value="12" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          12
                        </SelectItem>
                        <SelectItem value="24" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          24
                        </SelectItem>
                        <SelectItem value="36" className="text-white focus:bg-[#C0A66A]/10 focus:text-white">
                          36
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {/* Results count */}
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>
                      Showing <span className="text-white font-medium">{filteredVehicles.length}</span> vehicle
                      {filteredVehicles.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center bg-[#111] border border-white/5 p-1">
                    <button
                      onClick={() => setView("grid")}
                      className={`p-2 transition-colors ${
                        view === "grid"
                          ? "bg-[#C0A66A] text-black"
                          : "text-white/50 hover:text-white"
                      }`}
                      aria-label="Grid view"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={`p-2 transition-colors ${
                        view === "list"
                          ? "bg-[#C0A66A] text-black"
                          : "text-white/50 hover:text-white"
                      }`}
                      aria-label="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Vehicle Grid / List */}
              {isLoading ? (
                <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className={`bg-[#111] border border-white/5 overflow-hidden ${
                        view === "list" ? "flex flex-col sm:flex-row" : ""
                      }`}
                    >
                      <div className={`bg-white/5 animate-pulse ${view === "list" ? "w-full sm:w-56 aspect-[4/3] sm:aspect-auto sm:min-h-[180px]" : "aspect-[4/3]"}`} />
                      <div className="p-5 space-y-4 flex-1">
                        <div className="h-5 bg-white/5 animate-pulse w-3/4" />
                        <div className="flex items-center justify-between">
                          <div className="h-6 bg-white/5 animate-pulse w-1/3" />
                          <div className="h-4 bg-white/5 animate-pulse w-1/4" />
                        </div>
                        <div className="pt-4 border-t border-white/5">
                          <div className="h-4 bg-white/5 animate-pulse w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : paginatedVehicles.length > 0 ? (
                <>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={
                      view === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "space-y-4"
                    }
                  >
                    <AnimatePresence mode="popLayout">
                      {paginatedVehicles.map((vehicle, index) => (
                        <motion.div key={vehicle.id} variants={itemVariants} layout>
                          <VehicleCard
                            vehicle={vehicle}
                            index={index}
                            layout={view}
                            compareIds={compareIds}
                            onToggleCompare={toggleCompare}
                            maxCompareReached={maxCompareReached}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-sm text-white/50">
                        Page <span className="text-white">{currentPage}</span> of{" "}
                        <span className="text-white">{totalPages}</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="border-white/10 text-white hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent disabled:opacity-40"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Prev
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-[#C0A66A] text-black"
                                  : "text-white/70 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="border-white/10 text-white hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent disabled:opacity-40"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-[#111] border border-white/5 flex items-center justify-center">
                    <Search className="w-6 h-6 text-white/30" />
                  </div>
                  <h3 className="text-xl text-white font-light mb-2">No vehicles found</h3>
                  <p className="text-white/50 max-w-md mx-auto">
                    Try adjusting your search or filters to find what you&apos;re looking for.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Compare Bar */}
      <CompareBar
        vehicles={compareVehicles}
        onRemove={(id) => toggleCompare(id)}
        onClear={() => setCompareIds([])}
      />
    </div>
  );
}
