"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#000] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_70%)]" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C0A66A]/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C0A66A]/5 blur-3xl" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-[150px] sm:text-[200px] font-light leading-none tracking-tighter mb-4 text-gradient-gold"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white text-2xl sm:text-3xl font-light mb-4"
        >
          Oops! That page can&apos;t be found.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/50 text-base sm:text-lg mb-10 font-light"
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/">
            <Button className="h-12 px-8 bg-[#C0A66A] text-black hover:bg-[#D4BC86] font-medium text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
