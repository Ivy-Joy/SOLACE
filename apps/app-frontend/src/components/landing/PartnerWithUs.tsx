"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Handshake } from "lucide-react";

export default function PartnerSection() {
  return (
    <section className="bg-[#0b0b0c] border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Left Side: Message */}
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="hidden md:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 text-[#E0BE53]">
              <Handshake size={32} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Partner with the <span className="text-[#E0BE53]">Vision.</span>
              </h2>
              <p className="text-white/50 text-sm mt-1 max-w-md">
                Join us in impacting the marketplace and reaching the digital frontier for Christ.
              </p>
            </div>
          </div>

          {/* Right Side: Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             <Link 
              href="/partners" 
              className="w-full sm:w-auto text-center px-8 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-[#E0BE53] transition-all active:scale-95 shadow-lg"
            >
              Become a Partner
            </Link>
            <Link 
              href="/marketplace" 
              className="w-full sm:w-auto text-center px-8 py-4 rounded-full border border-white/10 text-white/60 font-bold text-xs uppercase tracking-widest hover:border-[#E0BE53] hover:text-[#E0BE53] transition-all"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}