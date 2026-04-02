"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const items = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/prayers", label: "Prayers" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/audit", label: "Audit" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-gray-200 bg-white px-5 py-6 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">SOLACE</p>
            <h2 className="mt-1 text-xl font-black">Admin</h2>
          </div>
          <button className="lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active ? "bg-[var(--gs-dark)] text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={onClose}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />
      ) : null}
    </>
  );
}