"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { getSafeMapEmbedUrl } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { settings } = useSiteSettings();

  const phone = settings.phone || "+1 (778) 123-4567";
  const email = settings.email || "sales@prestigemotors.com";
  const address = settings.address || "123 Luxury Lane";
  const city = settings.city || "Vancouver";
  const state = settings.state || "BC";
  const zip = settings.zip || "V6B 1A1";
  const hours = settings.hours || "Mon - Sat: 10am - 7pm";
  const mapEmbedUrl = getSafeMapEmbedUrl(settings.mapEmbedUrl);

  const contactFormLabels = {
    name: "Full Name", email: "Email Address", phone: "Phone Number", subject: "Subject", message: "Message",
  };
  const contactFormPlaceholders = {
    name: "John Doe", email: "john@example.com", phone: "(778) 123-4567", subject: "Select a subject", message: "How can we help you?",
  };
  const contactFormSubjects = [
    "General Inquiry","Vehicle Information","Financing","Trade-In","Service","Parts","Other",
  ];
  const contactFormTitle = "Send us a Message";
  const contactFormSubtitle = "Fill out the form below and we'll get back to you within 24 hours.";
  const contactFormSubmitButton = "Send Message";
  const contactFormSubmittingText = "Sending...";
  const contactRecaptchaPlaceholder = "reCAPTCHA placeholder";
  const contactRecaptchaNotice = "Protected by reCAPTCHA";
  const contactHeroEyebrow = "Get in Touch";
  const contactHeroTitle = "Contact Us";
  const contactHeroSubtitle = "Have questions? We'd love to hear from you. Reach out and our team will respond as soon as possible.";

  const contactInfo = useMemo(
    () => {
      const cardTitles = [
        { key: "visit", title: "Visit Us" },
        { key: "call", title: "Call Us" },
        { key: "email", title: "Email Us" },
        { key: "hours", title: "Hours" },
      ];
      const sundayClosed = "Sunday: Closed";
      return [
        {
          icon: MapPin,
          title: cardTitles.find(c => c.key === "visit")?.title || "Visit Us",
          lines: [address, `${city}, ${state} ${zip}`],
          href: "/directions",
        },
        {
          icon: Phone,
          title: cardTitles.find(c => c.key === "call")?.title || "Call Us",
          lines: [phone],
          href: `tel:${phone.replace(/\s+/g, "")}`,
        },
        {
          icon: Mail,
          title: cardTitles.find(c => c.key === "email")?.title || "Email Us",
          lines: [email],
          href: `mailto:${email}`,
        },
        {
          icon: Clock,
          title: cardTitles.find(c => c.key === "hours")?.title || "Hours",
          lines: [hours, sundayClosed],
        },
      ];
    },
    [address, city, state, zip, phone, email, hours]
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast.success("Message sent successfully! We'll be in touch soon.");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            {contactHeroEyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6"
          >
            {contactHeroTitle.split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold font-medium">{contactHeroTitle.split(" ").pop()}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto font-light"
          >
            {contactHeroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#111] border border-white/5 p-6 hover:border-[#C0A66A]/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#C0A66A]/10 flex items-center justify-center mb-4">
                  <info.icon className="w-5 h-5 text-[#C0A66A]" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{info.title}</h3>
                {info.href ? (
                  <a
                    href={info.href}
                    className="text-white/60 hover:text-[#C0A66A] transition-colors"
                    aria-label={info.title}
                  >
                    {info.lines.map((line, i) => (
                      <p key={i} className="text-sm">
                        {line}
                      </p>
                    ))}
                  </a>
                ) : (
                  <div className="text-white/60">
                    {info.lines.map((line, i) => (
                      <p key={i} className="text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form */}
            <motion.form
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit(onSubmit)}
              className="bg-[#111] border border-white/5 p-6 md:p-10 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-light text-white mb-2">{contactFormTitle}</h2>
                <p className="text-white/50 text-sm">
                  {contactFormSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">
                    {contactFormLabels.name}
                  </Label>
                  <Input
                    id="name"
                    placeholder={contactFormPlaceholders.name}
                    className="bg-[#0a0a0a] border-white/10 text-white"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">
                    {contactFormLabels.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={contactFormPlaceholders.email}
                    className="bg-[#0a0a0a] border-white/10 text-white"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/80">
                  {contactFormLabels.phone}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={contactFormPlaceholders.phone}
                  className="bg-[#0a0a0a] border-white/10 text-white"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-400">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white/80">
                  {contactFormLabels.subject}
                </Label>
                <Select onValueChange={(value: string | null) => typeof value === "string" && setValue("subject", value)}>
                  <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-white">
                    <SelectValue placeholder={contactFormPlaceholders.subject} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10">
                    {contactFormSubjects.map((s) => (
                      <SelectItem key={s} value={s} className="text-white">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p className="text-sm text-red-400">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white/80">
                  {contactFormLabels.message}
                </Label>
                <Textarea
                  id="message"
                  placeholder={contactFormPlaceholders.message}
                  rows={5}
                  className="bg-[#0a0a0a] border-white/10 text-white resize-none"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-sm text-red-400">{errors.message.message}</p>
                )}
              </div>

              {/* reCAPTCHA Placeholder */}
              <div className="space-y-2">
                <div className="h-16 bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
                  <span className="text-white/40 text-sm">{contactRecaptchaPlaceholder}</span>
                </div>
                <p className="text-xs text-white/40">{contactRecaptchaNotice}</p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#C0A66A] text-black hover:bg-[#D4BC86] font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {contactFormSubmittingText}
                  </>
                ) : (
                  contactFormSubmitButton
                )}
              </Button>
            </motion.form>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#111] border border-white/5 overflow-hidden h-full min-h-[400px]"
            >
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "100%" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Prestige Motors Location"
                className="grayscale-[30%]"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
