"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Shield, Sliders, Calculator, ChevronDown, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";

const iconMap: Record<string, React.ElementType> = { TrendingUp, Clock, Sliders, Shield };

const benefits = [
  { icon: "TrendingUp", title: "Competitive Rates", description: "We partner with leading financial institutions to offer rates that work for you." },
  { icon: "Clock", title: "Fast Approval", description: "Our streamlined approval process means you can get behind the wheel sooner." },
  { icon: "Sliders", title: "Flexible Terms", description: "Choose from a variety of loan terms and payment plans to fit your budget." },
];

const processSteps = [
  { number: "01", title: "Apply Online", description: "Fill out our secure application in minutes from the comfort of your home." },
  { number: "02", title: "Get Approved", description: "Our finance specialists review your application and present tailored options." },
  { number: "03", title: "Drive Away", description: "Finalize the paperwork and drive away in your dream vehicle the same day." },
];

const faqs = [
  { question: "What credit scores do you accept?", answer: "We work with a wide range of credit profiles. Our finance team specializes in finding solutions for all credit situations." },
  { question: "Can I trade in my current vehicle?", answer: "Yes. We accept trade-ins and can apply the value directly toward your new vehicle purchase." },
  { question: "How long does approval take?", answer: "Most applications receive a response within 24 hours. In many cases, same-day approval is available." },
  { question: "Do you offer leasing options?", answer: "We primarily focus on financing, but our team can discuss all available options to find what works best for you." },
];

const calcLabels = {
  price: "Vehicle Price",
  downPayment: "Down Payment",
  rate: "Interest Rate (%)",
  term: "Loan Term (months)",
  result: "Estimated Monthly Payment",
};

export default function FinancePage() {
  const [vehiclePrice, setVehiclePrice] = useState<number>(80000);
  const [downPayment, setDownPayment] = useState<number>(16000);
  const [interestRate, setInterestRate] = useState<number>(5.99);
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const principal = Math.max(0, vehiclePrice - downPayment);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;

    if (monthlyRate === 0) {
      setMonthlyPayment(principal / numberOfPayments);
    } else {
      const payment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      setMonthlyPayment(isNaN(payment) || !isFinite(payment) ? 0 : payment);
    }
  }, [vehiclePrice, downPayment, interestRate, loanTerm]);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4"
          >
            Financing Solutions
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6"
          >
            Finance <span className="text-gradient-gold font-medium">Department</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto font-light"
          >
            Competitive financing options tailored to make your dream car a reality.
          </motion.p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = (iconMap[benefit.icon] || Shield) as any;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 bg-[#111] border border-white/5 hover:border-[#C0A66A]/20 transition-all duration-500"
                >
                  <div className="w-14 h-14 bg-[#C0A66A]/10 flex items-center justify-center mb-6 group-hover:bg-[#C0A66A]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#C0A66A]" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3">{benefit.title}</h3>
                  <p className="text-white/50 leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Financing Process Section */}
      <section className="py-20 md:py-28 bg-[#0a0a0a] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3"
            >
              How It Works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-light text-white"
            >
              Our Financing <span className="text-gradient-gold">Process</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative p-8 bg-[#111] border border-white/5 hover:border-[#C0A66A]/20 transition-all duration-500"
              >
                <span className="absolute top-6 right-6 text-5xl font-light text-white/5">
                  {step.number}
                </span>
                <h3 className="text-xl font-medium text-white mb-3 relative z-10">{step.title}</h3>
                <p className="text-white/50 leading-relaxed relative z-10">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3"
            >
              Plan Your Purchase
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-light text-white"
            >
              Payment <span className="text-gradient-gold">Calculator</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#111] border border-white/5 p-6 md:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                <div>
                  <Label className="text-white/70 mb-2 block">
                    {calcLabels.price}:{" "}
                    <span className="text-white">${vehiclePrice.toLocaleString()}</span>
                  </Label>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="1000"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                    className="w-full accent-[#C0A66A]"
                  />
                </div>

                <div>
                  <Label className="text-white/70 mb-2 block">
                    {calcLabels.downPayment}:{" "}
                    <span className="text-white">${downPayment.toLocaleString()}</span>
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="1000"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full accent-[#C0A66A]"
                  />
                </div>

                <div>
                  <Label className="text-white/70 mb-2 block">
                    {calcLabels.rate}:{" "}
                    <span className="text-white">{interestRate}%</span>
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-[#C0A66A]"
                  />
                </div>

                <div>
                  <Label className="text-white/70 mb-2 block">
                    {calcLabels.term}:{" "}
                    <span className="text-white">{loanTerm} months</span>
                  </Label>
                  <input
                    type="range"
                    min="12"
                    max="84"
                    step="12"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full accent-[#C0A66A]"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/5 p-8">
                <Calculator className="w-10 h-10 text-[#C0A66A] mb-4" />
                <p className="text-white/60 text-sm uppercase tracking-wider mb-2">
                  {calcLabels.result}
                </p>
                <p className="text-5xl md:text-6xl font-light text-[#C0A66A]">
                  ${monthlyPayment.toFixed(0)}
                </p>
                <p className="text-white/40 text-sm mt-4 text-center">
                  *This estimate is for illustrative purposes only. Actual terms may vary based on credit approval and other factors.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-[#0a0a0a] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#C0A66A] text-sm tracking-[0.2em] uppercase mb-3"
            >
              Have Questions?
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-light text-white"
            >
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </motion.h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#111] border border-white/5 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C0A66A] shrink-0 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-white/60 leading-relaxed">{faq.answer}</div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-light text-white mb-6"
          >
            Ready to Get <span className="text-gradient-gold">Started</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg mb-10 max-w-2xl mx-auto"
          >
            Apply for financing today and take the first step toward driving your dream vehicle.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/finance/application"
              className="group px-8 py-4 bg-[#C0A66A] text-black font-medium hover:bg-[#D4BC86] transition-all duration-300 inline-flex items-center gap-2"
            >
              Apply for Financing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white/20 text-white font-medium hover:border-[#C0A66A] hover:text-[#C0A66A] transition-all duration-300 inline-flex items-center gap-2"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
