import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Gauge, Calendar, Tag, CheckCircle2, ChevronLeft, ChevronRight, Calculator, Info, Link2, Scale } from 'lucide-react';
import VehicleCard from '@/components/VehicleCard';
import SEO, { vehicleSchema } from '@/components/SEO';

export default function VehicleDetail() {
  const { slug } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [isCompareHydrated, setIsCompareHydrated] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [calcPrice, setCalcPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('60');

  useEffect(() => {
    fetch(`/api/vehicles/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setVehicle(data);
        setCalcPrice(data.price?.toString() || '');
        setIsLoading(false);
        if (data?.make) {
          fetch(`/api/vehicles?status=available&make=${encodeURIComponent(data.make)}`)
            .then((r) => r.json())
            .then((d) => setSimilarVehicles((Array.isArray(d) ? d : []).filter((v) => v.id !== data.id).slice(0, 3)))
            .catch(() => setSimilarVehicles([]));
        }
      })
      .catch(() => { setVehicle(null); setIsLoading(false); });
  }, [slug]);

  useEffect(() => {
    try { const raw = localStorage.getItem('skay_compare_ids'); if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) setCompareIds(parsed.slice(0, 3)); } } catch {}
    setIsCompareHydrated(true);
  }, []);

  useEffect(() => { if (isCompareHydrated) localStorage.setItem('skay_compare_ids', JSON.stringify(compareIds)); }, [compareIds, isCompareHydrated]);

  const toggleCompare = (id) => { setCompareIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id]); };

  const formatPrice = (price) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(price || 0);
  const formatMileage = (mileage) => new Intl.NumberFormat('en-CA').format(mileage || 0);

  const monthlyPayment = useMemo(() => {
    const price = parseFloat(calcPrice || '0');
    const down = parseFloat(downPayment || '0');
    const rate = parseFloat(interestRate || '0');
    const term = parseInt(loanTerm || '0', 10);
    if (!price || !term || down >= price) return 0;
    const principal = price - down;
    const monthlyRate = rate / 1200;
    if (monthlyRate === 0) return principal / term;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    return isFinite(payment) ? payment : 0;
  }, [calcPrice, downPayment, interestRate, loanTerm]);

  const nextImage = () => setSelectedImageIndex((i) => (i + 1) % (vehicle?.images?.length || 1));
  const prevImage = () => setSelectedImageIndex((i) => (i - 1 + (vehicle?.images?.length || 1)) % (vehicle?.images?.length || 1));

  const handleShareFacebook = () => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400'); };
  const handleShareX = () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this ${vehicle?.year} ${vehicle?.make} ${vehicle?.model}`)}&url=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400'); };
  const handleCopyLink = async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-[4/3] bg-[#111] animate-pulse" />
            <div className="space-y-6">
              <div className="h-10 bg-white/5 animate-pulse w-3/4" />
              <div className="h-8 bg-white/5 animate-pulse w-1/2" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-white/5 animate-pulse" />
                <div className="h-20 bg-white/5 animate-pulse" />
                <div className="h-20 bg-white/5 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Vehicle Not Found</h2>
          <Link to="/inventory" className="text-[#C0A66A] hover:underline">Back to Inventory</Link>
        </div>
      </div>
    );
  }

  const isCompared = compareIds.includes(vehicle.id);
  const maxCompareReached = compareIds.length >= 3;
  const hasSavings = vehicle.msrp && vehicle.msrp > vehicle.price;
  const savings = hasSavings ? vehicle.msrp - vehicle.price : 0;

  const statusColors = {
    available: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    sold: 'bg-red-500/15 text-red-400 border-red-500/20',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  };

  const specs = [
    { label: 'Year', value: vehicle.year },
    { label: 'Make', value: vehicle.make },
    { label: 'Model', value: vehicle.model },
    { label: 'Trim', value: vehicle.trim },
    { label: 'Mileage', value: `${formatMileage(vehicle.mileage)} km` },
    { label: 'Body Style', value: vehicle.bodyStyle },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Fuel Type', value: vehicle.fuelType },
    { label: 'Drive Type', value: vehicle.driveType },
    { label: 'Doors', value: vehicle.doors },
    { label: 'Seats', value: vehicle.seats },
    { label: 'Engine', value: vehicle.engine },
    { label: 'Exterior Color', value: vehicle.exteriorColor },
    { label: 'Interior Color', value: vehicle.interiorColor },
    { label: 'Status', value: vehicle.status },
  ];

  const pageTitle = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle Details';
  const pageDescription = vehicle
    ? `${vehicle.year} ${vehicle.make} ${vehicle.model} - ${formatPrice(vehicle.price)} - ${formatMileage(vehicle.mileage)} km. ${vehicle.description?.slice(0, 150)}...`
    : 'View vehicle details at SKay Auto Group';

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        image={vehicle?.images?.[0]}
        url={`/inventory/${slug}`}
        type="product"
        jsonLd={vehicle ? vehicleSchema(vehicle) : null}
      />
      <div className="min-h-screen bg-black pb-24">
      <div className="px-4 sm:px-6 lg:px-8 py-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link to="/inventory" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[#C0A66A] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Inventory
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
            <button onClick={() => setLightboxOpen(true)} className="relative w-full aspect-[4/3] bg-[#111] border border-white/5 overflow-hidden cursor-zoom-in group">
              <AnimatePresence mode="wait">
                <motion.div key={selectedImageIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                  <img src={vehicle.images[selectedImageIndex] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="eager" />
                </motion.div>
              </AnimatePresence>
              {vehicle.featured && <span className="absolute top-4 left-4 bg-[#C0A66A] text-black text-xs font-medium px-3 py-1">Featured</span>}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-black/60 text-white text-sm px-4 py-2 backdrop-blur-sm">Click to enlarge</span>
              </div>
            </button>

            {/* Lightbox */}
            {lightboxOpen && (
              <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
                <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
                  <img src={vehicle.images[selectedImageIndex]} alt="" className="w-full max-h-[80vh] object-contain" />
                  {vehicle.images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white transition-colors"><ChevronLeft className="w-6 h-6" /></button>
                      <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white transition-colors"><ChevronRight className="w-6 h-6" /></button>
                    </>
                  )}
                  <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white transition-colors text-sm">Close</button>
                </div>
              </div>
            )}

            {vehicle.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {vehicle.images.map((image, index) => (
                  <button key={index} onClick={() => setSelectedImageIndex(index)} className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden border transition-all duration-300 ${selectedImageIndex === index ? 'border-[#C0A66A] ring-1 ring-[#C0A66A]/50' : 'border-white/10 hover:border-[#C0A66A]/30'}`}>
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {vehicle.videoUrl && (
              <div className="border border-white/10 bg-[#111] p-4">
                <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">Video Walkaround</h3>
                <video src={vehicle.videoUrl} className="w-full aspect-video object-cover" controls playsInline poster={vehicle.images[0]} />
              </div>
            )}
          </motion.div>

          {/* Vehicle Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col">
            <div className="mb-8">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-medium uppercase tracking-wider border px-2 py-0.5 ${statusColors[vehicle.status] || statusColors.available}`}>{vehicle.status}</span>
                <span className="text-white/40 text-sm">{formatMileage(vehicle.mileage)} km</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }} className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-4">
                {vehicle.year} {vehicle.make} {vehicle.model}{vehicle.trim && <span className="text-white/60"> {vehicle.trim}</span>}
              </motion.h1>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-wrap items-center gap-4">
                {hasSavings && (
                  <>
                    <span className="text-xl text-white/40 line-through">MSRP: {formatPrice(vehicle.msrp)}</span>
                    <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs">Save {formatPrice(savings)}</span>
                  </>
                )}
                <p className="text-3xl md:text-4xl font-semibold text-[#C0A66A]">{formatPrice(vehicle.price)}</p>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#111] border border-white/5 p-4">
                <div className="flex items-center gap-2 text-white/40 mb-1"><Calendar className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Year</span></div>
                <p className="text-white text-lg font-medium">{vehicle.year}</p>
              </div>
              <div className="bg-[#111] border border-white/5 p-4">
                <div className="flex items-center gap-2 text-white/40 mb-1"><Gauge className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Mileage</span></div>
                <p className="text-white text-lg font-medium">{formatMileage(vehicle.mileage)} km</p>
              </div>
              <div className="bg-[#111] border border-white/5 p-4">
                <div className="flex items-center gap-2 text-white/40 mb-1"><Tag className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Status</span></div>
                <p className="text-white text-lg font-medium capitalize">{vehicle.status}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="mb-8">
              <h2 className="text-white text-lg font-medium mb-3">Description</h2>
              <p className="text-white/60 leading-relaxed">{vehicle.description}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.5 }} className="mb-10">
              <h2 className="text-white text-lg font-medium mb-4">Specifications</h2>
              <div className="bg-[#111] border border-white/5 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {specs.map((spec) => spec.value != null ? (
                    <div key={spec.label} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                      <span className="text-white/50 text-sm">{spec.label}</span>
                      <span className="text-white text-sm font-medium text-right">{spec.value}</span>
                    </div>
                  ) : null)}
                </div>
              </div>
            </motion.div>

            {vehicle.features?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }} className="mb-10">
                <h2 className="text-white text-lg font-medium mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <motion.div key={feature} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + index * 0.03, duration: 0.3 }}>
                      <span className="inline-flex items-center gap-1.5 border border-white/10 bg-[#111] text-white/80 px-3 py-1 text-sm">
                        <CheckCircle2 className="w-3 h-3 text-[#C0A66A]" />{feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }} className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-white/5">
              <button onClick={() => setCalcOpen(true)} className="flex-1 h-12 bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86] transition-all duration-300 flex items-center justify-center gap-2">
                <Calculator className="w-4 h-4" /> Calculate Payment
              </button>
              <Link to="/finance" className="flex-1">
                <button className="w-full h-12 bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86] transition-all duration-300">Apply for Financing</button>
              </Link>
              <Link to="/contact" className="flex-1">
                <button className="w-full h-12 border border-white/20 text-white font-medium hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent transition-all duration-300">Contact Us</button>
              </Link>
            </motion.div>

            {/* Payment Calculator Modal */}
            {calcOpen && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setCalcOpen(false)}>
                <div className="bg-[#111] border border-white/10 text-white max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-medium mb-5 flex items-center gap-2"><Calculator className="w-5 h-5 text-[#C0A66A]" /> Payment Calculator</h3>
                  <div className="space-y-4">
                    <div><label className="text-white/60 text-xs uppercase tracking-wider block mb-1">Vehicle Price</label><input type="number" value={calcPrice} onChange={(e) => setCalcPrice(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" /></div>
                    <div><label className="text-white/60 text-xs uppercase tracking-wider block mb-1">Down Payment</label><input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-white/60 text-xs uppercase tracking-wider block mb-1">Interest Rate (%)</label><input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" /></div>
                      <div><label className="text-white/60 text-xs uppercase tracking-wider block mb-1">Loan Term</label><select value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none appearance-none">
                        {[36, 48, 60, 72, 84].map((t) => <option key={t} value={t}>{t} mo</option>)}
                      </select></div>
                    </div>
                    <div className="bg-black border border-white/5 p-5 text-center">
                      <p className="text-white/50 text-sm mb-1">Estimated Monthly Payment</p>
                      <p className="text-3xl font-semibold text-[#C0A66A]">{formatPrice(monthlyPayment)}</p>
                    </div>
                    <p className="text-xs text-white/40 flex items-start gap-2"><Info className="w-4 h-4 flex-shrink-0 mt-0.5" /> This estimate is for illustrative purposes only and does not include taxes, fees, or other charges.</p>
                    <button onClick={() => setCalcOpen(false)} className="w-full bg-white/10 hover:bg-white/20 text-white py-2 transition-colors">Close</button>
                  </div>
                </div>
              </div>
            )}

            {/* Compare Toggle */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-4">
              <button onClick={() => toggleCompare(vehicle.id)} disabled={!isCompared && maxCompareReached} className={`flex items-center gap-2 border px-4 py-2 transition-colors ${isCompared ? 'border-[#C0A66A] bg-[#C0A66A]/10 text-[#C0A66A]' : 'border-white/10 bg-transparent text-white hover:border-[#C0A66A]/50 hover:text-[#C0A66A]'} ${!isCompared && maxCompareReached ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Scale className="w-4 h-4" />
                <span className="text-sm font-medium">{isCompared ? 'Remove from Compare' : 'Add to Compare'}</span>
                <span className="text-xs text-white/50">({compareIds.length}/3)</span>
              </button>
            </motion.div>

            {/* Share Buttons */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.5 }} className="mt-6">
              <p className="text-white/50 text-sm mb-3">Share this vehicle</p>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleShareFacebook} className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-[#111] text-white hover:border-[#C0A66A]/50 hover:text-[#C0A66A] transition-colors text-sm">Facebook</button>
                <button onClick={handleShareX} className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-[#111] text-white hover:border-[#C0A66A]/50 hover:text-[#C0A66A] transition-colors text-sm">X</button>
                <button onClick={handleCopyLink} className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-[#111] text-white hover:border-[#C0A66A]/50 hover:text-[#C0A66A] transition-colors text-sm">
                  <Link2 className="w-4 h-4" />{copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Similar Vehicles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light text-white">Similar <span className="text-[#C0A66A]">Vehicles</span></h2>
            <Link to="/inventory" className="text-sm text-white/50 hover:text-[#C0A66A] transition-colors">View All &rarr;</Link>
          </div>
          {similarVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((v, index) => <VehicleCard key={v.id} vehicle={v} index={index} compareIds={compareIds} onToggleCompare={toggleCompare} maxCompareReached={maxCompareReached} />)}
            </div>
          ) : (
            <p className="text-white/50">No similar vehicles available at the moment.</p>
          )}
        </motion.div>
      </div>
    </div>
    </>
  );
}
