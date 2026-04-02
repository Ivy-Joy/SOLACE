"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Play, Calendar, Users, Sparkles } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.4 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  },
};

export default function PremiumHero() {
  return (
    <header className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0b] text-white flex items-center">
      
      {/* 1. IMAGE TREATMENT */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }} // Lowered opacity to 50% for text pop
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src="/hero-solace3.png" 
            alt="SOLACE youth ministry group"
            priority
            fill
            className="object-cover object-center"
          />
        </motion.div>
        
        {/* The "Pocket" Gradient - Darker on the left where text lives */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/90 via-[#0a0a0b]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent z-10" />
      </div>

      {/* 2. CONTENT */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 pt-32 pb-20 ">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Subtle Badge */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
            <div className="h-[1px] w-8 bg-[#E0BE53]" />
            <span className="text-[#E0BE53] text-xs uppercase tracking-[0.4em] font-bold">
              Youth Ministry of Good Shepherd AGC
            </span>
          </motion.div>

          {/* MAIN HEADLINE - Use Playfair for that luxury feel */}
          <motion.h1 
            variants={itemVariants}
            //className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] mb-6"
            className="text-6xl md:text-8xl font-serif italic font-black tracking-tighter leading-[0.9] mb-8 text-white drop-shadow-sm"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Finding <span className="text-[#E0BE53] not-italic">Rest</span> <br />
            in His Light. 
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed font-light mb-10"
          >
            We are a generation set apart. Empowering young minds to lead, 
            serve, and thrive through the grace of Christ everyday.
          </motion.p>

          {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
        <Link 
          href="/join" 
          className="group relative overflow-hidden bg-gold text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(224,190,83,0.3)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Play size={14} fill="black" /> Join the Movement
          </span>
          {/* Shimmer Effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shine_1s_ease-in-out]" />
        </Link>

            <Link 
              href="/solaceclasses" 
              className="group flex items-center gap-2 border border-white/10 backdrop-blur-md px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:bg-white/10 hover:border-[#E0BE53]"
            >
              Our Programs
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-[#E0BE53]" />
            </Link>
          </motion.div>

          {/* INFO BAR */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-12 border-t border-white/5 pt-10"
          >
            <div className="space-y-2 rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-[#E0BE53]">
                <Calendar size={16} />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em]">
                  Schedule
                </span>
              </div>

              <p className="text-sm font-medium leading-relaxed text-slate-700">
                <strong className="text-slate-900">Friday:</strong> Young Professionals Meeting @6PM <br />
                <strong className="text-slate-900">Sunday:</strong> Solace Church Services @9-11AM & 11-1PM
              </p>
            </div>


            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#E0BE53]">
                <Users size={14} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Community</span>
              </div>
              <p className="text-sm font-medium">Ages 12 - 35 Welcome</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Aesthetic Side Label */}
      <div className="absolute right-10 bottom-48 hidden lg:block rotate-90 origin-right">
        <span className="text-[10px] uppercase tracking-[1em] text-white/20 font-bold whitespace-nowrap">
          ESTABLISHED IN GRACE
        </span>
      </div>
    </header>
  );
}