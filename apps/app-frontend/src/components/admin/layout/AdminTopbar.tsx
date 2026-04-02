"use client";

import { Menu } from "lucide-react";

type Props = {
  onMenuClick: () => void;
};

export default function AdminTopbar({ onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-[#f6f1e7]/90 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4 lg:px-6">
        <button className="lg:hidden rounded-xl border border-gray-200 bg-white p-2" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">SOLACE Admin</p>
        </div>
        <div className="text-sm font-medium text-gray-600">Secure Panel</div>
      </div>
    </header>
  );
}