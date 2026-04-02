// apps/app-frontend/src/app/admin/(protected)/counselling/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/src/lib/api";
import AdminModuleLayout from "@/src/components/admin/shared/AdminModuleLayout";
import AdminStatsGrid from "@/src/components/admin/shared/AdminStatsGrid";
import EmptyState from "@/src/components/admin/shared/EmptyState";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import Pagination from "@/src/components/admin/shared/Pagination";
import SearchInput from "@/src/components/admin/shared/SearchInput";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";
import { HeartPulse, AlertTriangle, Clock3, CheckCircle2, ClipboardList } from "lucide-react";
import type { CounsellingRow, PagedResponse } from "@/src/lib/adminTypes";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CounsellingRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const limit = 12;

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<PagedResponse<CounsellingRow>>("/admin/counselling");
      setItems(res.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, urgencyFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const urgent = items.filter((i) => i.urgency === "urgent").length;
    const normal = items.filter((i) => i.urgency === "non_urgent").length;
    const open = items.filter((i) => i.status === "open").length;
    const triaged = items.filter((i) => i.status === "triaged").length;
    const assigned = items.filter((i) => i.status === "assigned").length;
    const resolved = items.filter((i) => i.status === "resolved").length;
    const closed = items.filter((i) => i.status === "closed").length;

    return { total, urgent, normal, open, triaged, assigned, resolved, closed };
  }, [items]);

  const filtered = useMemo(() => {
    let rows = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((row) => {
        return (
          row.memberId.toLowerCase().includes(q) ||
          row.category.toLowerCase().includes(q) ||
          row.summary.toLowerCase().includes(q) ||
          (row.details ?? "").toLowerCase().includes(q) ||
          row.status.toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter !== "all") rows = rows.filter((row) => row.status === statusFilter);
    if (urgencyFilter !== "all") rows = rows.filter((row) => row.urgency === urgencyFilter);

    return rows;
  }, [items, search, statusFilter, urgencyFilter]);

  const total = filtered.length;
  const pageItems = filtered.slice((page - 1) * limit, page * limit);

  return (
    <AdminModuleLayout
      title="Counselling"
      description="Triage urgent cases, track follow-ups, and manage pastoral care."
      backHref="/admin/dashboard"
      backLabel="Dashboard"
      primaryAction={{ label: "Refresh", href: "/admin/counselling" }}
      secondaryAction={{ label: "Policies", href: "/admin/policies" }}
      tabs={[
        { label: "All", href: "/admin/counselling" },
        { label: "Urgent", href: "/admin/counselling?urgency=urgent" },
        { label: "Resolved", href: "/admin/counselling?status=resolved" },
      ]}
    >
      <AdminStatsGrid
        columns="md:grid-cols-2 xl:grid-cols-4"
        items={[
          { label: "Total cases", value: stats.total, icon: <HeartPulse size={18} /> },
          { label: "Urgent", value: stats.urgent, icon: <AlertTriangle size={18} /> },
          { label: "Open", value: stats.open, icon: <ClipboardList size={18} /> },
          { label: "Resolved", value: stats.resolved, icon: <CheckCircle2 size={18} /> },
        ]}
      />

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
          <SearchInput value={search} onChange={setSearch} placeholder="Search member, category, summary, status..." />

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none"
          >
            <option value="all">All urgency</option>
            <option value="urgent">Urgent</option>
            <option value="non_urgent">Normal</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none"
          >
            <option value="all">All statuses</option>
            <option value="triaged">Triaged</option>
            <option value="assigned">Assigned</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </section>

      {loading ? (
        <LoadingState label="Loading counselling cases..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No counselling cases found" description="Try a different search or change the filters." />
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.22em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Summary</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Follow-up</th>
                  <th className="px-4 py-3 text-right">Open</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{row.memberId}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{row.category}</td>
                    <td className="px-4 py-4 max-w-[420px] text-slate-700">
                      <div className="line-clamp-2">{row.summary}</div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={row.urgency} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {row.followUpAt ? new Date(row.followUpAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/counselling/${row.id}`}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 p-4">
            <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
          </div>
        </div>
      )}
    </AdminModuleLayout>
  );
}