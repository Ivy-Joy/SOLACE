// apps/app-frontend/src/components/solaceSunday/SeriesBanner.tsx
"use client";
import React from "react";
import Image from "next/image";
import type { ClassDetailModel } from "@/src/types/solaceclasses";

export default function SeriesBanner({ detail }: { detail: ClassDetailModel }) {
  const current = detail.monthlySeries?.[0];
  return (
    <section className="relative bg-gradient-to-r from-white to-[#FFFBEB] py-12">
      <div className="max-w-7xl mx-auto px-6 flex gap-8 items-center">
        <div className="flex-1">
          <h1 className="text-4xl font-serif font-black mb-2">{detail.label}</h1>
          <p className="text-gray-700 max-w-2xl">{detail.description}</p>
          {current && (
            <div className="mt-6 p-6 rounded-2xl bg-white border shadow-sm">
              <div className="text-xs text-gold font-black uppercase tracking-widest">{current.month}</div>
              <div className="mt-2 font-bold text-lg">{current.sessions[0]?.theme}</div>
              <div className="mt-2 text-sm text-gray-600">{current.sessions[0]?.summary}</div>
            </div>
          )}
        </div>
        <div className="w-56 h-56 relative rounded-2xl overflow-hidden">
          {detail.image && <Image src={detail.image} alt={detail.label} fill className="object-cover" />}
        </div>
      </div>
    </section>
  );
}