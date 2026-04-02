//apps/app-frontend/src/app/admin/(protected)/prayers/page.tsx
//list, answerm hide, esclate, unhide
// app/admin/(protected)/prayers/page.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/api";
import type { PrayerRow, PagedResponse } from "@/src/lib/adminTypes";

import AdminPageHeader from "@/src/components/admin/layout/AdminPageHeader";
import SearchInput from "@/src/components/admin/shared/SearchInput";
import Pagination from "@/src/components/admin/shared/Pagination";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";
import EmptyState from "@/src/components/admin/shared/EmptyState";
import LoadingState from "@/src/components/admin/shared/LoadingState";

type PrayerResponse = PagedResponse<PrayerRow>;

export default function AdminPrayersPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [data, setData] = useState<PrayerResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (query) params.set("q", query);
      if (status) params.set("status", status);

      const res = await api.get<PrayerResponse>(`/admin/prayers?${params}`);
      setData(res);
    } catch {
      router.replace("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [page, limit, query, status, router]); // These triggers loadList to update correctly

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      router.replace("/admin/login");
      return;
    }
    void loadList();
  }, [loadList, router]);

  useEffect(() => {
    if (page === 1) {
      void loadList();
    } else {
      setPage(1);
    }
  }, [query, page, loadList]);

  const rows = useMemo(() => data?.items ?? [], [data]);

  const resolveStatus = (p: PrayerRow) => {
    if (p.answered) return "answered";
    if (p.hidden) return "hidden";
    if (p.escalated) return "escalated";
    return "open";
  };

  return (
    <div>
      <AdminPageHeader
        title="Prayer Moderation"
        description="Review, answer, hide, and escalate prayer requests."
      />

      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px]">
        <SearchInput value={query} onChange={setQuery} placeholder="Search prayers..." />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-2xl border border-gray-200 px-4 py-3 text-sm"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="answered">Answered</option>
          <option value="hidden">Hidden</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>

      {loading && !data ? (
        <LoadingState label="Loading prayers..." />
      ) : rows.length === 0 ? (
        <EmptyState title="No prayer requests found" />
      ) : (
        <div className="rounded-[28px] border bg-white shadow-sm overflow-hidden">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b text-xs uppercase text-gray-500">
                <th className="px-5 py-4">Prayer</th>
                <th>Status</th>
                <th>Count</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className="cursor-pointer hover:bg-gray-50 border-b"
                  onClick={() => router.push(`/admin/prayers/${p.id}`)}
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold">{p.title || "Prayer request"}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{p.excerpt}</div>
                  </td>

                  <td>
                    <StatusBadge status={resolveStatus(p)} />
                  </td>

                  <td>{p.prayersCount}</td>
                  <td>{p.createdAt ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && (
        <div className="mt-5">
          <Pagination page={page} limit={limit} total={data.total ?? 0} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}