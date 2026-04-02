//apps/app-frontend
"use client";

import Link from "next/link";
import LogoSymbol from "./LogoSymbol";

export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Symbol is now smaller by default to save space */}
      <div className="shrink-0 transition-transform duration-500 group-hover:rotate-[15deg]">
        <LogoSymbol size={size} />
      </div>

      {/* Reduced padding and tighter tracking */}
      <div className="flex flex-col justify-center border-l border-white/20 pl-2.5">
        <div
          className="text-white font-black italic text-lg md:text-xl tracking-[0.15em] leading-none"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          S.O.L.A.C.E
        </div>

        <div className="text-[8px] uppercase tracking-[0.2em] font-medium text-[#E0BE53]/80 whitespace-nowrap mt-1">
          Serving Our Lord <span className="text-white/20">&</span> Christ Everyday
        </div>
      </div>
    </Link>
  );
}