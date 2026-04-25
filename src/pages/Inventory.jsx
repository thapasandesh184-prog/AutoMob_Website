import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List, X, ChevronLeft, ChevronRight } from 'lucide-react';
import VehicleCard from '@/components/VehicleCard';
import CompareBar from '@/components/CompareBar';

export default function Inventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [compareIds, setCompareIds] = useState([]);
  const [isCompareHydrated, setIsCompareHydrated] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [makeFilter, setMakeFilter] = useState(searchParams.get('make') || '');
  const [modelFilter, setModelFilter] = useState(searchParams.get('model') || '');
  const [yearMin, setYearMin] = useState(searchParams.get('minYear') || '');
  const [yearMax, setYearMax] = useState(searchParams.get('maxYear') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [mileageMax, setMileageMax] = useState(searchParams.get('maxMileage') || '');
  const [bodyStyleFilter, setBodyStyleFilter] = useState(searchParams.get('bodyStyle') || '');
  const [transmissionFilter, setTransmissionFilter] = useState(searchParams.get('transmission') || '');
  const [fuelTypeFilter, setFuelTypeFilter] = useState(searchParams.get('fuelType') || '');
  const [driveTypeFilter, setDriveTypeFilter] = useState(searchParams.get('driveType') || '');
  const [doorsFilter, setDoorsFilter] = useState(searchParams.get('doors') || '');
  const [seatsFilter, setSeatsFilter] = useState(searchParams.get('seats') || '');
  const [colorFilter, setColorFilter] = useState(searchParams.get('color') || '');

  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState('grid');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('/api/vehicles')
      .then((res) => res.json())
      .then((data) => { setVehicles(Array.isArray(data) ? data : []); setIsLoading(false); })
      .catch(() => { setVehicles([]); setIsLoading(false); });
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('skay_compare_ids');
      if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) setCompareIds(parsed.slice(0, 3)); }
    } catch {}
    setIsCompareHydrated(true);
  }, []);

  useEffect(() => {
    if (isCompareHydrated) localStorage.setItem('skay_compare_ids', JSON.stringify(compareIds));
  }, [compareIds, isCompareHydrated]);

  const toggleCompare = (id) => {
    setCompareIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id]);
  };

  const uniqueMakes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.make).filter(Boolean))).sort(), [vehicles]);
  const uniqueModels = useMemo(() => {
    const source = makeFilter ? vehicles.filter((v) => v.make === makeFilter) : vehicles;
    return Array.from(new Set(source.map((v) => v.model).filter(Boolean))).sort();
  }, [vehicles, makeFilter]);
  const uniqueBodyStyles = useMemo(() => Array.from(new Set(vehicles.map((v) => v.bodyStyle).filter(Boolean))).sort(), [vehicles]);
  const uniqueTransmissions = useMemo(() => Array.from(new Set(vehicles.map((v) => v.transmission).filter(Boolean))).sort(), [vehicles]);
  const uniqueFuelTypes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.fuelType).filter(Boolean))).sort(), [vehicles]);
  const uniqueDriveTypes = useMemo(() => Array.from(new Set(vehicles.map((v) => v.driveType).filter(Boolean))).sort(), [vehicles]);
  const uniqueDoors = useMemo(() => Array.from(new Set(vehicles.map((v) => v.doors).filter((d) => d != null))).sort((a, b) => a - b).map(String), [vehicles]);
  const uniqueSeats = useMemo(() => Array.from(new Set(vehicles.map((v) => v.seats).filter((s) => s != null))).sort((a, b) => a - b).map(String), [vehicles]);
  const uniqueColors = useMemo(() => Array.from(new Set(vehicles.map((v) => v.exteriorColor).filter(Boolean))).sort(), [vehicles]);

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((v) => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.year.toString().includes(q));
    }
    if (makeFilter) result = result.filter((v) => v.make === makeFilter);
    if (modelFilter) result = result.filter((v) => v.model === modelFilter);
    const yMin = yearMin ? parseInt(yearMin, 10) : 0;
    const yMax = yearMax ? parseInt(yearMax, 10) : Infinity;
    if (yMin > 0 || yMax < Infinity) result = result.filter((v) => v.year >= yMin && v.year <= yMax);
    const pMin = minPrice ? parseFloat(minPrice) : 0;
    const pMax = maxPrice ? parseFloat(maxPrice) : Infinity;
    if (pMin > 0 || pMax < Infinity) result = result.filter((v) => v.price >= pMin && v.price <= pMax);
    const mMax = mileageMax ? parseFloat(mileageMax) : Infinity;
    if (mMax < Infinity) result = result.filter((v) => v.mileage <= mMax);
    if (bodyStyleFilter) result = result.filter((v) => v.bodyStyle === bodyStyleFilter);
    if (transmissionFilter) result = result.filter((v) => v.transmission === transmissionFilter);
    if (fuelTypeFilter) result = result.filter((v) => v.fuelType === fuelTypeFilter);
    if (driveTypeFilter) result = result.filter((v) => v.driveType === driveTypeFilter);
    if (doorsFilter) result = result.filter((v) => v.doors === parseInt(doorsFilter, 10));
    if (seatsFilter) result = result.filter((v) => v.seats === parseInt(seatsFilter, 10));
    if (colorFilter) result = result.filter((v) => v.exteriorColor === colorFilter);

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'year-desc': return b.year - a.year;
        case 'mileage-asc': return a.mileage - b.mileage;
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return result;
  }, [vehicles, searchQuery, makeFilter, modelFilter, yearMin, yearMax, minPrice, maxPrice, mileageMax, bodyStyleFilter, transmissionFilter, fuelTypeFilter, driveTypeFilter, doorsFilter, seatsFilter, colorFilter, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, makeFilter, modelFilter, yearMin, yearMax, minPrice, maxPrice, mileageMax, bodyStyleFilter, transmissionFilter, fuelTypeFilter, driveTypeFilter, doorsFilter, seatsFilter, colorFilter, sortBy, itemsPerPage]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const clearFilters = () => {
    setSearchQuery(''); setMakeFilter(''); setModelFilter(''); setYearMin(''); setYearMax('');
    setMinPrice(''); setMaxPrice(''); setMileageMax(''); setBodyStyleFilter(''); setTransmissionFilter('');
    setFuelTypeFilter(''); setDriveTypeFilter(''); setDoorsFilter(''); setSeatsFilter(''); setColorFilter('');
    setSortBy('newest');
  };

  const activeFilterCount = [makeFilter, modelFilter, yearMin, yearMax, minPrice, maxPrice, mileageMax, bodyStyleFilter, transmissionFilter, fuelTypeFilter, driveTypeFilter, doorsFilter, seatsFilter, colorFilter, searchQuery].filter((v) => v !== '').length;

  const compareVehicles = useMemo(() => vehicles.filter((v) => compareIds.includes(v.id)), [vehicles, compareIds]);

  return (
    <div className="min-h-screen bg-black">
      <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3">Premium Selection</p>
            <h1 className="text-3xl md:text-5xl font-light text-white">Our <span className="text-gradient-gold">Inventory</span></h1>
          </motion.div>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:hidden mb-4">
              <button onClick={() => setShowMobileFilters((v) => !v)} className="w-full border border-white/10 text-white hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent px-4 py-2 flex items-center justify-center gap-2 transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                {activeFilterCount > 0 && <span className="ml-2 px-2 py-0.5 bg-[#C0A66A] text-black text-xs rounded-full">{activeFilterCount}</span>}
              </button>
            </div>

            {/* Sidebar Filters */}
            <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="lg:sticky lg:top-[120px] bg-[#111] border border-white/5 p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-medium flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-[#C0A66A]" /> Filters</h2>
                  {activeFilterCount > 0 && <button onClick={clearFilters} className="text-white/60 hover:text-[#C0A66A] hover:bg-transparent h-auto py-1 px-2 text-sm flex items-center gap-1"><X className="w-3 h-3" /> Clear</button>}
                </div>

                {/* Make */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Make</label>
                  <select value={makeFilter} onChange={(e) => setMakeFilter(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none h-10 appearance-none">
                    <option value="">All Makes</option>
                    {uniqueMakes.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Model</label>
                  <select value={modelFilter} onChange={(e) => setModelFilter(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none h-10 appearance-none">
                    <option value="">All Models</option>
                    {uniqueModels.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Year Range */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Year Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Min" value={yearMin} onChange={(e) => setYearMin(e.target.value)} className="bg-black border border-white/10 text-white placeholder:text-white/40 focus:border-[#C0A66A]/50 focus:outline-none h-10 px-3" />
                    <input type="number" placeholder="Max" value={yearMax} onChange={(e) => setYearMax(e.target.value)} className="bg-black border border-white/10 text-white placeholder:text-white/40 focus:border-[#C0A66A]/50 focus:outline-none h-10 px-3" />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Price Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Min $" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="bg-black border border-white/10 text-white placeholder:text-white/40 focus:border-[#C0A66A]/50 focus:outline-none h-10 px-3" />
                    <input type="number" placeholder="Max $" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="bg-black border border-white/10 text-white placeholder:text-white/40 focus:border-[#C0A66A]/50 focus:outline-none h-10 px-3" />
                  </div>
                </div>

                {/* Max Mileage */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Max Mileage</label>
                  <input type="number" placeholder="Any" value={mileageMax} onChange={(e) => setMileageMax(e.target.value)} className="w-full bg-black border border-white/10 text-white placeholder:text-white/40 focus:border-[#C0A66A]/50 focus:outline-none h-10 px-3" />
                </div>

                {/* Body Style */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Body Style</label>
                  <select value={bodyStyleFilter} onChange={(e) => setBodyStyleFilter(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none h-10 appearance-none">
                    <option value="">All Body Styles</option>
                    {uniqueBodyStyles.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Transmission */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Transmission</label>
                  <select value={transmissionFilter} onChange={(e) => setTransmissionFilter(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none h-10 appearance-none">
                    <option value="">All Transmissions</option>
                    {uniqueTransmissions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Fuel Type</label>
                  <select value={fuelTypeFilter} onChange={(e) => setFuelTypeFilter(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none h-10 appearance-none">
                    <option value="">All Fuel Types</option>
                    {uniqueFuelTypes.map((ft) => <option key={ft} value={ft}>{ft}</option>)}
                  </select>
                </div>

                {/* Drive Type */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Drive Type</label>
                  <select value={driveTypeFilter} onChange={(e) => setDriveTypeFilter(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none h-10 appearance-none">
                    <option value="">All Drive Types</option>
                    {uniqueDriveTypes.map((dt) => <option key={dt} value={dt}>{dt}</option>)}
                  </select>
                </div>

                {/* Doors */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Doors</label>
                  <select value={doorsFilter} onChange={(e) => setDoorsFilter(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none h-10 appearance-none">
                    <option value="">Any</option>
                    {uniqueDoors.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Seats */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Seats</label>
                  <select value={seatsFilter} onChange={(e) => setSeatsFilter(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none h-10 appearance-none">
                    <option value="">Any</option>
                    {uniqueSeats.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Exterior Color */}
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Exterior Color</label>
                  <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none h-10 appearance-none">
                    <option value="">All Colors</option>
                    {uniqueColors.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <button onClick={clearFilters} className="w-full border border-white/10 text-white hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent px-4 py-2 transition-colors">
                  Clear All Filters
                </button>
              </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-end">
                  <div className="flex-1 min-w-0">
                    <label className="text-white/60 mb-2 block text-xs uppercase tracking-wider">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input type="text" placeholder="Search by make, model, or year..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 bg-[#111] border border-white/10 text-white placeholder:text-white/40 focus:border-[#C0A66A]/50 focus:outline-none h-10 px-3" />
                    </div>
                  </div>
                  <div className="w-full md:w-56">
                    <label className="text-white/60 mb-2 block text-xs uppercase tracking-wider">Sort By</label>
                    <div className="relative">
                      <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full pl-10 bg-[#111] border border-white/10 text-white focus:border-[#C0A66A]/50 focus:outline-none h-10 px-3 appearance-none">
                        <option value="newest">Newest Arrival</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="year-desc">Year: New to Old</option>
                        <option value="mileage-asc">Mileage: Low to High</option>
                      </select>
                    </div>
                  </div>
                  <div className="w-full md:w-36">
                    <label className="text-white/60 mb-2 block text-xs uppercase tracking-wider">Per Page</label>
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))} className="w-full bg-[#111] border border-white/10 text-white focus:border-[#C0A66A]/50 focus:outline-none h-10 px-3 appearance-none">
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={36}>36</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Showing <span className="text-white font-medium">{filteredVehicles.length}</span> vehicle{filteredVehicles.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center bg-[#111] border border-white/5 p-1">
                    <button onClick={() => setView('grid')} className={`p-2 transition-colors ${view === 'grid' ? 'bg-[#C0A66A] text-black' : 'text-white/50 hover:text-white'}`} aria-label="Grid view"><LayoutGrid className="w-4 h-4" /></button>
                    <button onClick={() => setView('list')} className={`p-2 transition-colors ${view === 'list' ? 'bg-[#C0A66A] text-black' : 'text-white/50 hover:text-white'}`} aria-label="List view"><List className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>

              {isLoading ? (
                <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={`bg-[#111] border border-white/5 overflow-hidden ${view === 'list' ? 'flex flex-col sm:flex-row' : ''}`}>
                      <div className={`bg-white/5 animate-pulse ${view === 'list' ? 'w-full sm:w-56 aspect-[4/3] sm:aspect-auto sm:min-h-[180px]' : 'aspect-[4/3]'}`} />
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
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                    <AnimatePresence mode="popLayout">
                      {paginatedVehicles.map((vehicle, index) => (
                        <motion.div key={vehicle.id} layout>
                          <VehicleCard vehicle={vehicle} index={index} layout={view} compareIds={compareIds} onToggleCompare={toggleCompare} maxCompareReached={compareIds.length >= 3} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {totalPages > 1 && (
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-sm text-white/50">Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span></p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="border border-white/10 text-white hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent disabled:opacity-40 px-3 py-1.5 text-sm flex items-center gap-1 transition-colors">
                          <ChevronLeft className="w-4 h-4" /> Prev
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 text-sm font-medium transition-colors ${currentPage === page ? 'bg-[#C0A66A] text-black' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                              {page}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="border border-white/10 text-white hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent disabled:opacity-40 px-3 py-1.5 text-sm flex items-center gap-1 transition-colors">
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
                  <div className="w-16 h-16 mx-auto mb-6 bg-[#111] border border-white/5 flex items-center justify-center">
                    <Search className="w-6 h-6 text-white/30" />
                  </div>
                  <h3 className="text-xl text-white font-light mb-2">No vehicles found</h3>
                  <p className="text-white/50 max-w-md mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CompareBar vehicles={compareVehicles} onRemove={(id) => toggleCompare(id)} onClear={() => setCompareIds([])} />
    </div>
  );
}
