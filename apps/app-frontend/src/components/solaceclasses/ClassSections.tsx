// components/solaceclasses/ClassSections.tsx
"use client";

import { CheckCircle2 } from "lucide-react";
import type { SolaceClass } from "@/src/lib/solaceClasses";

export default function ClassSections({ data }: { data: SolaceClass }) {
  return (
    <>
      {/* HERO */}
      <section
        className="pt-8 pb-8 text-white"
        style={{
          background: `linear-gradient(135deg, ${data.theme.primary}, ${data.theme.secondary})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-black">
            {data.title}
          </h1>

          <p className="mt-4 text-xl max-w-3xl">
            {data.subtitle}
          </p>

          <div className="mt-6 inline-block bg-white text-black px-5 py-2 rounded-full text-xs font-bold">
            {data.age}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-12 bg-white"> 
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-lg text-gray-900 leading-relaxed"> 
            {data.intro}
          </p>
        </div>
      </section>

      {/* WHY */}
      <section className="py-14 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          {data.why.map((item) => (
            <div key={item} className="bg-white p-5 rounded-xl text-gray-800 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {data.pillars.map((p, i) => (
            <div key={p.title} className="p-6 border border-gray-200 rounded-2xl">
              <div className="text-sm text-gray-500">0{i + 1}</div>
              <h3 className="text-xl font-bold text-gray-900">{p.title}</h3> 
              <p className="mt-2 text-gray-700">{p.description}</p> 
            </div>
          ))}
        </div>
      </section>

      {/* GAINS */}
      <section className="py-14 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-4">
          {data.gains.map((g) => (
            <div key={g} className="flex gap-3">
              <CheckCircle2 className="text-[#E0BE53]" />
              <p>{g}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <section className="py-16 text-center">
        <p className="text-3xl font-black">
          “{data.question}”
        </p>
        <p className="mt-4 text-gray-600">
          {data.answer}
        </p>
      </section>
    </>
  );
}