"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { solaceClasses } from "@/src/lib/solaceClasses";

export default function ClassesGrid() {
  const list = Object.values(solaceClasses);

  return (
    <section className="pb-20">
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((c) => (
          <motion.div
            key={c.key}
            whileHover={{ y: -6 }}
            className="group relative rounded-4xl overflow-hidden border border-zinc-100 bg-white"
          >
            {/* IMAGE */}
            <div className="relative h-40 w-full overflow-hidden">
              {c.cardImage && (
                <Image
                  src={c.cardImage}
                  alt={c.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>

            {/* ACCENT BAR */}
            <div
              className="h-1 w-full"
              style={{ background: c.theme.primary }}
            />

            <div className="p-6 flex flex-col justify-between min-h-50">
              <div>
                <h3 className="text-xl font-black text-zinc-950">
                  {c.title}
                </h3>

                <p className="text-[10px] uppercase tracking-[0.3em] text-[#C6A15A] mt-2">
                  {c.age}
                </p>

                <p className="mt-3 text-sm text-zinc-600 line-clamp-3">
                  {c.subtitle}
                </p>
              </div>

              <Link
                href={`/solaceclasses/${c.key}`}
                className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-900 border-b border-[#C6A15A]/40 pb-1 hover:text-[#C6A15A] transition"
              >
                Explore Class
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}