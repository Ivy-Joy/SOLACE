//SearchInput.tsx
"use client";

import type { ChangeEvent } from "react";
import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({ value, onChange, placeholder = "Search..." }: Props) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none focus:border-[var(--gs-gold)] focus:ring-2 focus:ring-[rgba(224,190,83,0.2)]"
      />
    </div>
  );
}