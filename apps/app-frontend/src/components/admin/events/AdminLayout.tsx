//apps/app-frontend/src/components/admin/events/AdminLayout.tsx
"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  BadgeCheck,
  Ticket,
  ListTodo,
  Users,
  PencilLine,
} from "lucide-react";

type AdminLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
  eventId?: string;
};

export default function AdminLayout({
  title,
  description,
  children,
  eventId,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const base = eventId ? `/admin/events/${eventId}` : "/admin/events";

  const tabs = eventId
    ? [
        { label: "Overview", href: `${base}`, icon: <CalendarDays size={16} /> },
        { label: "Registrations", href: `${base}/registrations`, icon: <Users size={16} /> },
        { label: "Tickets", href: `${base}/tickets`, icon: <Ticket size={16} /> },
        { label: "Check-in", href: `${base}/check-in`, icon: <BadgeCheck size={16} /> },
        { label: "Bulk Email", href: `${base}/bulk-email`, icon: <Mail size={16} /> },
        { label: "Waitlist", href: `${base}/waitlist`, icon: <ListTodo size={16} /> },
      ]
    : [
        { label: "Events", href: "/admin/events", icon: <CalendarDays size={16} /> },
        { label: "New Event", href: "/admin/events/new", icon: <PencilLine size={16} /> },
      ];

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1 font-semibold hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Dashboard
              </Link>
              <span>/</span>
              <span>Events</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/events"
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              All events
            </Link>
            <Link
              href="/admin/events/new"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Create event
            </Link>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}