"use client";

import type { ReactNode } from "react";

type KVItem = {
  label: string;
  value: ReactNode;
  helper?: string;
};

export default function AdminKeyValueGrid({
  items,
  columns = "md:grid-cols-2",
}: {
  items: KVItem[];
  columns?: string;
}) {
  return (
    <div className={`grid gap-3 ${columns}`}>
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {item.label}
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-900">{item.value}</div>
          {item.helper ? <div className="mt-1 text-xs text-slate-500">{item.helper}</div> : null}
        </div>
      ))}
    </div>
  );
}