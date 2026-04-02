"use client";

import { motion } from "framer-motion";

export default function AboutSolace() {
  return (
    <section className="relative py-16 bg-[#F9F7F2] overflow-hidden">
      
      {/* Subtle glow (reduced) */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#E0BE53]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          
          {/* LEFT */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <span className="text-[#C6A15A] text-[10px] uppercase tracking-[0.4em] font-bold block mb-3">
              Our Identity
            </span>

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a1a1b] leading-tight">
              The Heart of <span className="italic text-[#C6A15A]">Solace</span>
            </h2>
          </motion.div>

          {/* RIGHT */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-7"
          >
            <p className="text-lg md:text-xl text-[#1a1a1b] font-medium leading-snug">
              Serving Our Lord And Christ Every Day.
            </p>

            <p className="mt-3 text-sm md:text-base text-gray-600 leading-relaxed">
              SOLACE is the youth ministry of{" "}
              <strong className="text-gray-900">Good Shepherd AGC</strong>, 
              a vibrant sanctuary dedicated to discipling the next generation. We bridge the gap 
                for young people aged{" "}
              <span className="text-[#C6A15A] font-semibold">12–35</span>.
            </p>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
}