//apps/app-frontend/src/components/admin/events/DashboardPanels.tsx
"use client";

import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, Ticket, Users, Mail, ListTodo, BadgeCheck } from "lucide-react";

type DashboardPanelsProps = {
  stats?: {
    totalEvents?: number;
    publishedEvents?: number;
    draftEvents?: number;
    upcomingEvents?: number;
    totalRegistrations?: number;
    waitlistCount?: number;
  };
};

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
        <div className="rounded-2xl bg-slate-900 p-3 text-white">{icon}</div>
      </div>
    </div>
  );
}

export default function DashboardPanels({ stats }: DashboardPanelsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total events" value={stats?.totalEvents ?? "—"} icon={<CalendarDays size={18} />} />
        <StatCard label="Published" value={stats?.publishedEvents ?? "—"} icon={<CheckCircle2 size={18} />} />
        <StatCard label="Drafts" value={stats?.draftEvents ?? "—"} icon={<Clock3 size={18} />} />
        <StatCard label="Upcoming" value={stats?.upcomingEvents ?? "—"} icon={<BadgeCheck size={18} />} />
        <StatCard
          label="Registrations"
          value={stats?.totalRegistrations ?? "—"}
          icon={<Users size={18} />}
        />
        <StatCard label="Waitlist" value={stats?.waitlistCount ?? "—"} icon={<ListTodo size={18} />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <Link
          href="/admin/events/new"
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <CalendarDays size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-900">Create event</div>
              <div className="text-sm text-slate-600">Add a new event and publish it.</div>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/events"
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <Ticket size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-900">Tickets</div>
              <div className="text-sm text-slate-600">Edit ticket rules and capacity.</div>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/events"
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <Mail size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-900">Bulk email</div>
              <div className="text-sm text-slate-600">Message attendees and registrants.</div>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/events"
          className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <ListTodo size={18} />
            </div>
            <div>
              <div className="font-bold text-slate-900">Waitlist</div>
              <div className="text-sm text-slate-600">Promote or manage waitlisted people.</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}