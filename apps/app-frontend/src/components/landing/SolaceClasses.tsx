"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ChevronRight, Users, Target } from "lucide-react";

const classes = [
  { 
    key: 'vuka', 
    label: 'VUKA', 
    age: '12 years', 
    num: '01',
    image: '/images/Vuka.png',
    focus: ['Bible Foundations', 'Identity in Christ'] 
  },
  { 
    key: 'ropes', 
    label: 'ROPEs', 
    age: '13 years', 
    num: '02',
    image: '/images/Ropes.png',
    focus: ['Spiritual Discipline', 'Mentorship'] 
  },
  { 
    key: 'teens', 
    label: 'TEENS', 
    age: '14–17 years', 
    num: '03',
    image: '/images/Teens.png',
    focus: ['Leadership', 'Discipleship'] 
  },
  { 
    key: 'mph', 
    label: 'MPH', 
    age: '18–25 years', 
    num: '04',
    image: '/images/MPH.png',
    focus: ['Purpose', 'Service'] 
  },
  { 
    key: 'young', 
    label: 'YOUNG ADULTS', 
    age: '25–35 years', 
    num: '05',
    image: '/images/YoungAdults.png',
    focus: ['Leadership', 'Kingdom Impact'] 
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

export default function SolaceClasses() {
  return (
    <section id="classes" className="relative bg-white py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header Section - More compact margin */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[#C6A15A] text-[10px] uppercase tracking-[0.5em] font-black"
            >
              The Journey
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-serif font-black text-black mt-2 tracking-tighter italic"
            >
              Faith at <span className="text-[#C6A15A] not-italic">Every Stage.</span>
            </motion.h2>
          </div>
          <p className="text-gray-400 text-[11px] font-medium max-w-xs uppercase tracking-wider">
            Tailored discipleship for every age group.
          </p>
        </div>

        {/* Classes Grid - Forced into 5 columns on desktop */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {classes.map((c) => (
            <motion.div 
              key={c.key} 
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="group relative bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden transition-all hover:shadow-xl hover:shadow-[#C6A15A]/10"
            >
              {/* Image Container - Reduced to h-32 (Compact) */}
              <div className="relative h-32 w-full bg-gray-50 overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-[8px] font-black tracking-widest uppercase">Curriculum</span>
                </div>
                {/* Number Watermark - Smaller */}
                <span className="absolute top-3 right-4 text-2xl font-black text-white/20">
                    {c.num}
                </span>
              </div>

              {/* Content Area - Tighter padding (p-6) */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-black mb-0.5 uppercase tracking-tight">
                      {c.label}
                    </h3>
                    <p className="text-[#C6A15A] font-black text-[9px] uppercase tracking-[0.2em]">
                      {c.age}
                    </p>
                  </div>
                  <Users size={12} className="text-[#C6A15A]/40 mt-1" />
                </div>

                <div className="space-y-2 mb-6">
                  {c.focus.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                      <div className="w-1 h-1 rounded-full bg-[#C6A15A]/40" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href={`/solaceclasses/${c.key}`}
                  className="flex items-center justify-between w-full py-2.5 px-4 rounded-lg bg-gray-50 text-[9px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all"
                >
                  Explore <ChevronRight size={10} className="text-[#C6A15A]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Block - Tightened & Compact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 relative bg-black rounded-[2rem] p-8 md:p-10 overflow-hidden text-center"
        >
          <div className="relative z-10 max-w-xl mx-auto">
            <h3 className="text-xl md:text-3xl font-serif italic font-black text-white mb-3">
              Be Part of the <span className="text-[#C6A15A] not-italic">Movement.</span>
            </h3>
            
            <p className="text-white/50 max-w-md mx-auto mb-6 text-xs font-medium uppercase tracking-wider leading-relaxed">
              Join a generation committed to Christ, discipleship, and 
              <span className="text-white"> transforming the marketplace.</span>
            </p>
            
            <div className="flex flex-row gap-3 justify-center items-center">
              <Link 
                href="/join" 
                className="bg-[#C6A15A] text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[8px] hover:bg-white transition-all shadow-lg shadow-[#C6A15A]/10"
              >
                Join SOLACE
              </Link>
              <Link 
                href="/leaders" 
                className="bg-transparent border border-white/10 text-white px-6 py-3 rounded-full font-black uppercase tracking-widest text-[8px] hover:bg-white/10 transition-all"
              >
                Our Leaders
              </Link>
            </div>
          </div>

          {/* Minimalist ambient glow - corner only */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C6A15A]/10 blur-[60px]" />
        </motion.div>
      </div>
    </section>
  );
}