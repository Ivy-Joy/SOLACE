//Join and Lead Application Forms
// apps/app-frontend/app/join/page.tsx
// apps/app-frontend/app/join/page.tsx
"use client";

import Navbar from "@/src/components/navbar/Navbar";
import JoinForm from "@/src/components/cta/JoinForm";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link"; // Added Link

export default function JoinPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Side: Visual Inspiration */}
        <section className="hidden lg:flex lg:w-1/2 relative bg-[#F9F7F2] items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/mission-visual.png" 
              alt="Join SOLACE"
              fill
              className="object-cover opacity-10 grayscale"
            />
          </div>
          <div className="relative z-10 max-w-md text-center">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gold text-xs uppercase tracking-[0.5em] font-black mb-6 block"
            >
              The First Step
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-serif italic font-black text-dark leading-tight mb-6"
            >
              Welcome to the <span className="text-gold not-italic">S.O.L.A.C.E</span>
            </motion.h1>
            <p className="text-gray-500 font-light leading-relaxed">
              You are about to join a generation redefining youth worship. 
              One minute is all it takes to start your journey.
            </p>
          </div>
        </section>

        {/* Right Side: The Form */}
        <section className="flex-1 pt-32 pb-20 px-6 lg:px-16 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <div className="mb-10 text-center lg:text-left">
               <h1 className="text-3xl font-serif font-black italic text-dark">Join SOLACE</h1>
               <p className="text-gray-400 text-sm mt-2 font-light">
                Already a member of SOLACE?{" "}
                <Link href="/login" className="text-gold font-bold hover:underline underline-offset-4">
                  Login here
                </Link>
               </p>
            </div>
            <JoinForm />
          </div>
        </section>
      </div>
    </main>
  );
}