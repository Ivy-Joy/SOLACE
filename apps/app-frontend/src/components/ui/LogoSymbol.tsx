// apps/app-frontend/src/components/ui/LogoSymbol.tsx
"use client";

export default function LogoSymbol({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_8px_rgba(224,190,83,0.2)]"
    >
      <defs>
        <linearGradient id="premium-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F6E7B8" />
          <stop offset="45%" stopColor="#E0BE53" />
          <stop offset="55%" stopColor="#E0BE53" />
          <stop offset="100%" stopColor="#8E702A" />
        </linearGradient>
      </defs>

      {/* Outer Halo - Thin & Elegant */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="url(#premium-gold)"
        strokeWidth="1.5"
        strokeDasharray="1 4" // Subtle cinematic texture
        opacity="0.4"
      />
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="url(#premium-gold)"
        strokeWidth="0.5"
        opacity="0.2"
      />

      {/* The Compass Cross - Tapered for a "Sword/Needle" feel */}
      <g filter="url(#glow)">
        {/* Vertical Axis */}
        <path
          d="M50 15L53 50L50 85L47 50L50 15Z"
          fill="url(#premium-gold)"
        />
        {/* Horizontal Axis */}
        <path
          d="M20 48L50 45L80 48L50 51L20 48Z"
          fill="url(#premium-gold)"
        />
      </g>

      {/* The Central Spark (Flame/Seed) */}
      <circle cx="50" cy="48" r="4" fill="white" className="animate-pulse" />
      <path
        d="M50 42C50 42 56 48 50 58C44 48 50 42 50 42Z"
        fill="url(#premium-gold)"
      />

      {/* Orbital Shield Arc */}
      <path
        d="M25 25C35 15 65 15 75 25"
        stroke="url(#premium-gold)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}