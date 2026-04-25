import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Search } from 'lucide-react';

const featureOptions = [
  'Leather Seats', 'Sunroof / Moonroof', 'Navigation System', 'Heated Seats',
  'Backup Camera', 'Bluetooth', 'Apple CarPlay', 'Android Auto', 'Premium Audio', 'Third Row Seating',
];

export default function CarFinder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', make: '', model: '', minYear: '', maxYear: '',
    minPrice: '', maxPrice: '', bodyStyle: '', transmission: '', fuelType: '',
    driveType: '', color: '', maxMileage: '', features: [], notes: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.name.trim() || formData.name.length < 2) e.name = 'Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const toggleFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature) ? prev.features.filter((f) => f !== feature) : [...prev.features, feature],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/car-finder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) { setSubmitted(true); } else { alert('Failed to submit. Please try again.'); }
    } catch { alert('Something went wrong.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="overflow-x-hidden bg-black min-h-screen pb-20">
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4">Find Your Dream Car</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-4">Car <span className="text-gradient-gold font-medium">Finder</span></h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">Tell us exactly what you're looking for and we'll hunt it down for you.</p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111] border border-white/5 p-6 md:p-10">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-20 h-20 bg-[#C0A66A]/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-[#C0A66A]" />
                </div>
                <h2 className="text-2xl font-light text-white mb-3">Thank You!</h2>
                <p className="text-white/60 max-w-md mx-auto">We have received your request. One of our specialists will contact you shortly with matching vehicles.</p>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-medium text-white flex items-center gap-2"><Search className="w-5 h-5 text-[#C0A66A]" /> Your Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <label className="text-white/80 text-sm block">Name *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                      {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/80 text-sm block">Email *</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                      {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/80 text-sm block">Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Make</label>
                    <input type="text" placeholder="e.g. BMW" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Model</label>
                    <input type="text" placeholder="e.g. X5" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Body Style</label>
                    <select value={formData.bodyStyle} onChange={(e) => setFormData({ ...formData, bodyStyle: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none appearance-none">
                      <option value="">Select</option>
                      {['Sedan', 'SUV', 'Coupe', 'Convertible', 'Wagon', 'Hatchback', 'Truck', 'Van', 'Other'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Min Year</label>
                    <input type="text" placeholder="e.g. 2020" value={formData.minYear} onChange={(e) => setFormData({ ...formData, minYear: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Max Year</label>
                    <input type="text" placeholder="e.g. 2024" value={formData.maxYear} onChange={(e) => setFormData({ ...formData, maxYear: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Color</label>
                    <input type="text" placeholder="e.g. Black" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Min Price</label>
                    <input type="text" placeholder="e.g. 30000" value={formData.minPrice} onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Max Price</label>
                    <input type="text" placeholder="e.g. 80000" value={formData.maxPrice} onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Max Mileage</label>
                    <input type="text" placeholder="e.g. 50000" value={formData.maxMileage} onChange={(e) => setFormData({ ...formData, maxMileage: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Transmission</label>
                    <select value={formData.transmission} onChange={(e) => setFormData({ ...formData, transmission: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none appearance-none">
                      <option value="">Select</option>
                      {['Automatic', 'Manual', 'CVT', 'Other'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Fuel Type</label>
                    <select value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none appearance-none">
                      <option value="">Select</option>
                      {['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid', 'Other'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm block">Drive Type</label>
                    <select value={formData.driveType} onChange={(e) => setFormData({ ...formData, driveType: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none appearance-none">
                      <option value="">Select</option>
                      {['FWD', 'RWD', 'AWD', '4WD', 'Other'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-white/80 text-sm block">Preferred Features</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {featureOptions.map((feature) => (
                      <label key={feature} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.features.includes(feature)} onChange={() => toggleFeature(feature)} className="w-4 h-4 accent-[#C0A66A]" />
                        <span className="text-sm text-white/80">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm block">Additional Notes</label>
                  <textarea rows={4} placeholder="Any other details we should know?" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none resize-none" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full h-12 bg-[#C0A66A] text-black hover:bg-[#D4BC86] font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Find My Car'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
