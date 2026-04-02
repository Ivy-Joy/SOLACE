//apps/app-frontend/src/app/admin/members/page.tsx
//list/search/filter members
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/api";
import type { MemberDetail, MemberRow, PagedResponse } from "@/src/lib/adminTypes";
import AdminPageHeader from "@/src/components/admin/layout/AdminPageHeader";
import SearchInput from "@/src/components/admin/shared/SearchInput";
import Pagination from "@/src/components/admin/shared/Pagination";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";
import EmptyState from "@/src/components/admin/shared/EmptyState";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import MemberDrawer from "@/src/components/admin/members/MemberDrawer";

type MembersResponse = PagedResponse<MemberRow>;

export default function AdminMembersPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [data, setData] = useState<MembersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MemberDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [answering, setAnswering] = useState(false);

  async function loadList() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (query) params.set("q", query);
      if (status) params.set("status", status);

      const res = await api.get<MembersResponse>(`/admin/members?${params.toString()}`);
      setData(res);
    } catch {
      router.replace("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    void loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  useEffect(() => {
    if (page === 1) void loadList();
    else setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function openDetail(id: string) {
    setDrawerOpen(true);
    const res = await api.get<MemberDetail>(`/admin/members/${id}`);
    setSelected(res);
  }

  async function updateStatus(nextStatus: "pending" | "approved" | "rejected" | "archived") {
    if (!selected) return;
    await api.patch(`/admin/members/${selected.id}/status`, { status: nextStatus });
    await loadList();
    const updated = await api.get<MemberDetail>(`/admin/members/${selected.id}`);
    setSelected(updated);
  }

  async function updateTags(tags: string[]) {
    if (!selected) return;
    await api.patch(`/admin/members/${selected.id}/tags`, { tags });
    const updated = await api.get<MemberDetail>(`/admin/members/${selected.id}`);
    setSelected(updated);
    await loadList();
  }

  const rows = useMemo(() => data?.items ?? [], [data]);

  return (
    <div>
      <AdminPageHeader
        title="Members"
        description="Search, review, approve, archive, and inspect member records."
      />

      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px]">
        <SearchInput value={query} onChange={setQuery} placeholder="Search members by name, phone, email..." />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none"
        >
          <option value="">All status</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="archived">archived</option>
        </select>
      </div>

      {loading && !data ? (
        <LoadingState label="Loading members..." />
      ) : rows.length === 0 ? (
        <EmptyState title="No members found" description="Try another search or filter." />
      ) : (
        <div className="rounded-[28px] bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-[0.2em] text-gray-500">
                  <th className="py-4 px-5">Name</th>
                  <th className="py-4 px-5">Phone</th>
                  <th className="py-4 px-5">Class</th>
                  <th className="py-4 px-5">Verified</th>
                  <th className="py-4 px-5">Consent</th>
                  <th className="py-4 px-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((member) => (
                  <tr
                    key={member.id}
                    className="cursor-pointer border-b border-gray-50 hover:bg-gray-50"
                    onClick={() => void openDetail(member.id)}
                  >
                    <td className="py-4 px-5 font-semibold text-gray-900">{member.fullName}</td>
                    <td className="py-4 px-5 text-sm text-gray-600">{member.phone}</td>
                    <td className="py-4 px-5 text-sm text-gray-600">{member.preferredClass ?? "—"}</td>
                    <td className="py-4 px-5">
                      <StatusBadge status={member.phoneVerified ? "verified" : "unverified"} />
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={member.parentalRequired ? (member.parentalGiven ? "consented" : "pending") : "not_needed"} />
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={member.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data ? (
        <div className="mt-5">
          <Pagination page={page} limit={limit} total={data.total} onPageChange={setPage} />
        </div>
      ) : null}

      <MemberDrawer
        member={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApprove={() => void updateStatus("approved")}
        onReject={() => void updateStatus("rejected")}
        onArchive={() => void updateStatus("archived")}
        onUpdateTags={(tags) => void updateTags(tags)}
      />
    </div>
  );
}