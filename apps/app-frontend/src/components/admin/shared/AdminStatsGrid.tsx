"use client";

import type { ReactNode } from "react";

type StatItem = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  note?: string;
};

export default function AdminStatsGrid({
  items,
  columns = "md:grid-cols-2 xl:grid-cols-4",
}: {
  items: StatItem[];
  columns?: string;
}) {
  return (
    <div className={`grid gap-4 ${columns}`}>
      {items.map((item) => (
        <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-slate-500">{item.label}</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{item.value}</div>
              {item.note ? <div className="mt-1 text-xs text-slate-500">{item.note}</div> : null}
            </div>
            {item.icon ? <div className="rounded-2xl bg-slate-900 p-3 text-white">{item.icon}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}