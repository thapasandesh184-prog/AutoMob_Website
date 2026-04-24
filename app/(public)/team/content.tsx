"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const team = [
  {
    name: "James Morrison",
    title: "Sales Manager",
    bio: "With over 15 years in luxury automotive sales, James ensures every client drives away with the perfect vehicle.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80",
    email: "james@skayautogroup.ca",
  },
  {
    name: "Sarah Chen",
    title: "Finance Director",
    bio: "Sarah crafts tailored financing solutions, making luxury ownership accessible and straightforward.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80",
    email: "sarah@skayautogroup.ca",
  },
  {
    name: "Marcus Rodriguez",
    title: "Service Advisor",
    bio: "Marcus oversees our service department with a passion for keeping every vehicle in peak condition.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
    email: "marcus@skayautogroup.ca",
  },
  {
    name: "Emily Watson",
    title: "General Manager",
    bio: "Emily leads SKay Auto group with a commitment to excellence and an unmatched customer-first approach.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80",
    email: "emily@skayautogroup.ca",
  },
];

export default function TeamContent() {
  return (
    <div className="overflow-x-hidden bg-black min-h-screen pb-20">
      {/* Hero */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#C0A66A] text-sm md:text-base tracking-[0.3em] uppercase mb-4">
            The People Behind SKay
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-4">
            Meet Our <span className="text-gradient-gold font-medium">Team</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            Passionate professionals dedicated to delivering an exceptional automotive experience.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#111] border border-white/5 overflow-hidden text-center"
              >
                <div className="aspect-square overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-medium text-white">{member.name}</h3>
                  <p className="text-[#C0A66A] text-sm tracking-wide uppercase">{member.title}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{member.bio}</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-[#C0A66A] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
