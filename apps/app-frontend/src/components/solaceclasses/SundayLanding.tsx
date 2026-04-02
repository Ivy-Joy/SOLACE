//Landing grid that shows series banners and class cards
// src/components/solaceclasses/SundayLanding.tsx
// src/components/solaceclasses/SundayLanding.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import type { ClassOverview } from "@/src/types/solaceclasses";

export default function SundayLanding() {
  const [list, setList] = useState<ClassOverview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/solaceclasses");
        const data = await res.json();
        setList(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#C6A15A] text-[10px] uppercase tracking-[0.5em] font-black">
            Solace Classes
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-serif font-black italic text-zinc-950">
            Faith formation for every age stage.
          </h2>
          <p className="mt-4 text-sm md:text-base text-zinc-600">
            Explore each class to see the journey, purpose, and growth path designed for every group.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 bg-zinc-100 rounded-[2rem] animate-pulse" />
              ))
            : list.map((c) => (
                <motion.div
                  key={c.key}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-[2rem] border border-zinc-100 bg-[#FAFAFA] p-6 min-h-[300px] flex flex-col justify-between"
                >
                  <div className="absolute inset-0 opacity-10">
                    {c.image && (
                      <Image
                        src={c.image}
                        alt={c.label}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm text-[#C6A15A]">
                      <Users size={17} />
                    </div>

                    <h3 className="mt-5 text-2xl font-black text-zinc-950 uppercase tracking-tight">
                      {c.label}
                    </h3>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#C6A15A]">
                      {c.age}
                    </p>
                  </div>

                  <div className="relative z-10">
                    <Link
                      href={`/solaceclasses/${c.key}`}
                      className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.25em] text-zinc-950 border-b border-[#C6A15A]/40 pb-1"
                    >
                      Explore Class
                    </Link>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}