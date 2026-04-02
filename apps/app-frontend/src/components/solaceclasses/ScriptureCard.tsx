// Scripture highlight style
// apps/app-frontend/src/components/solaceSunday/ScriptureCard.tsx
"use client";
import React from "react";

export default function ScriptureCard({ scripture }: { scripture: string }) {
  return (
    <div className="rounded-xl p-4 bg-gradient-to-br from-white to-[#FEF3C7] border shadow-sm">
      <div className="text-xs text-gold font-black uppercase tracking-widest mb-2">Key Verse</div>
      <div className="font-serif italic font-black text-lg">{scripture}</div>
      <div className="text-xs text-gray-600 mt-2">Memorize, reflect, and share.</div>
    </div>
  );
}