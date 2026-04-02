//classCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Users, Target } from "lucide-react";
import type { ClassOverview } from "@/src/types/solaceclasses";

export default function ClassCard({ data }: { data: ClassOverview }) {
  return (
    <article className="group relative bg-[#F9F7F2] border border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition overflow-hidden">
      <div className="absolute inset-0 opacity-20 group-hover:opacity-40">
        <Image
          src={data.image || "/images/placeholder.jpg"} // Fallback for optional image
          alt={data.label}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition"
        />
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gold mb-6">
          <Users size={20} />
        </div>

        <h3 className="text-2xl font-black">{data.label}</h3>
        <p className="text-gold text-xs uppercase font-bold tracking-widest mb-6">
          {data.age}
        </p>

        <div className="space-y-3">
          {/* data.focus is now recognized */}
          {data.focus.map((f: string) => (
            <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
              <Target size={14} />
              {f}
            </div>
          ))}
        </div>

        <Link
          href={`/solaceclasses/${data.key}`}
          className="inline-flex items-center gap-2 mt-8 text-xs uppercase font-black tracking-widest"
        >
          Explore {data.label}
          <ChevronRight size={12} />
        </Link>
      </div>
    </article>
  );
}