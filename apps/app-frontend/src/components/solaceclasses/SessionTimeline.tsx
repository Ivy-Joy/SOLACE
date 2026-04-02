// Timeline layout for sundays
// apps/app-frontend/src/components/solaceSunday/SessionTimeline.tsx
"use client";
import React from "react";
import type { MonthlySeries } from "@/src/types/solaceclasses";
import SessionCard from "./SessionCard";

export default function SessionTimeline({ series }: { series: MonthlySeries[] }) {
  return (
    <div className="space-y-8">
      {series.map((s) => (
        <div key={s.month}>
          <h3 className="text-2xl font-serif font-black mb-4">{s.month}</h3>
          <div className="space-y-6">
            {s.sessions.map((sess) => (
              <div key={sess.id} className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#F9F7F2] flex items-center justify-center text-[#1a1a1b] font-black">
                    {new Date(sess.date).getDate()}
                  </div>
                  <div className="h-full w-px bg-gray-200 mt-2" />
                </div>
                <SessionCard session={sess} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}