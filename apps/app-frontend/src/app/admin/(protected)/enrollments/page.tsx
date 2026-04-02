// apps/app-frontend/src/app/admin/(protected)/enrollments/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/src/lib/api";
import AdminModuleLayout from "@/src/components/admin/shared/AdminModuleLayout";
import EmptyState from "@/src/components/admin/shared/EmptyState";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import Pagination from "@/src/components/admin/shared/Pagination";
import SearchInput from "@/src/components/admin/shared/SearchInput";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";
import { Users, CheckCircle2, XCircle, Clock3, Filter, Eye, ShieldCheck } from "lucide-react";

type EnrollmentStatus = "approved" | "rejected" | "waitlisted" | "pending" | string;
type VisibilityScope = "private" | "class" | "leaders" | string;

type EnrollmentRow = {
  id: string;
  memberId: string;
  classKey: string;
  cohortType: string | null;
  cohortDate: string | null;
  status: EnrollmentStatus;
  decisionReason: string | null;
  ageAtApplication: number | null;
  profileLocked: boolean;
  visibilityScope: VisibilityScope;
  appliedAt: string | null;
  reviewedAt: string | null;
  parentConsentRequired: boolean;
  parentConsentGiven: boolean;
};

type PagedResponse = {
  items: EnrollmentRow[];
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
  const [items, setItems] = useState<EnrollmentRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EnrollmentStatus>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const [reviewModal, setReviewModal] = useState<{
    id: string;
    status: "approved" | "rejected" | "waitlisted";
    decisionReason: string;
    visibilityScope: VisibilityScope;
  } | null>(null);

  const limit = 12;

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<PagedResponse>("/admin/enrollments");
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
    const approved = items.filter((i) => i.status === "approved").length;
    const rejected = items.filter((i) => i.status === "rejected").length;
    const waitlisted = items.filter((i) => i.status === "waitlisted").length;
    const pending = items.filter((i) => i.status === "pending").length;
    const consentPending = items.filter((i) => i.parentConsentRequired && !i.parentConsentGiven).length;

    return { total, approved, rejected, waitlisted, pending, consentPending };
  }, [items]);

  const filtered = useMemo(() => {
    let rows = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((row) => {
        return (
          row.id.toLowerCase().includes(q) ||
          row.memberId.toLowerCase().includes(q) ||
          row.classKey.toLowerCase().includes(q) ||
          (row.cohortType ?? "").toLowerCase().includes(q) ||
          (row.decisionReason ?? "").toLowerCase().includes(q) ||
          (row.visibilityScope ?? "").toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter !== "all") rows = rows.filter((row) => row.status === statusFilter);
    if (classFilter !== "all") rows = rows.filter((row) => row.classKey === classFilter);

    return rows;
  }, [classFilter, items, search, statusFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pageItems = filtered.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, classFilter]);

  async function submitReview() {
    if (!reviewModal) return;
    setReviewingId(reviewModal.id);
    try {
      await api.patch(`/admin/enrollments/${reviewModal.id}/review`, {
        status: reviewModal.status,
        decisionReason: reviewModal.decisionReason,
        visibilityScope: reviewModal.visibilityScope,
      });
      setReviewModal(null);
      await load();
    } finally {
      setReviewingId(null);
    }
  }

  return (
    <AdminModuleLayout
      title="Class enrollments"
      description="Review applications, approvals, consent state, and visibility controls."
      backHref="/admin/dashboard"
      backLabel="Dashboard"
      primaryAction={{ label: "Refresh", href: "/admin/enrollments" }}
      secondaryAction={{ label: "Open funnel", href: "/admin/funnel" }}
      tabs={[
        { label: "All", href: "/admin/enrollments" },
        { label: "Approved", href: "/admin/enrollments?status=approved" },
        { label: "Waitlisted", href: "/admin/enrollments?status=waitlisted" },
        { label: "Pending", href: "/admin/enrollments?status=pending" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total" value={stats.total} icon={<Users size={18} />} />
        <StatCard label="Approved" value={stats.approved} icon={<CheckCircle2 size={18} />} />
        <StatCard label="Rejected" value={stats.rejected} icon={<XCircle size={18} />} />
        <StatCard label="Waitlisted" value={stats.waitlisted} icon={<Clock3 size={18} />} />
        <StatCard label="Pending" value={stats.pending} icon={<Filter size={18} />} />
        <StatCard label="Consent pending" value={stats.consentPending} icon={<ShieldCheck size={18} />} />
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
          <SearchInput value={search} onChange={setSearch} placeholder="Search member, class, reason, visibility..." />

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[var(--gs-gold)] focus:ring-2 focus:ring-[rgba(224,190,83,0.2)]"
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
            onChange={(e) => setStatusFilter(e.target.value as EnrollmentStatus | "all")}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[var(--gs-gold)] focus:ring-2 focus:ring-[rgba(224,190,83,0.2)]"
          >
            <option value="all">All statuses</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="waitlisted">Waitlisted</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </section>

      {loading ? (
        <LoadingState label="Loading enrollments..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No enrollments found"
          description="Try a different search or change the filters."
        />
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.22em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Class</th>
                  <th className="px-4 py-3">Consent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applied</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{row.memberId}</div>
                      <div className="text-xs text-slate-500">
                        Cohort: {row.cohortType ?? "—"} · Age: {row.ageAtApplication ?? "—"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold uppercase text-slate-900">{row.classKey}</div>
                      <div className="text-xs text-slate-500">Visibility: {row.visibilityScope}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1 text-xs text-slate-600">
                        <div>Required: {row.parentConsentRequired ? "Yes" : "No"}</div>
                        <div>Given: {row.parentConsentGiven ? "Yes" : "No"}</div>
                        <div>Locked: {row.profileLocked ? "Yes" : "No"}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {row.appliedAt ? new Date(row.appliedAt).toLocaleString() : "—"}
                      <div className="mt-1">Reviewed: {row.reviewedAt ? new Date(row.reviewedAt).toLocaleString() : "—"}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setReviewModal({
                              id: row.id,
                              status: "approved",
                              decisionReason: row.decisionReason ?? "",
                              visibilityScope: row.visibilityScope ?? "class",
                            })
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                        >
                          Review
                        </button>
                      </div>
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

      {reviewModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Review enrollment
                </div>
                <h3 className="mt-1 text-xl font-bold text-slate-900">Update decision</h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModal(null)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Decision</div>
                <select
                  value={reviewModal.status}
                  onChange={(e) =>
                    setReviewModal({ ...reviewModal, status: e.target.value as "approved" | "rejected" | "waitlisted" })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="waitlisted">Waitlisted</option>
                </select>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Visibility scope</div>
                <select
                  value={reviewModal.visibilityScope}
                  onChange={(e) =>
                    setReviewModal({ ...reviewModal, visibilityScope: e.target.value as VisibilityScope })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  <option value="private">Private</option>
                  <option value="class">Class</option>
                  <option value="leaders">Leaders</option>
                </select>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Decision reason</div>
                <textarea
                  value={reviewModal.decisionReason}
                  onChange={(e) => setReviewModal({ ...reviewModal, decisionReason: e.target.value })}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                  placeholder="Explain the decision..."
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewModal(null)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submitReview()}
                disabled={reviewingId === reviewModal.id}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {reviewingId === reviewModal.id ? "Saving..." : "Save review"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminModuleLayout>
  );
}