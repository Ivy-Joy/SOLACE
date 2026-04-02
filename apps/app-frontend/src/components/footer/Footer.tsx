"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  MapPin, 
  Phone,
  ArrowUpRight 
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    ministry: [
      { name: "Our Story", href: "/about" },
      { name: "Leadership", href: "/leaders" },
      { name: "Classes", href: "/solaceclasses" },
      { name: "Discipleship", href: "/discipleship" },
      { name: "Partnerships", href: "/partners" },
    ],
    resources: [
      { name: "Sermon Archive", href: "/sermons" },
      { name: "Prayer Wall", href: "/prayer-wall" },
      { name: "Events", href: "/events" },
      { name: "Giving", href: "/give" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ]
  };

  return (
    <footer className="bg-[#0b0b0c] text-white pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* 1. TOP SECTION: BIG LOGO & TAGLINE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-6">
            <Link href="/" className="group inline-block">
              <span className="text-4xl font-black tracking-tighter italic group-hover:text-[#E0BE53] transition-colors">
                S.O.L.A.C.E<span className="text-[#E0BE53]">.</span>
              </span>
            </Link>
            <p className="mt-6 text-xl text-white/50 max-w-sm leading-relaxed font-light">
              Building a Christ-centered legacy for the next generation in the heart of Good Shepherd AGC.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-5 mt-10">
              {[Instagram, Twitter, Youtube, Mail].map((Icon, idx) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:border-[#E0BE53] hover:text-[#E0BE53] hover:-translate-y-1 transition-all"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* 2. NAVIGATION COLUMNS */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#E0BE53] font-bold mb-6">Ministry</h4>
              <ul className="space-y-4">
                {footerLinks.ministry.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-white/40 hover:text-white flex items-center gap-1 group">
                      {link.name} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#E0BE53] font-bold mb-6">Resources</h4>
              <ul className="space-y-4">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-white/40 hover:text-white flex items-center gap-1 group">
                      {link.name} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#E0BE53] font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-sm text-white/40">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#E0BE53] shrink-0" />
                  <span>Nairobi, Kenya<br/>Good Shepherd AGC</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-[#E0BE53] shrink-0" />
                  <span>+254 700 000000</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest text-white/30">
            &copy; {currentYear} SOLACE Youth Ministry. All Rights Reserved.
          </p>
          
          <div className="flex gap-8">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <motion.button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1 }}
            className="text-[10px] uppercase tracking-widest text-[#E0BE53] font-bold"
          >
            Back to top ↑
          </motion.button>
        </div>

      </div>
    </footer>
  );
}