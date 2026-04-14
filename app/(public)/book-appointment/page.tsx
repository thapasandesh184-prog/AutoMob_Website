import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Car, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Book an Appointment | Prestige Motors",
  description: "Schedule a test drive, service appointment, or private viewing at Prestige Motors. Book your appointment online and experience luxury automotive service.",
};

export default function BookAppointmentPage() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4">Schedule a Visit</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6">
            Book an <span className="text-gradient-gold font-medium">Appointment</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            Schedule a test drive, service visit, or private viewing at your convenience.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Car, title: "Test Drive", desc: "Experience your desired vehicle firsthand with a guided test drive." },
              { icon: Calendar, title: "Private Viewing", desc: "Schedule a one-on-one appointment to explore our showroom." },
              { icon: Clock, title: "Service Visit", desc: "Book maintenance or consultation with our expert service team." },
            ].map((item) => (
              <div key={item.title} className="bg-[#111] border border-white/5 p-6 text-center hover:border-[#C0A66A]/20 transition-all">
                <div className="w-12 h-12 bg-[#C0A66A]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-[#C0A66A]" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#111] border border-white/5 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4">Ready to Book?</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Contact our team to schedule your appointment. We look forward to welcoming you to Prestige Motors.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86] transition-all duration-300"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+17781234567"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium hover:border-[#C0A66A] hover:text-[#C0A66A] transition-all duration-300"
              >
                Call +1 (778) 123-4567
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
