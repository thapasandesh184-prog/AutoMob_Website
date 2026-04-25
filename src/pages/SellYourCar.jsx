import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Car, Wrench, User, DollarSign, Upload, X, Film, Image as ImageIcon } from 'lucide-react';

const steps = [
  { id: 1, title: 'Vehicle Info', icon: Car },
  { id: 2, title: 'Condition', icon: Wrench },
  { id: 3, title: 'Contact', icon: User },
  { id: 4, title: 'Loan Details', icon: DollarSign },
];

export default function SellYourCar() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [formData, setFormData] = useState({
    year: '', make: '', model: '', trim: '', vin: '',
    mileage: '', color: '', transmission: '', condition: '',
    mechanical: '', exterior: '', interior: '',
    firstName: '', lastName: '', email: '', phone: '',
    hasLoan: 'no', payoffAmount: '',
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!formData.year.trim()) e.year = 'Year is required';
      if (!formData.make.trim()) e.make = 'Make is required';
      if (!formData.model.trim()) e.model = 'Model is required';
      if (!formData.mileage.trim()) e.mileage = 'Mileage is required';
      if (!formData.color.trim()) e.color = 'Color is required';
      if (!formData.transmission.trim()) e.transmission = 'Transmission is required';
    }
    if (s === 2) {
      if (!formData.condition.trim() || formData.condition.length < 10) e.condition = 'Please describe the overall condition';
      if (!formData.mechanical.trim()) e.mechanical = 'Required';
      if (!formData.exterior.trim()) e.exterior = 'Required';
      if (!formData.interior.trim()) e.interior = 'Required';
    }
    if (s === 3) {
      if (!formData.firstName.trim()) e.firstName = 'First name is required';
      if (!formData.lastName.trim()) e.lastName = 'Last name is required';
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required';
      if (!formData.phone.trim() || formData.phone.length < 10) e.phone = 'Phone number is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const uploadFile = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) return null;
    const json = await res.json();
    return json.url || null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    setIsSubmitting(true);
    setUploadingFiles(true);
    try {
      const photoUrls = [];
      const videoUrls = [];
      for (const file of imageFiles) {
        const url = await uploadFile(file);
        if (url) photoUrls.push(url);
      }
      for (const file of videoFiles) {
        const url = await uploadFile(file);
        if (url) videoUrls.push(url);
      }
      const res = await fetch('/api/trade-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, photos: JSON.stringify(photoUrls), videos: JSON.stringify(videoUrls) }),
      });
      if (res.ok) {
        alert('Submission received! We\'ll contact you shortly.');
        setSubmitted(true);
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch {
      alert('Something went wrong.');
    } finally {
      setIsSubmitting(false);
      setUploadingFiles(false);
    }
  };

  return (
    <div className="overflow-x-hidden bg-black min-h-screen pb-20">
      {/* Hero */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562141989-c5c79ac8f576?w=1200&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4">Get an Offer</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-4">
            Sell Us Your <span className="text-gradient-gold font-medium">Car</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            Receive a competitive offer for your luxury vehicle. Fast, fair, and hassle-free.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#111] border border-white/5 overflow-hidden">
            {/* Stepper Header */}
            <div className="bg-black/40 border-b border-white/5 px-6 py-5">
              <div className="flex items-center justify-between">
                {steps.map((s, idx) => (
                  <div key={s.id} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 flex items-center justify-center transition-colors ${
                          step >= s.id ? 'bg-[#C0A66A] text-black' : 'bg-white/5 text-white/40 border border-white/10'
                        }`}
                      >
                        <s.icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] mt-2 uppercase tracking-wide hidden sm:block ${step >= s.id ? 'text-white/70' : 'text-white/30'}`}>
                        {s.title}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`flex-1 h-px mx-2 sm:mx-4 ${step > s.id ? 'bg-[#C0A66A]' : 'bg-white/10'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 md:p-10">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-20 h-20 bg-[#C0A66A]/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#C0A66A]" />
                  </div>
                  <h2 className="text-2xl font-light text-white mb-3">Thank You!</h2>
                  <p className="text-white/60 max-w-md mx-auto">
                    We have received your vehicle details. One of our appraisers will review your submission and contact you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-8">
                  {/* Step 1: Vehicle Information */}
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="text-center mb-8">
                        <h2 className="text-xl font-medium text-white mb-2">Vehicle Information</h2>
                        <p className="text-white/50 text-sm">Tell us about your vehicle</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-2">
                          <label htmlFor="year" className="text-white/80 text-sm block">Year *</label>
                          <input id="year" placeholder="e.g. 2022" value={formData.year} onChange={(e) => updateField('year', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                          {errors.year && <p className="text-red-400 text-sm">{errors.year}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="make" className="text-white/80 text-sm block">Make *</label>
                          <input id="make" placeholder="e.g. BMW" value={formData.make} onChange={(e) => updateField('make', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                          {errors.make && <p className="text-red-400 text-sm">{errors.make}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="model" className="text-white/80 text-sm block">Model *</label>
                          <input id="model" placeholder="e.g. X5" value={formData.model} onChange={(e) => updateField('model', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                          {errors.model && <p className="text-red-400 text-sm">{errors.model}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="trim" className="text-white/80 text-sm block">Trim</label>
                          <input id="trim" placeholder="e.g. M Sport" value={formData.trim} onChange={(e) => updateField('trim', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="vin" className="text-white/80 text-sm block">VIN</label>
                          <input id="vin" placeholder="Vehicle Identification Number" value={formData.vin} onChange={(e) => updateField('vin', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="mileage" className="text-white/80 text-sm block">Mileage *</label>
                          <input id="mileage" placeholder="e.g. 45,000 km" value={formData.mileage} onChange={(e) => updateField('mileage', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                          {errors.mileage && <p className="text-red-400 text-sm">{errors.mileage}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="color" className="text-white/80 text-sm block">Color *</label>
                          <input id="color" placeholder="e.g. Alpine White" value={formData.color} onChange={(e) => updateField('color', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                          {errors.color && <p className="text-red-400 text-sm">{errors.color}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label htmlFor="transmission" className="text-white/80 text-sm block">Transmission *</label>
                          <select
                            id="transmission"
                            value={formData.transmission}
                            onChange={(e) => updateField('transmission', e.target.value)}
                            className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none appearance-none"
                          >
                            <option value="">Select transmission</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="CVT">CVT</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.transmission && <p className="text-red-400 text-sm">{errors.transmission}</p>}
                        </div>
                      </div>

                      {/* Photos & Videos */}
                      <div className="pt-6 border-t border-white/5 space-y-6">
                        <div>
                          <h3 className="text-white font-medium mb-1">Vehicle Photos & Videos</h3>
                          <p className="text-white/50 text-sm">Upload images and videos to help us evaluate your vehicle.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="flex items-center gap-2 text-white/80 text-sm">
                              <ImageIcon className="w-4 h-4 text-[#C0A66A]" />
                              Photos
                            </label>
                            <div className="flex flex-wrap gap-3">
                              {imageFiles.map((file, idx) => (
                                <div key={idx} className="relative w-20 h-20 border border-white/10 bg-black">
                                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white flex items-center justify-center"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <label className="relative cursor-pointer w-20 h-20 border border-dashed border-white/20 bg-black flex flex-col items-center justify-center text-white/50 hover:text-white hover:border-[#C0A66A]/50 transition-colors">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    setImageFiles((prev) => [...prev, ...files]);
                                    e.currentTarget.value = '';
                                  }}
                                />
                                <Upload className="w-4 h-4 mb-1" />
                                <span className="text-[10px]">Add</span>
                              </label>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="flex items-center gap-2 text-white/80 text-sm">
                              <Film className="w-4 h-4 text-[#C0A66A]" />
                              Videos
                            </label>
                            <div className="flex flex-wrap gap-3">
                              {videoFiles.map((file, idx) => (
                                <div key={idx} className="relative w-28 h-20 border border-white/10 bg-black flex items-center justify-center">
                                  <span className="text-[10px] text-white/70 px-2 text-center truncate max-w-full">{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => setVideoFiles(videoFiles.filter((_, i) => i !== idx))}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white flex items-center justify-center"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <label className="relative cursor-pointer w-20 h-20 border border-dashed border-white/20 bg-black flex flex-col items-center justify-center text-white/50 hover:text-white hover:border-[#C0A66A]/50 transition-colors">
                                <input
                                  type="file"
                                  accept="video/*"
                                  multiple
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    setVideoFiles((prev) => [...prev, ...files]);
                                    e.currentTarget.value = '';
                                  }}
                                />
                                <Upload className="w-4 h-4 mb-1" />
                                <span className="text-[10px]">Add</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Condition Assessment */}
                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="text-center mb-8">
                        <h2 className="text-xl font-medium text-white mb-2">Condition Assessment</h2>
                        <p className="text-white/50 text-sm">Help us understand your vehicle&apos;s condition</p>
                      </div>
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label htmlFor="condition" className="text-white/80 text-sm block">Overall Condition *</label>
                          <textarea
                            id="condition"
                            rows={3}
                            placeholder="Describe the overall condition of your vehicle..."
                            value={formData.condition}
                            onChange={(e) => updateField('condition', e.target.value)}
                            className="w-full bg-black border border-white/10 p-3 text-white placeholder:text-white/40 focus:border-[#C0A66A]/50 focus:outline-none resize-none"
                          />
                          {errors.condition && <p className="text-red-400 text-sm">{errors.condition}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="mechanical" className="text-white/80 text-sm block">Mechanical & Electrical Issues *</label>
                          <textarea
                            id="mechanical"
                            rows={3}
                            placeholder="Any mechanical or electrical issues? If none, write 'None'..."
                            value={formData.mechanical}
                            onChange={(e) => updateField('mechanical', e.target.value)}
                            className="w-full bg-black border border-white/10 p-3 text-white placeholder:text-white/40 focus:border-[#C0A66A]/50 focus:outline-none resize-none"
                          />
                          {errors.mechanical && <p className="text-red-400 text-sm">{errors.mechanical}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="exterior" className="text-white/80 text-sm block">Exterior Damage *</label>
                          <textarea
                            id="exterior"
                            rows={3}
                            placeholder="Any dents, scratches, or paint issues? If none, write 'None'..."
                            value={formData.exterior}
                            onChange={(e) => updateField('exterior', e.target.value)}
                            className="w-full bg-black border border-white/10 p-3 text-white placeholder:text-white/40 focus:border-[#C0A66A]/50 focus:outline-none resize-none"
                          />
                          {errors.exterior && <p className="text-red-400 text-sm">{errors.exterior}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="interior" className="text-white/80 text-sm block">Interior Condition *</label>
                          <textarea
                            id="interior"
                            rows={3}
                            placeholder="Describe the interior condition, stains, tears, odors..."
                            value={formData.interior}
                            onChange={(e) => updateField('interior', e.target.value)}
                            className="w-full bg-black border border-white/10 p-3 text-white placeholder:text-white/40 focus:border-[#C0A66A]/50 focus:outline-none resize-none"
                          />
                          {errors.interior && <p className="text-red-400 text-sm">{errors.interior}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Contact Information */}
                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="text-center mb-8">
                        <h2 className="text-xl font-medium text-white mb-2">Contact Information</h2>
                        <p className="text-white/50 text-sm">How can we reach you?</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-white/80 text-sm block">First Name *</label>
                          <input id="firstName" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                          {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="text-white/80 text-sm block">Last Name *</label>
                          <input id="lastName" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                          {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-white/80 text-sm block">Email *</label>
                          <input id="email" type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-white/80 text-sm block">Phone *</label>
                          <input id="phone" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                          {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Loan / Lease */}
                  {step === 4 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="text-center mb-8">
                        <h2 className="text-xl font-medium text-white mb-2">Loan or Lease</h2>
                        <p className="text-white/50 text-sm">Do you have an outstanding loan?</p>
                      </div>
                      <div className="space-y-5">
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="yes"
                              checked={formData.hasLoan === 'yes'}
                              onChange={() => updateField('hasLoan', 'yes')}
                              className="w-4 h-4 accent-[#C0A66A]"
                              aria-label="Yes, I have a loan"
                            />
                            <span className="text-white">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="no"
                              checked={formData.hasLoan === 'no'}
                              onChange={() => updateField('hasLoan', 'no')}
                              className="w-4 h-4 accent-[#C0A66A]"
                              aria-label="No, I do not have a loan"
                            />
                            <span className="text-white">No</span>
                          </label>
                        </div>
                        {formData.hasLoan === 'yes' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                            <label htmlFor="payoffAmount" className="text-white/80 text-sm block">Payoff Amount</label>
                            <input id="payoffAmount" placeholder="e.g. $25,000" value={formData.payoffAmount} onChange={(e) => updateField('payoffAmount', e.target.value)} className="w-full bg-black border border-white/10 text-white px-3 py-2 focus:border-[#C0A66A]/50 focus:outline-none" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={step === 1 || isSubmitting}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-white hover:bg-white/5 hover:text-white transition-colors disabled:opacity-30"
                    >
                      Back
                    </button>
                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#C0A66A] text-black hover:bg-[#D4BC86] font-medium transition-colors"
                      >
                        Next Step
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || uploadingFiles}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#C0A66A] text-black hover:bg-[#D4BC86] font-medium transition-colors disabled:opacity-60"
                      >
                        {isSubmitting || uploadingFiles ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {uploadingFiles ? 'Uploading files...' : 'Submitting...'}
                          </>
                        ) : (
                          'Get My Offer'
                        )}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Sell Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-white">Why Sell to <span className="text-gradient-gold">SKay Auto group</span>?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Competitive Appraisal', desc: 'Market-based valuations for premium vehicles.' },
              { title: 'Fast Cash Offer', desc: 'Receive a no-obligation offer within 24 hours.' },
              { title: 'Hassle-Free', desc: 'We handle all paperwork and documentation.' },
              { title: 'Immediate Payment', desc: 'Get paid promptly upon agreement.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111] border border-white/5 p-6 text-center"
              >
                <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
