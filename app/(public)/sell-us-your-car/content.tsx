"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Car, Wrench, User, DollarSign, Upload, X, Film, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  year: z.string().min(1, "Year is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  trim: z.string().optional(),
  vin: z.string().optional(),
  mileage: z.string().min(1, "Mileage is required"),
  color: z.string().min(1, "Color is required"),
  transmission: z.string().min(1, "Transmission is required"),
  condition: z.string().min(10, "Please describe the overall condition"),
  mechanical: z.string().min(1, "Required"),
  exterior: z.string().min(1, "Required"),
  interior: z.string().min(1, "Required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone number is required"),
  hasLoan: z.enum(["yes", "no"]),
  payoffAmount: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const steps = [
  { id: 1, title: "Vehicle Info", icon: Car },
  { id: 2, title: "Condition", icon: Wrench },
  { id: 3, title: "Contact", icon: User },
  { id: 4, title: "Loan Details", icon: DollarSign },
];

export default function SellUsYourCarPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      hasLoan: "no",
    },
  });

  const hasLoan = watch("hasLoan");

  const stepFields: Record<number, (keyof FormData)[]> = {
    1: ["year", "make", "model", "mileage", "color", "transmission"],
    2: ["condition", "mechanical", "exterior", "interior"],
    3: ["firstName", "lastName", "email", "phone"],
    4: [],
  };

  const nextStep = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.url || null;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setUploadingFiles(true);
    try {
      const photoUrls: string[] = [];
      const videoUrls: string[] = [];

      for (const file of imageFiles) {
        const url = await uploadFile(file);
        if (url) photoUrls.push(url);
      }
      for (const file of videoFiles) {
        const url = await uploadFile(file);
        if (url) videoUrls.push(url);
      }

      const res = await fetch("/api/trade-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, photos: JSON.stringify(photoUrls), videos: JSON.stringify(videoUrls) }),
      });
      if (res.ok) {
        toast.success("Submission received! We'll contact you shortly.");
        setSubmitted(true);
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
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
          <p className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4">
            Get an Offer
          </p>
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
                          step >= s.id
                            ? "bg-[#C0A66A] text-black"
                            : "bg-white/5 text-white/40 border border-white/10"
                        }`}
                      >
                        <s.icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] mt-2 uppercase tracking-wide hidden sm:block ${step >= s.id ? "text-white/70" : "text-white/30"}`}>
                        {s.title}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`flex-1 h-px mx-2 sm:mx-4 ${step > s.id ? "bg-[#C0A66A]" : "bg-white/10"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 md:p-10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-[#C0A66A]/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#C0A66A]" />
                  </div>
                  <h2 className="text-2xl font-light text-white mb-3">Thank You!</h2>
                  <p className="text-white/60 max-w-md mx-auto">
                    We have received your vehicle details. One of our appraisers will review your submission and contact you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Step 1: Vehicle Information */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-xl font-medium text-white mb-2">Vehicle Information</h2>
                        <p className="text-white/50 text-sm">Tell us about your vehicle</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="year">Year *</Label>
                          <Input id="year" {...register("year")} placeholder="e.g. 2022" className="bg-black border-white/10 text-white" />
                          {errors.year && <p className="text-red-400 text-sm">{errors.year.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="make">Make *</Label>
                          <Input id="make" {...register("make")} placeholder="e.g. BMW" className="bg-black border-white/10 text-white" />
                          {errors.make && <p className="text-red-400 text-sm">{errors.make.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">Model *</Label>
                          <Input id="model" {...register("model")} placeholder="e.g. X5" className="bg-black border-white/10 text-white" />
                          {errors.model && <p className="text-red-400 text-sm">{errors.model.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="trim">Trim</Label>
                          <Input id="trim" {...register("trim")} placeholder="e.g. M Sport" className="bg-black border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vin">VIN</Label>
                          <Input id="vin" {...register("vin")} placeholder="Vehicle Identification Number" className="bg-black border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mileage">Mileage *</Label>
                          <Input id="mileage" {...register("mileage")} placeholder="e.g. 45,000 km" className="bg-black border-white/10 text-white" />
                          {errors.mileage && <p className="text-red-400 text-sm">{errors.mileage.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="color">Color *</Label>
                          <Input id="color" {...register("color")} placeholder="e.g. Alpine White" className="bg-black border-white/10 text-white" />
                          {errors.color && <p className="text-red-400 text-sm">{errors.color.message}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="transmission">Transmission *</Label>
                          <Select onValueChange={(v: string | null) => typeof v === "string" && setValue("transmission", v)}>
                            <SelectTrigger id="transmission" className="bg-black border-white/10 text-white">
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111] border-white/10">
                              <SelectItem value="Automatic" className="text-white">Automatic</SelectItem>
                              <SelectItem value="Manual" className="text-white">Manual</SelectItem>
                              <SelectItem value="CVT" className="text-white">CVT</SelectItem>
                              <SelectItem value="Other" className="text-white">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.transmission && <p className="text-red-400 text-sm">{errors.transmission.message}</p>}
                        </div>
                      </div>

                      {/* Photos & Videos */}
                      <div className="pt-6 border-t border-white/5 space-y-6">
                        <div>
                          <h3 className="text-white font-medium mb-1">Vehicle Photos & Videos</h3>
                          <p className="text-white/50 text-sm">Upload images and videos to help us evaluate your vehicle.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Images */}
                          <div className="space-y-3">
                            <Label className="flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-[#C0A66A]" />
                              Photos
                            </Label>
                            <div className="flex flex-wrap gap-3">
                              {imageFiles.map((file, idx) => (
                                <div key={idx} className="relative w-20 h-20 border border-white/10 bg-black">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                  />
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
                                    e.currentTarget.value = "";
                                  }}
                                />
                                <Upload className="w-4 h-4 mb-1" />
                                <span className="text-[10px]">Add</span>
                              </label>
                            </div>
                          </div>

                          {/* Videos */}
                          <div className="space-y-3">
                            <Label className="flex items-center gap-2">
                              <Film className="w-4 h-4 text-[#C0A66A]" />
                              Videos
                            </Label>
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
                                    e.currentTarget.value = "";
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
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-xl font-medium text-white mb-2">Condition Assessment</h2>
                        <p className="text-white/50 text-sm">Help us understand your vehicle&apos;s condition</p>
                      </div>
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="condition">Overall Condition *</Label>
                          <textarea
                            id="condition"
                            {...register("condition")}
                            rows={3}
                            placeholder="Describe the overall condition of your vehicle..."
                            className="w-full bg-black border border-white/10 p-3 text-white placeholder:text-white/40 focus-visible:border-[#C0A66A]/50 focus-visible:ring-1 focus-visible:ring-[#C0A66A]/20 outline-none"
                          />
                          {errors.condition && <p className="text-red-400 text-sm">{errors.condition.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mechanical">Mechanical & Electrical Issues *</Label>
                          <textarea
                            id="mechanical"
                            {...register("mechanical")}
                            rows={3}
                            placeholder="Any mechanical or electrical issues? If none, write 'None'..."
                            className="w-full bg-black border border-white/10 p-3 text-white placeholder:text-white/40 focus-visible:border-[#C0A66A]/50 focus-visible:ring-1 focus-visible:ring-[#C0A66A]/20 outline-none"
                          />
                          {errors.mechanical && <p className="text-red-400 text-sm">{errors.mechanical.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="exterior">Exterior Damage *</Label>
                          <textarea
                            id="exterior"
                            {...register("exterior")}
                            rows={3}
                            placeholder="Any dents, scratches, or paint issues? If none, write 'None'..."
                            className="w-full bg-black border border-white/10 p-3 text-white placeholder:text-white/40 focus-visible:border-[#C0A66A]/50 focus-visible:ring-1 focus-visible:ring-[#C0A66A]/20 outline-none"
                          />
                          {errors.exterior && <p className="text-red-400 text-sm">{errors.exterior.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="interior">Interior Condition *</Label>
                          <textarea
                            id="interior"
                            {...register("interior")}
                            rows={3}
                            placeholder="Describe the interior condition, stains, tears, odors..."
                            className="w-full bg-black border border-white/10 p-3 text-white placeholder:text-white/40 focus-visible:border-[#C0A66A]/50 focus-visible:ring-1 focus-visible:ring-[#C0A66A]/20 outline-none"
                          />
                          {errors.interior && <p className="text-red-400 text-sm">{errors.interior.message}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Contact Information */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-xl font-medium text-white mb-2">Contact Information</h2>
                        <p className="text-white/50 text-sm">How can we reach you?</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input id="firstName" {...register("firstName")} className="bg-black border-white/10 text-white" />
                          {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input id="lastName" {...register("lastName")} className="bg-black border-white/10 text-white" />
                          {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input id="email" type="email" {...register("email")} className="bg-black border-white/10 text-white" />
                          {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input id="phone" {...register("phone")} className="bg-black border-white/10 text-white" />
                          {errors.phone && <p className="text-red-400 text-sm">{errors.phone.message}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Loan / Lease */}
                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
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
                              {...register("hasLoan")}
                              checked={hasLoan === "yes"}
                              onChange={() => setValue("hasLoan", "yes")}
                              className="w-4 h-4 accent-[#C0A66A]"
                              aria-label="Yes, I have a loan"
                            />
                            <span className="text-white">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="no"
                              {...register("hasLoan")}
                              checked={hasLoan === "no"}
                              onChange={() => setValue("hasLoan", "no")}
                              className="w-4 h-4 accent-[#C0A66A]"
                              aria-label="No, I do not have a loan"
                            />
                            <span className="text-white">No</span>
                          </label>
                        </div>
                        {hasLoan === "yes" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-2"
                          >
                            <Label htmlFor="payoffAmount">Payoff Amount</Label>
                            <Input id="payoffAmount" {...register("payoffAmount")} placeholder="e.g. $25,000" className="bg-black border-white/10 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={step === 1 || isSubmitting}
                      className="border-white/10 text-white hover:bg-white/5 hover:text-white"
                    >
                      Back
                    </Button>
                    {step < 4 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-[#C0A66A] text-black hover:bg-[#D4BC86]"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting || uploadingFiles}
                        className="bg-[#C0A66A] text-black hover:bg-[#D4BC86]"
                      >
                        {isSubmitting || uploadingFiles ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {uploadingFiles ? "Uploading files..." : "Submitting..."}
                          </>
                        ) : (
                          "Get My Offer"
                        )}
                      </Button>
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
              { title: "Competitive Appraisal", desc: "Market-based valuations for premium vehicles." },
              { title: "Fast Cash Offer", desc: "Receive a no-obligation offer within 24 hours." },
              { title: "Hassle-Free", desc: "We handle all paperwork and documentation." },
              { title: "Immediate Payment", desc: "Get paid promptly upon agreement." },
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
