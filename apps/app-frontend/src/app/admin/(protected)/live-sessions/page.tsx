// apps/app-frontend/src/app/admin/(protected)/live-sessions/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/src/lib/api";
import AdminModuleLayout from "@/src/components/admin/shared/AdminModuleLayout";
import EmptyState from "@/src/components/admin/shared/EmptyState";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import SearchInput from "@/src/components/admin/shared/SearchInput";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";
import { CalendarDays, Video, MessageSquare, ShieldCheck, Users, Filter } from "lucide-react";

type LiveSessionRow = {
  id: string;
  title: string;
  classKey: string | null;
  adultOnly: boolean;
  status: string | null;
  startsAt: string | null;
  endsAt: string | null;
  allowChat: boolean;
  meetingUrl: string | null;
};

type PagedResponse = {
  items: LiveSessionRow[];
};

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
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

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<LiveSessionRow[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<PagedResponse>("/admin/live-sessions");
      setItems(res.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const live = items.filter((i) => i.status === "live").length;
    const scheduled = items.filter((i) => i.status === "scheduled").length;
    const adultOnly = items.filter((i) => i.adultOnly).length;
    const chatOn = items.filter((i) => i.allowChat).length;
    return { total, live, scheduled, adultOnly, chatOn };
  }, [items]);

  const filtered = useMemo(() => {
    let rows = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((row) => {
        return (
          row.title.toLowerCase().includes(q) ||
          (row.classKey ?? "").toLowerCase().includes(q) ||
          (row.status ?? "").toLowerCase().includes(q) ||
          (row.meetingUrl ?? "").toLowerCase().includes(q)
        );
      });
    }

    if (classFilter !== "all") rows = rows.filter((row) => row.classKey === classFilter);
    if (statusFilter !== "all") rows = rows.filter((row) => row.status === statusFilter);

    return rows;
  }, [classFilter, items, search, statusFilter]);

  return (
    <AdminModuleLayout
      title="Live sessions"
      description="Track scheduled sessions, live status, adult-only enforcement, and chat permissions."
      backHref="/admin/dashboard"
      backLabel="Dashboard"
      primaryAction={{ label: "Refresh", href: "/admin/live-sessions" }}
      secondaryAction={{ label: "Policies", href: "/admin/policies" }}
      tabs={[
        { label: "All", href: "/admin/live-sessions" },
        { label: "Live", href: "/admin/live-sessions?status=live" },
        { label: "Scheduled", href: "/admin/live-sessions?status=scheduled" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total sessions" value={stats.total} icon={<Video size={18} />} />
        <StatCard label="Live" value={stats.live} icon={<CalendarDays size={18} />} />
        <StatCard label="Scheduled" value={stats.scheduled} icon={<Users size={18} />} />
        <StatCard label="Adult-only" value={stats.adultOnly} icon={<ShieldCheck size={18} />} />
        <StatCard label="Chat enabled" value={stats.chatOn} icon={<MessageSquare size={18} />} />
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
          <SearchInput value={search} onChange={setSearch} placeholder="Search title, class, status, meeting URL..." />

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none"
          >
            <option value="all">All classes</option>
            <option value="vuka">VUKA</option>
            <option value="ropes">ROPEs</option>
            <option value="teens">TEENS</option>
            <option value="mph">MPH</option>
            <option value="young">YOUNG</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none"
          >
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="ended">Ended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </section>

      {loading ? (
        <LoadingState label="Loading live sessions..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No sessions found"
          description="Try a different search term or filter."
        />
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.22em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3">Settings</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((session) => (
                  <tr key={session.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{session.title}</div>
                      <div className="text-xs text-slate-500 break-all">
                        {session.meetingUrl ?? "No meeting URL"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold uppercase text-slate-900">{session.classKey ?? "—"}</div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      <div>Starts: {session.startsAt ? new Date(session.startsAt).toLocaleString() : "—"}</div>
                      <div className="mt-1">Ends: {session.endsAt ? new Date(session.endsAt).toLocaleString() : "—"}</div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600">
                      <div>Adult-only: {session.adultOnly ? "Yes" : "No"}</div>
                      <div className="mt-1">Chat: {session.allowChat ? "On" : "Off"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={session.status ?? "unknown"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminModuleLayout>
  );
}