"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  minYear: z.string().optional(),
  maxYear: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  bodyStyle: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  driveType: z.string().optional(),
  color: z.string().optional(),
  maxMileage: z.string().optional(),
  features: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const featureOptions = [
  "Leather Seats",
  "Sunroof / Moonroof",
  "Navigation System",
  "Heated Seats",
  "Backup Camera",
  "Bluetooth",
  "Apple CarPlay",
  "Android Auto",
  "Premium Audio",
  "Third Row Seating",
];

export default function CarFinderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      features: [],
    },
  });

  const selectedFeatures = watch("features") || [];

  const toggleFeature = (feature: string) => {
    const current = selectedFeatures;
    if (current.includes(feature)) {
      setValue(
        "features",
        current.filter((f) => f !== feature)
      );
    } else {
      setValue("features", [...current, feature]);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/car-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Request submitted! We'll find your perfect match.");
        setSubmitted(true);
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-x-hidden bg-black min-h-screen pb-20">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4">
            Find Your Dream Car
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-4">
            Car <span className="text-gradient-gold font-medium">Finder</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            Tell us exactly what you&apos;re looking for and we&apos;ll hunt it down for you.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111] border border-white/5 p-6 md:p-10">
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
                  We have received your request. One of our specialists will contact you shortly with matching vehicles.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Contact */}
                <div className="space-y-6">
                  <h2 className="text-xl font-medium text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-[#C0A66A]" />
                    Your Preferences
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input {...register("name")} className="bg-black border-white/10 text-white" />
                      {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input type="email" {...register("email")} className="bg-black border-white/10 text-white" />
                      {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input {...register("phone")} className="bg-black border-white/10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label>Make</Label>
                    <Input {...register("make")} placeholder="e.g. BMW" className="bg-black border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input {...register("model")} placeholder="e.g. X5" className="bg-black border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>Body Style</Label>
                    <Select onValueChange={(v: string | null) => typeof v === "string" && setValue("bodyStyle", v)}>
                      <SelectTrigger className="bg-black border-white/10 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10">
                        <SelectItem value="Sedan" className="text-white">Sedan</SelectItem>
                        <SelectItem value="SUV" className="text-white">SUV</SelectItem>
                        <SelectItem value="Coupe" className="text-white">Coupe</SelectItem>
                        <SelectItem value="Convertible" className="text-white">Convertible</SelectItem>
                        <SelectItem value="Wagon" className="text-white">Wagon</SelectItem>
                        <SelectItem value="Hatchback" className="text-white">Hatchback</SelectItem>
                        <SelectItem value="Truck" className="text-white">Truck</SelectItem>
                        <SelectItem value="Van" className="text-white">Van</SelectItem>
                        <SelectItem value="Other" className="text-white">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Min Year</Label>
                    <Input {...register("minYear")} placeholder="e.g. 2020" className="bg-black border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Year</Label>
                    <Input {...register("maxYear")} placeholder="e.g. 2024" className="bg-black border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input {...register("color")} placeholder="e.g. Black" className="bg-black border-white/10 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label>Min Price</Label>
                    <Input {...register("minPrice")} placeholder="e.g. 30000" className="bg-black border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Price</Label>
                    <Input {...register("maxPrice")} placeholder="e.g. 80000" className="bg-black border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Mileage</Label>
                    <Input {...register("maxMileage")} placeholder="e.g. 50000" className="bg-black border-white/10 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label>Transmission</Label>
                    <Select onValueChange={(v: string | null) => typeof v === "string" && setValue("transmission", v)}>
                      <SelectTrigger className="bg-black border-white/10 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10">
                        <SelectItem value="Automatic" className="text-white">Automatic</SelectItem>
                        <SelectItem value="Manual" className="text-white">Manual</SelectItem>
                        <SelectItem value="CVT" className="text-white">CVT</SelectItem>
                        <SelectItem value="Other" className="text-white">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fuel Type</Label>
                    <Select onValueChange={(v: string | null) => typeof v === "string" && setValue("fuelType", v)}>
                      <SelectTrigger className="bg-black border-white/10 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10">
                        <SelectItem value="Gasoline" className="text-white">Gasoline</SelectItem>
                        <SelectItem value="Diesel" className="text-white">Diesel</SelectItem>
                        <SelectItem value="Hybrid" className="text-white">Hybrid</SelectItem>
                        <SelectItem value="Electric" className="text-white">Electric</SelectItem>
                        <SelectItem value="Plug-in Hybrid" className="text-white">Plug-in Hybrid</SelectItem>
                        <SelectItem value="Other" className="text-white">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Drive Type</Label>
                    <Select onValueChange={(v: string | null) => typeof v === "string" && setValue("driveType", v)}>
                      <SelectTrigger className="bg-black border-white/10 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10">
                        <SelectItem value="FWD" className="text-white">FWD</SelectItem>
                        <SelectItem value="RWD" className="text-white">RWD</SelectItem>
                        <SelectItem value="AWD" className="text-white">AWD</SelectItem>
                        <SelectItem value="4WD" className="text-white">4WD</SelectItem>
                        <SelectItem value="Other" className="text-white">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <Label>Preferred Features</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {featureOptions.map((feature) => (
                      <label key={feature} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={() => toggleFeature(feature)}
                        />
                        <span className="text-sm text-white/80">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    {...register("notes")}
                    rows={4}
                    placeholder="Any other details we should know?"
                    className="bg-black border-white/10 text-white resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#C0A66A] text-black hover:bg-[#D4BC86] font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Find My Car"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
