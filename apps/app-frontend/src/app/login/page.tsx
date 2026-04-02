// apps/app-frontend/app/login/page.tsx
"use client";

import Navbar from "@/src/components/navbar/Navbar";
import LoginForm from "@/src/components/login/LoginForm";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Side: Visual */}
        <section className="hidden lg:flex lg:w-1/2 relative bg-dark items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/login-visual.png" 
              alt="Member Access"
              fill
              className="object-cover opacity-20 grayscale"
            />
          </div>
          <div className="relative z-10 max-w-md text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-serif italic font-black text-white leading-tight mb-6"
            >
              Welcome <span className="text-gold not-italic">Home</span>
            </motion.h1>
            <p className="text-gray-400 font-light leading-relaxed">
              Access your member portal and continue your journey with the SOLACE family.
            </p>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="flex-1 pt-32 pb-20 px-6 lg:px-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
               <h1 className="text-3xl font-serif font-black italic text-dark">Member Login</h1>
               <p className="text-gray-400 text-sm mt-2 font-light">
                New here?{" "}
                <Link href="/join" className="text-gold font-bold hover:underline underline-offset-4">
                  Create an account
                </Link>
               </p>
            </div>
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}