"use client";

import React from "react";
import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";
import DiscipleshipForm from "@/src/components/discipleship/DiscipleshipForm";
import { Check } from "lucide-react";

const STAGES = [
  { id: "seeker", title: "The Seeker", desc: "Exploring foundations and asking the big questions." },
  { id: "new_believer", title: "New Believer", desc: "Starting the journey with a fresh commitment to Christ." },
  { id: "foundation", title: "Foundation", desc: "Rooting your life in deep spiritual disciplines." },
  { id: "serve", title: "Serve", desc: "Extending your faith through ministry and community impact." },
  { id: "leader", title: "Leader", desc: "Equipping others and multiplying the mission." },
];

export default function DiscipleshipPage() {
  return (
    <main className="min-h-screen bg-[#F9F7F2]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C6A15A] mb-6">
            The Journey of Faith
          </h2>
          <h1 className="text-5xl md:text-7xl font-serif italic font-black text-gray-900 leading-tight">
            Intentional Discipleship.
          </h1>
          <p className="mt-8 text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Spiritual growth is not an accident. It is a curated path of mentorship, 
            scripture, and community designed to move you from seeking to leading.
          </p>
        </div>
      </section>

      {/* THE PATHWAY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8">
            {STAGES.map((stage, idx) => (
              <div key={stage.id} className="relative group">
                <div className="text-[60px] font-serif italic text-gray-100 absolute -top-8 -left-2 group-hover:text-[#C6A15A]/10 transition-colors duration-500">
                  0{idx + 1}
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-3 text-gray-900">{stage.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENROLLMENT SECTION */}
      <section id="enroll" className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-black rounded-[40px] overflow-hidden shadow-2xl grid lg:grid-cols-2">
          
          {/* Left Side: Branding & Value Prop */}
          <div className="p-12 lg:p-16 flex flex-col justify-between text-white bg-zinc-900">
            <div>
                <h2 className="text-3xl font-serif italic font-bold mb-6">A Christ-Led Pathway</h2>
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                  Discipleship is open to everyone, everywhere. Whether you are online or local, 
                  this is an intentional space to bring His people to Him.
                </p>
                <ul className="space-y-4">
                  {[
                    "Personalized Mentorship Matching",
                    "Weekly Teaching Modules & Quizzes",
                    "Micro-challenges for Real-life Impact",
                    "Official Milestone Certification"
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-zinc-400">
                      <Check className="text-[#C6A15A] shrink-0" size={18} />
                      {item}
                    </li>
                  ))}
                </ul>
            </div>

            <div className="mt-12">
               <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-loose">
                 Global Access • Christ-Centered • Community Driven
               </p>
            </div>
          </div>
             
          {/* Right Side: The Form Hook */}
          <div className="bg-white p-12 lg:p-16">
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Apply for Discipleship</h3>
              <p className="text-gray-500 text-sm mt-1">Please fill out the details below to begin.</p>
            </div>
            <DiscipleshipForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}