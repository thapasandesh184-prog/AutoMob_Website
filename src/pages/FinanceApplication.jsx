import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronLeft, ChevronRight, Check, Car, Briefcase, User, Users, FileText, ShieldCheck } from 'lucide-react';

const steps = [
  { id: 1, title: 'Personal', icon: User },
  { id: 2, title: 'Employment', icon: Briefcase },
  { id: 3, title: 'Vehicle', icon: Car },
  { id: 4, title: 'Trade-In', icon: FileText },
  { id: 5, title: 'References', icon: Users },
  { id: 6, title: 'Review', icon: ShieldCheck },
];

export default function FinanceApplication() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState({
    name: '', dob: '', sin: '', email: '', phone: '',
    street: '', city: '', state: '', zip: '', timeAtAddress: '',
    employer: '', occupation: '', income: '', timeAtJob: '',
    vehicleId: '', tradeIn: false, tradeInDetails: '',
    reference1: '', reference2: '', consent: false,
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const validateStep = (stepIndex) => {
    const e = {};
    if (stepIndex === 0) {
      if (!formData.name.trim() || formData.name.length < 2) e.name = 'Full name is required';
      if (!formData.dob.trim()) e.dob = 'Date of birth is required';
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email';
      if (!formData.phone.trim() || formData.phone.length < 10) e.phone = 'Please enter a valid phone number';
      if (!formData.street.trim() || formData.street.length < 2) e.street = 'Street address is required';
      if (!formData.city.trim()) e.city = 'City is required';
      if (!formData.state.trim()) e.state = 'Province / State is required';
      if (!formData.zip.trim()) e.zip = 'Postal / ZIP code is required';
      if (!formData.timeAtAddress.trim()) e.timeAtAddress = 'Time at address is required';
    }
    if (stepIndex === 1) {
      if (!formData.employer.trim() || formData.employer.length < 2) e.employer = 'Employer name is required';
      if (!formData.occupation.trim() || formData.occupation.length < 2) e.occupation = 'Occupation is required';
      if (!formData.income.trim()) e.income = 'Monthly income is required';
      if (!formData.timeAtJob.trim()) e.timeAtJob = 'Time at job is required';
    }
    if (stepIndex === 2) {
      if (!formData.vehicleId.trim()) e.vehicleId = 'Desired vehicle is required';
    }
    if (stepIndex === 4) {
      if (!formData.reference1.trim() || formData.reference1.length < 5) e.reference1 = 'Reference 1 is required';
      if (!formData.reference2.trim() || formData.reference2.length < 5) e.reference2 = 'Reference 2 is required';
    }
    if (stepIndex === 5) {
      if (!formData.consent) e.consent = 'You must consent to a credit check';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to submit application');
      alert('Finance application submitted successfully!');
      navigate('/finance');
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 40 : -40, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Hero */}
      <section className="relative h-[30vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80')" }}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4">Apply Now</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4">
            Finance <span className="text-gradient-gold font-medium">Application</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            Complete the secure application below. Our team will review and respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <div key={step.id} className="flex flex-col items-center flex-1 relative z-10">
                    <div
                      className={`w-10 h-10 flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive
                          ? 'border-[#C0A66A] bg-[#C0A66A] text-black'
                          : isCompleted
                          ? 'border-[#C0A66A] bg-black text-[#C0A66A]'
                          : 'border-white/20 bg-black text-white/40'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs mt-2 hidden sm:block ${isActive ? 'text-[#C0A66A]' : 'text-white/40'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
              {/* Connecting Lines */}
              <div className="absolute left-0 right-0 top-5 -z-0 hidden sm:flex px-5">
                {steps.slice(0, -1).map((_, index) => {
                  const isCompleted = index < currentStep;
                  return (
                    <div key={index} className="flex-1 mx-2">
                      <div className={`h-0.5 w-full ${isCompleted ? 'bg-[#C0A66A]/40' : 'bg-white/10'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-6 h-1 bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-[#C0A66A]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#111] border border-white/5 p-6 md:p-10 min-h-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-light text-white mb-2">Personal Information</h2>
                      <p className="text-white/50 text-sm">Tell us a bit about yourself</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-white/80 text-sm block">Full Name</label>
                        <input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="dob" className="text-white/80 text-sm block">Date of Birth</label>
                        <input id="dob" type="date" value={formData.dob} onChange={(e) => updateField('dob', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.dob && <p className="text-sm text-red-400">{errors.dob}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="sin" className="text-white/80 text-sm block">SIN (Optional)</label>
                        <input id="sin" placeholder="000 000 000" value={formData.sin} onChange={(e) => updateField('sin', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-white/80 text-sm block">Email</label>
                        <input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-white/80 text-sm block">Phone</label>
                        <input id="phone" type="tel" placeholder="+1 7789907468" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.phone && <p className="text-sm text-red-400">{errors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="timeAtAddress" className="text-white/80 text-sm block">Time at Address</label>
                        <input id="timeAtAddress" placeholder="e.g. 2 years" value={formData.timeAtAddress} onChange={(e) => updateField('timeAtAddress', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.timeAtAddress && <p className="text-sm text-red-400">{errors.timeAtAddress}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="street" className="text-white/80 text-sm block">Street Address</label>
                        <input id="street" placeholder="Parking lot, 21320 Westminster Hwy #2128" value={formData.street} onChange={(e) => updateField('street', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.street && <p className="text-sm text-red-400">{errors.street}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="city" className="text-white/80 text-sm block">City</label>
                        <input id="city" placeholder="Richmond" value={formData.city} onChange={(e) => updateField('city', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.city && <p className="text-sm text-red-400">{errors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="state" className="text-white/80 text-sm block">Province / State</label>
                        <input id="state" placeholder="BC" value={formData.state} onChange={(e) => updateField('state', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.state && <p className="text-sm text-red-400">{errors.state}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="zip" className="text-white/80 text-sm block">Postal / ZIP Code</label>
                        <input id="zip" placeholder="V5W 3A3" value={formData.zip} onChange={(e) => updateField('zip', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.zip && <p className="text-sm text-red-400">{errors.zip}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-light text-white mb-2">Employment Information</h2>
                      <p className="text-white/50 text-sm">Help us understand your financial situation</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="employer" className="text-white/80 text-sm block">Employer Name</label>
                        <input id="employer" placeholder="Company Inc." value={formData.employer} onChange={(e) => updateField('employer', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.employer && <p className="text-sm text-red-400">{errors.employer}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="occupation" className="text-white/80 text-sm block">Occupation</label>
                        <input id="occupation" placeholder="Software Engineer" value={formData.occupation} onChange={(e) => updateField('occupation', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.occupation && <p className="text-sm text-red-400">{errors.occupation}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="income" className="text-white/80 text-sm block">Monthly Income</label>
                        <input id="income" placeholder="$8,000" value={formData.income} onChange={(e) => updateField('income', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.income && <p className="text-sm text-red-400">{errors.income}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="timeAtJob" className="text-white/80 text-sm block">Time at Job</label>
                        <input id="timeAtJob" placeholder="e.g. 3 years" value={formData.timeAtJob} onChange={(e) => updateField('timeAtJob', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        {errors.timeAtJob && <p className="text-sm text-red-400">{errors.timeAtJob}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-light text-white mb-2">Vehicle Selection</h2>
                      <p className="text-white/50 text-sm">Which vehicle are you interested in?</p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="vehicleId" className="text-white/80 text-sm block">Desired Vehicle</label>
                      <input id="vehicleId" placeholder="2024 Mercedes-Benz S 580" value={formData.vehicleId} onChange={(e) => updateField('vehicleId', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                      {errors.vehicleId && <p className="text-sm text-red-400">{errors.vehicleId}</p>}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-light text-white mb-2">Trade-In</h2>
                      <p className="text-white/50 text-sm">Do you have a vehicle to trade in?</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            value="false"
                            checked={!formData.tradeIn}
                            onChange={() => updateField('tradeIn', false)}
                            className="w-5 h-5 accent-[#C0A66A]"
                          />
                          <span className="text-white/80">No</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            value="true"
                            checked={formData.tradeIn}
                            onChange={() => updateField('tradeIn', true)}
                            className="w-5 h-5 accent-[#C0A66A]"
                          />
                          <span className="text-white/80">Yes</span>
                        </label>
                      </div>
                      {formData.tradeIn && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                          <label htmlFor="tradeInDetails" className="text-white/80 text-sm block">Trade-In Details</label>
                          <textarea
                            id="tradeInDetails"
                            placeholder="Year, make, model, mileage, condition..."
                            rows={4}
                            value={formData.tradeInDetails}
                            onChange={(e) => updateField('tradeInDetails', e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none resize-none"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-light text-white mb-2">References</h2>
                      <p className="text-white/50 text-sm">Two personal or professional references</p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reference1" className="text-white/80 text-sm block">Reference 1 (Name + Phone)</label>
                      <input id="reference1" placeholder="Jane Doe — (604) 123-4567" value={formData.reference1} onChange={(e) => updateField('reference1', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                      {errors.reference1 && <p className="text-sm text-red-400">{errors.reference1}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reference2" className="text-white/80 text-sm block">Reference 2 (Name + Phone)</label>
                      <input id="reference2" placeholder="John Smith — (604) 987-6543" value={formData.reference2} onChange={(e) => updateField('reference2', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                      {errors.reference2 && <p className="text-sm text-red-400">{errors.reference2}</p>}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-light text-white mb-2">Review & Consent</h2>
                      <p className="text-white/50 text-sm">Please review your information before submitting</p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 p-5 space-y-4 text-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><span className="text-white/40">Name:</span> <span className="text-white">{formData.name || '—'}</span></div>
                        <div><span className="text-white/40">Email:</span> <span className="text-white">{formData.email || '—'}</span></div>
                        <div><span className="text-white/40">Phone:</span> <span className="text-white">{formData.phone || '—'}</span></div>
                        <div><span className="text-white/40">DOB:</span> <span className="text-white">{formData.dob || '—'}</span></div>
                        <div className="md:col-span-2"><span className="text-white/40">Street:</span> <span className="text-white">{formData.street || '—'}</span></div>
                        <div><span className="text-white/40">City:</span> <span className="text-white">{formData.city || '—'}</span></div>
                        <div><span className="text-white/40">Province / State:</span> <span className="text-white">{formData.state || '—'}</span></div>
                        <div><span className="text-white/40">Postal / ZIP:</span> <span className="text-white">{formData.zip || '—'}</span></div>
                        <div><span className="text-white/40">Employer:</span> <span className="text-white">{formData.employer || '—'}</span></div>
                        <div><span className="text-white/40">Occupation:</span> <span className="text-white">{formData.occupation || '—'}</span></div>
                        <div><span className="text-white/40">Income:</span> <span className="text-white">{formData.income || '—'}</span></div>
                        <div><span className="text-white/40">Vehicle:</span> <span className="text-white">{formData.vehicleId || '—'}</span></div>
                        <div><span className="text-white/40">Trade-In:</span> <span className="text-white">{formData.tradeIn ? 'Yes' : 'No'}</span></div>
                        {formData.tradeIn && (
                          <div className="md:col-span-2"><span className="text-white/40">Trade-In Details:</span> <span className="text-white">{formData.tradeInDetails || '—'}</span></div>
                        )}
                        <div className="md:col-span-2"><span className="text-white/40">Reference 1:</span> <span className="text-white">{formData.reference1 || '—'}</span></div>
                        <div className="md:col-span-2"><span className="text-white/40">Reference 2:</span> <span className="text-white">{formData.reference2 || '—'}</span></div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={formData.consent}
                        onChange={(e) => updateField('consent', e.target.checked)}
                        className="w-4 h-4 mt-0.5 accent-[#C0A66A]"
                      />
                      <label htmlFor="consent" className="text-white/80 text-sm font-normal cursor-pointer">
                        I consent to a credit check and understand that my information will be used to process my finance application.
                      </label>
                    </div>
                    {errors.consent && <p className="text-sm text-red-400">{errors.consent}</p>}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-white hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C0A66A] text-black hover:bg-[#D4BC86] font-medium transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C0A66A] text-black hover:bg-[#D4BC86] font-medium transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
