// apps/app-frontend/src/components/landing/DiscipleshipForm.jsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, Globe, Users } from "lucide-react";

export default function DiscipleshipSection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-12 bg-zinc-950 text-white">
      {/* Rugged Texture Overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('/images/backgrounds/rugged_texture.png')] bg-cover bg-center pointer-events-none" />

      <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-8 px-5 sm:px-6 lg:grid-cols-2 lg:gap-10">
        {/* LEFT COLUMN */}
        <div className="relative flex justify-center lg:justify-start">
          <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C6A15A]/10 blur-[80px] pointer-events-none" />

          <div className="relative z-0 aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-3xl">
            <Image
              src="/mentors/mentors_ropes.png"
              alt="Mentorship"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-zinc-950/20" />
            <div className="absolute inset-0 bg-linear-to-r from-zinc-950/40 via-transparent to-zinc-950/40" />
          </div>

          <div className="absolute -bottom-4 -left-1 z-20 hidden w-40 rotate-[-3deg] sm:block md:-left-6 md:w-48">
            <div className="overflow-hidden rounded-3xl border-4 border-zinc-900 bg-zinc-950 shadow-2xl">
              <div className="flex min-h-[230px] flex-col bg-[#111] p-3 font-serif italic text-white">
                <div className="mx-auto mb-3 h-1 w-6 rounded-full bg-zinc-800" />
                <span className="mb-1 text-[7px] font-black uppercase tracking-[0.3em] text-[#C6A15A]">
                  The Pathway
                </span>
                <h4 className="mb-2 text-sm font-black text-zinc-100 md:text-base">
                  Spiritual Growth
                </h4>

                <div className="space-y-2.5">
                  {["Seeker", "New Believer", "Foundation", "Serve", "Leader"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div
                        className={`h-1 w-1 rounded-full ${
                          i === 0 ? "bg-[#C6A15A]" : "bg-zinc-700"
                        }`}
                      />
                      <span
                        className={`text-[8px] uppercase tracking-widest ${
                          i === 0 ? "text-white" : "text-zinc-600"
                        }`}
                      >
                        {i + 1}. {step}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-3 border-t border-zinc-800">
                  <div className="flex h-7 w-full items-center justify-center rounded-md bg-[#C6A15A]">
                    <span className="text-[7px] font-black uppercase tracking-tighter text-black">
                      Enroll Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="text-left">
          <div className="mb-4 flex flex-wrap gap-2.5 sm:mb-5">
            <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-2.5 py-1">
              <Globe size={12} className="text-[#C6A15A]" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                Available Globally
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-2.5 py-1">
              <Users size={12} className="text-[#C6A15A]" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                Physical & Online
              </span>
            </div>
          </div>

          <h2 className="mb-4 text-3xl font-serif font-black italic leading-tight sm:text-4xl lg:text-5xl">
            A Journey Led <br />
            <span className="text-[#C6A15A]">By Christ.</span>
          </h2>

          <p className="mb-5 max-w-xl text-base font-light leading-relaxed text-zinc-400 sm:text-lg">
            Whether you are unsaved and seeking, a new believer, or looking to deepen your walk,
            our doors are open. We bring Christ to people through intentional mentorship-accessible
            anywhere in the world.
          </p>

          <ul className="mb-6 grid grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2">
            {[
              "Personalized Mentorship",
              "Christ-Centered Growth",
              "Global Online Access",
              "Physical Community",
              "For Every Soul",
              "Milestone Tracking",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="shrink-0 text-[#C6A15A]" size={15} />
                <span className="text-[13px] font-medium text-zinc-300">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/discipleship"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-6 py-3 text-black transition-all hover:bg-[#C6A15A] active:scale-[0.98]"
          >
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em]">
              Start Your Journey
            </span>
            <ArrowRight
              size={15}
              className="relative z-10 transition-transform group-hover:translate-x-1"
            />
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-black/5 to-transparent group-hover:animate-[shimmer_2s_infinite]" />
          </Link>
        </div>
      </div>
    </section>
  );
}