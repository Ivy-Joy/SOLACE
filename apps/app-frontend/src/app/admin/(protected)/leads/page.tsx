//review, approve/reject, add notes
// apps/app-frontend/src/app/admin/(protected)/leads/page.tsx
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
import { HeartHandshake, Clock3, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import type { LeadRow, PagedResponse } from "@/src/lib/adminTypes";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<LeadRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const limit = 12;

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<PagedResponse<LeadRow>>("/admin/leads");
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
  }, [search, statusFilter, classFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const submitted = items.filter((i) => i.status === "submitted").length;
    const approved = items.filter((i) => i.status === "approved").length;
    const rejected = items.filter((i) => i.status === "rejected").length;
    const inReview = items.filter((i) => !["approved", "rejected", "submitted"].includes(i.status)).length;
    const pendingConsent = items.filter((i) => i.status === "submitted" && !i.spiritualStage).length;
    return { total, submitted, approved, rejected, inReview, pendingConsent };
  }, [items]);

  const filtered = useMemo(() => {
    let rows = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((row) => {
        return (
          row.fullName.toLowerCase().includes(q) ||
          (row.phone ?? "").toLowerCase().includes(q) ||
          (row.email ?? "").toLowerCase().includes(q) ||
          (row.preferredClass ?? "").toLowerCase().includes(q) ||
          (row.spiritualStage ?? "").toLowerCase().includes(q) ||
          row.status.toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter !== "all") rows = rows.filter((row) => row.status === statusFilter);
    if (classFilter !== "all") rows = rows.filter((row) => row.preferredClass === classFilter);

    return rows;
  }, [classFilter, items, search, statusFilter]);

  const total = filtered.length;
  const pageItems = filtered.slice((page - 1) * limit, page * limit);

  return (
    <AdminModuleLayout
      title="Leads"
      description="Screen, approve, reject, and manage lead notes from one place."
      backHref="/admin/dashboard"
      backLabel="Dashboard"
      primaryAction={{ label: "Refresh", href: "/admin/leads" }}
      secondaryAction={{ label: "Open funnel", href: "/admin/funnel" }}
      tabs={[
        { label: "All", href: "/admin/leads" },
        { label: "Submitted", href: "/admin/leads?status=submitted" },
        { label: "Approved", href: "/admin/leads?status=approved" },
        { label: "Rejected", href: "/admin/leads?status=rejected" },
      ]}
    >
      <AdminStatsGrid
        columns="md:grid-cols-2 xl:grid-cols-6"
        items={[
          { label: "Total leads", value: stats.total, icon: <HeartHandshake size={18} /> },
          { label: "Submitted", value: stats.submitted, icon: <Clock3 size={18} /> },
          { label: "In review", value: stats.inReview, icon: <ShieldCheck size={18} /> },
          { label: "Approved", value: stats.approved, icon: <CheckCircle2 size={18} /> },
          { label: "Rejected", value: stats.rejected, icon: <XCircle size={18} /> },
          { label: "Needs consent", value: stats.pendingConsent, icon: <ShieldCheck size={18} /> },
        ]}
      />

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
          <SearchInput value={search} onChange={setSearch} placeholder="Search name, phone, email, stage..." />

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
            <option value="submitted">Submitted</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </section>

      {loading ? (
        <LoadingState label="Loading leads..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No leads found" description="Try a different search or filter." />
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.22em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Open</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{row.fullName}</div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      <div>{row.phone ?? "—"}</div>
                      <div className="mt-1">{row.email ?? "—"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold uppercase text-slate-900">{row.preferredClass ?? "unassigned"}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{row.spiritualStage ?? "—"}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/leads/${row.id}`}
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