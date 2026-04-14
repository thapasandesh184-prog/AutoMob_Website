import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Prestige Motors",
  description: "Read the Terms of Service for Prestige Motors. Understand the terms and conditions governing your use of our website and services.",
};

export default function TermsPage() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6">
            Terms of <span className="text-gradient-gold font-medium">Service</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">Last updated: April 2025</p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Acceptance of Terms</h2>
            <p className="text-white/60 leading-relaxed">
              By accessing and using the Prestige Motors website, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our website.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Use of Website</h2>
            <p className="text-white/60 leading-relaxed">
              You agree to use our website for lawful purposes only. You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Intellectual Property</h2>
            <p className="text-white/60 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of Prestige Motors and is protected by copyright and other intellectual property laws.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Limitation of Liability</h2>
            <p className="text-white/60 leading-relaxed">
              Prestige Motors shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our website or services.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Contact Us</h2>
            <p className="text-white/60 leading-relaxed whitespace-pre-line">
              If you have any questions about these Terms of Service, please contact us at:

              Prestige Motors
              123 Luxury Lane
              Vancouver, BC V6B 1A1
              Email: sales@prestigemotors.com
              Phone: +1 (778) 123-4567
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
