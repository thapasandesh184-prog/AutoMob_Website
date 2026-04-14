"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight, Check, Car, Briefcase, User, Users, FileText, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const fullSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  sin: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  street: z.string().min(2, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "Province / State is required"),
  zip: z.string().min(1, "Postal / ZIP code is required"),
  timeAtAddress: z.string().min(1, "Time at address is required"),
  employer: z.string().min(2, "Employer name is required"),
  occupation: z.string().min(2, "Occupation is required"),
  income: z.string().min(1, "Monthly income is required"),
  timeAtJob: z.string().min(1, "Time at job is required"),
  vehicleId: z.string().min(1, "Desired vehicle is required"),
  tradeIn: z.boolean(),
  tradeInDetails: z.string().optional(),
  reference1: z.string().min(5, "Reference 1 is required"),
  reference2: z.string().min(5, "Reference 2 is required"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to a credit check",
  }),
});

type FormData = z.infer<typeof fullSchema>;

const stepFields: Array<Array<keyof FormData>> = [
  ["name", "dob", "sin", "email", "phone", "street", "city", "state", "zip", "timeAtAddress"],
  ["employer", "occupation", "income", "timeAtJob"],
  ["vehicleId"],
  ["tradeIn", "tradeInDetails"],
  ["reference1", "reference2"],
  ["consent"],
];

const steps = [
  { id: 1, title: "Personal", icon: User },
  { id: 2, title: "Employment", icon: Briefcase },
  { id: 3, title: "Vehicle", icon: Car },
  { id: 4, title: "Trade-In", icon: FileText },
  { id: 5, title: "References", icon: Users },
  { id: 6, title: "Review", icon: ShieldCheck },
];

export default function FinanceApplicationContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      name: "",
      dob: "",
      sin: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      timeAtAddress: "",
      employer: "",
      occupation: "",
      income: "",
      timeAtJob: "",
      vehicleId: "",
      tradeIn: false,
      tradeInDetails: "",
      reference1: "",
      reference2: "",
      consent: false,
    },
    mode: "onChange",
  });

  const tradeIn = watch("tradeIn");

  const nextStep = async () => {
    const fields = stepFields[currentStep] as Array<keyof FormData>;
    const valid = await trigger(fields);
    if (valid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit application");

      toast.success("Finance application submitted successfully!");
      router.push("/finance");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Hero */}
      <section className="relative h-[30vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4">
            Apply Now
          </p>
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
                          ? "border-[#C0A66A] bg-[#C0A66A] text-black"
                          : isCompleted
                          ? "border-[#C0A66A] bg-black text-[#C0A66A]"
                          : "border-white/20 bg-black text-white/40"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 hidden sm:block ${
                        isActive ? "text-[#C0A66A]" : "text-white/40"
                      }`}
                    >
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
                      <div
                        className={`h-0.5 w-full ${
                          isCompleted ? "bg-[#C0A66A]/40" : "bg-white/10"
                        }`}
                      />
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
                        <Label htmlFor="name" className="text-white/80">Full Name</Label>
                        <Input id="name" placeholder="John Doe" className="bg-[#0a0a0a] border-white/10 text-white" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="text-white/80">Date of Birth</Label>
                        <Input id="dob" type="date" className="bg-[#0a0a0a] border-white/10 text-white" {...register("dob")} />
                        {errors.dob && <p className="text-sm text-red-400">{errors.dob.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sin" className="text-white/80">SIN (Optional)</Label>
                        <Input id="sin" placeholder="000 000 000" className="bg-[#0a0a0a] border-white/10 text-white" {...register("sin")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/80">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" className="bg-[#0a0a0a] border-white/10 text-white" {...register("email")} />
                        {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white/80">Phone</Label>
                        <Input id="phone" type="tel" placeholder="(778) 123-4567" className="bg-[#0a0a0a] border-white/10 text-white" {...register("phone")} />
                        {errors.phone && <p className="text-sm text-red-400">{errors.phone.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeAtAddress" className="text-white/80">Time at Address</Label>
                        <Input id="timeAtAddress" placeholder="e.g. 2 years" className="bg-[#0a0a0a] border-white/10 text-white" {...register("timeAtAddress")} />
                        {errors.timeAtAddress && <p className="text-sm text-red-400">{errors.timeAtAddress.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="street" className="text-white/80">Street Address</Label>
                        <Input id="street" placeholder="123 Luxury Lane" className="bg-[#0a0a0a] border-white/10 text-white" {...register("street")} />
                        {errors.street && <p className="text-sm text-red-400">{errors.street.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-white/80">City</Label>
                        <Input id="city" placeholder="Vancouver" className="bg-[#0a0a0a] border-white/10 text-white" {...register("city")} />
                        {errors.city && <p className="text-sm text-red-400">{errors.city.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-white/80">Province / State</Label>
                        <Input id="state" placeholder="BC" className="bg-[#0a0a0a] border-white/10 text-white" {...register("state")} />
                        {errors.state && <p className="text-sm text-red-400">{errors.state.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip" className="text-white/80">Postal / ZIP Code</Label>
                        <Input id="zip" placeholder="V6B 1A1" className="bg-[#0a0a0a] border-white/10 text-white" {...register("zip")} />
                        {errors.zip && <p className="text-sm text-red-400">{errors.zip.message}</p>}
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
                        <Label htmlFor="employer" className="text-white/80">Employer Name</Label>
                        <Input id="employer" placeholder="Company Inc." className="bg-[#0a0a0a] border-white/10 text-white" {...register("employer")} />
                        {errors.employer && <p className="text-sm text-red-400">{errors.employer.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="occupation" className="text-white/80">Occupation</Label>
                        <Input id="occupation" placeholder="Software Engineer" className="bg-[#0a0a0a] border-white/10 text-white" {...register("occupation")} />
                        {errors.occupation && <p className="text-sm text-red-400">{errors.occupation.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="income" className="text-white/80">Monthly Income</Label>
                        <Input id="income" placeholder="$8,000" className="bg-[#0a0a0a] border-white/10 text-white" {...register("income")} />
                        {errors.income && <p className="text-sm text-red-400">{errors.income.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeAtJob" className="text-white/80">Time at Job</Label>
                        <Input id="timeAtJob" placeholder="e.g. 3 years" className="bg-[#0a0a0a] border-white/10 text-white" {...register("timeAtJob")} />
                        {errors.timeAtJob && <p className="text-sm text-red-400">{errors.timeAtJob.message}</p>}
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
                      <Label htmlFor="vehicleId" className="text-white/80">Desired Vehicle</Label>
                      <Input id="vehicleId" placeholder="2024 Mercedes-Benz S 580" className="bg-[#0a0a0a] border-white/10 text-white" {...register("vehicleId")} />
                      {errors.vehicleId && <p className="text-sm text-red-400">{errors.vehicleId.message}</p>}
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
                            checked={!tradeIn}
                            onChange={() => setValue("tradeIn", false, { shouldValidate: true })}
                            className="w-5 h-5 accent-[#C0A66A]"
                          />
                          <span className="text-white/80">No</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            value="true"
                            checked={tradeIn}
                            onChange={() => setValue("tradeIn", true, { shouldValidate: true })}
                            className="w-5 h-5 accent-[#C0A66A]"
                          />
                          <span className="text-white/80">Yes</span>
                        </label>
                      </div>
                      {tradeIn && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-2"
                        >
                          <Label htmlFor="tradeInDetails" className="text-white/80">Trade-In Details</Label>
                          <Textarea
                            id="tradeInDetails"
                            placeholder="Year, make, model, mileage, condition..."
                            rows={4}
                            className="bg-[#0a0a0a] border-white/10 text-white resize-none"
                            {...register("tradeInDetails")}
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
                      <Label htmlFor="reference1" className="text-white/80">Reference 1 (Name + Phone)</Label>
                      <Input id="reference1" placeholder="Jane Doe — (604) 123-4567" className="bg-[#0a0a0a] border-white/10 text-white" {...register("reference1")} />
                      {errors.reference1 && <p className="text-sm text-red-400">{errors.reference1.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reference2" className="text-white/80">Reference 2 (Name + Phone)</Label>
                      <Input id="reference2" placeholder="John Smith — (604) 987-6543" className="bg-[#0a0a0a] border-white/10 text-white" {...register("reference2")} />
                      {errors.reference2 && <p className="text-sm text-red-400">{errors.reference2.message}</p>}
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
                        <div><span className="text-white/40">Name:</span> <span className="text-white">{watch("name") || "—"}</span></div>
                        <div><span className="text-white/40">Email:</span> <span className="text-white">{watch("email") || "—"}</span></div>
                        <div><span className="text-white/40">Phone:</span> <span className="text-white">{watch("phone") || "—"}</span></div>
                        <div><span className="text-white/40">DOB:</span> <span className="text-white">{watch("dob") || "—"}</span></div>
                        <div className="md:col-span-2"><span className="text-white/40">Street:</span> <span className="text-white">{watch("street") || "—"}</span></div>
                        <div><span className="text-white/40">City:</span> <span className="text-white">{watch("city") || "—"}</span></div>
                        <div><span className="text-white/40">Province / State:</span> <span className="text-white">{watch("state") || "—"}</span></div>
                        <div><span className="text-white/40">Postal / ZIP:</span> <span className="text-white">{watch("zip") || "—"}</span></div>
                        <div><span className="text-white/40">Employer:</span> <span className="text-white">{watch("employer") || "—"}</span></div>
                        <div><span className="text-white/40">Occupation:</span> <span className="text-white">{watch("occupation") || "—"}</span></div>
                        <div><span className="text-white/40">Income:</span> <span className="text-white">{watch("income") || "—"}</span></div>
                        <div><span className="text-white/40">Vehicle:</span> <span className="text-white">{watch("vehicleId") || "—"}</span></div>
                        <div><span className="text-white/40">Trade-In:</span> <span className="text-white">{tradeIn ? "Yes" : "No"}</span></div>
                        {tradeIn && (
                          <div className="md:col-span-2"><span className="text-white/40">Trade-In Details:</span> <span className="text-white">{watch("tradeInDetails") || "—"}</span></div>
                        )}
                        <div className="md:col-span-2"><span className="text-white/40">Reference 1:</span> <span className="text-white">{watch("reference1") || "—"}</span></div>
                        <div className="md:col-span-2"><span className="text-white/40">Reference 2:</span> <span className="text-white">{watch("reference2") || "—"}</span></div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <Checkbox
                        id="consent"
                        checked={watch("consent")}
                        onCheckedChange={(checked) => setValue("consent", checked === true, { shouldValidate: true })}
                        className="mt-0.5"
                      />
                      <Label htmlFor="consent" className="text-white/80 text-sm font-normal cursor-pointer">
                        I consent to a credit check and understand that my information will be used to process my finance application.
                      </Label>
                    </div>
                    {errors.consent && <p className="text-sm text-red-400">{errors.consent.message}</p>}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="border-white/20 text-white hover:border-[#C0A66A] hover:text-[#C0A66A] bg-transparent disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-[#C0A66A] text-black hover:bg-[#D4BC86]"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="bg-[#C0A66A] text-black hover:bg-[#D4BC86]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
