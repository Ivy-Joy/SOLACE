// apps/app-frontend/src/app/admin/(protected)/funnel/page.tsx
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
import { BookOpen, UserCheck, PauseCircle, PlayCircle, Flag, Milestone } from "lucide-react";
import type { JourneyRow, PagedResponse } from "@/src/lib/adminTypes";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<JourneyRow[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const limit = 12;

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<PagedResponse<JourneyRow>>("/admin/funnel");
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
  }, [search, stageFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const seeker = items.filter((i) => i.stage === "seeker").length;
    const newcomer = items.filter((i) => i.stage === "newcomer").length;
    const believer = items.filter((i) => i.stage === "believer").length;
    const foundation = items.filter((i) => i.stage === "foundation").length;
    const serve = items.filter((i) => i.stage === "serve").length;
    const leader = items.filter((i) => i.stage === "leader").length;
    const paused = items.filter((i) => i.stage === "paused").length;

    return { total, seeker, newcomer, believer, foundation, serve, leader, paused };
  }, [items]);

  const filtered = useMemo(() => {
    let rows = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((row) => {
        return (
          row.memberId.toLowerCase().includes(q) ||
          row.stage.toLowerCase().includes(q) ||
          (row.nextStep ?? "").toLowerCase().includes(q) ||
          (row.lastMilestone ?? "").toLowerCase().includes(q)
        );
      });
    }

    if (stageFilter !== "all") rows = rows.filter((row) => row.stage === stageFilter);

    return rows;
  }, [items, search, stageFilter]);

  const total = filtered.length;
  const pageItems = filtered.slice((page - 1) * limit, page * limit);

  return (
    <AdminModuleLayout
      title="Discipleship funnel"
      description="Track where each member sits in the journey and what the next step should be."
      backHref="/admin/dashboard"
      backLabel="Dashboard"
      primaryAction={{ label: "Refresh", href: "/admin/funnel" }}
      secondaryAction={{ label: "Counselling", href: "/admin/counselling" }}
      tabs={[
        { label: "All", href: "/admin/funnel" },
        { label: "Seeker", href: "/admin/funnel?stage=seeker" },
        { label: "Foundation", href: "/admin/funnel?stage=foundation" },
        { label: "Leader", href: "/admin/funnel?stage=leader" },
      ]}
    >
      <AdminStatsGrid
        columns="md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7"
        items={[
          { label: "Total", value: stats.total, icon: <BookOpen size={18} /> },
          { label: "Seeker", value: stats.seeker, icon: <PlayCircle size={18} /> },
          { label: "Newcomer", value: stats.newcomer, icon: <UserCheck size={18} /> },
          { label: "Believer", value: stats.believer, icon: <Flag size={18} /> },
          { label: "Foundation", value: stats.foundation, icon: <Milestone size={18} /> },
          { label: "Serve", value: stats.serve, icon: <UserCheck size={18} /> },
          { label: "Paused", value: stats.paused, icon: <PauseCircle size={18} /> },
        ]}
      />

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr]">
          <SearchInput value={search} onChange={setSearch} placeholder="Search member, stage, next step, milestone..." />

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none"
          >
            <option value="all">All stages</option>
            <option value="seeker">Seeker</option>
            <option value="newcomer">Newcomer</option>
            <option value="believer">Believer</option>
            <option value="foundation">Foundation</option>
            <option value="serve">Serve</option>
            <option value="leader">Leader</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </section>

      {loading ? (
        <LoadingState label="Loading funnel..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No journeys found" description="Try a different search or change the stage filter." />
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.22em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Next step</th>
                  <th className="px-4 py-3">Milestone</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Open</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{row.memberId}</div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={row.stage} />
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{row.progressScore}</td>
                    <td className="px-4 py-4 text-slate-700">{row.nextStep ?? "—"}</td>
                    <td className="px-4 py-4 text-slate-700">{row.lastMilestone ?? "—"}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {row.updatedAt ? new Date(row.updatedAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/funnel/${row.memberId}`}
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