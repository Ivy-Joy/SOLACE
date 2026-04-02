"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/src/lib/api";
import AdminModuleLayout from "@/src/components/admin/shared/AdminModuleLayout";
import AdminKeyValueGrid from "@/src/components/admin/shared/AdminKeyValueGrid";
import EmptyState from "@/src/components/admin/shared/EmptyState";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";
import type { CounsellingDetail, CounsellingRow, PagedResponse } from "@/src/lib/adminTypes";
import { Save } from "lucide-react";

export default function Page({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<CounsellingDetail | null>(null);
  const [form, setForm] = useState({
    status: "triaged",
    urgency: "non_urgent",
    category: "",
    summary: "",
    followUpAt: "",
  });

  const id = params.id;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      try {
        const detail = await api.get<CounsellingDetail>(`/admin/counselling/${id}`);
        setData(detail);
        setForm({
          status: detail.status ?? "triaged",
          urgency: detail.urgency ?? "non_urgent",
          category: detail.category ?? "",
          summary: detail.summary ?? "",
          followUpAt: detail.followUpAt ? detail.followUpAt.slice(0, 16) : "",
        });
      } catch {
        const list = await api.get<PagedResponse<CounsellingRow>>("/admin/counselling");
        const found = list.items?.find((row) => row.id === id);
        if (!found) {
          setData(null);
          return;
        }

        setData(found);
        setForm({
          status: found.status ?? "triaged",
          urgency: found.urgency ?? "non_urgent",
          category: found.category ?? "",
          summary: found.summary ?? "",
          followUpAt: found.followUpAt ? found.followUpAt.slice(0, 16) : "",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!data) return;
    setSaving(true);
    try {
      await api.patch(`/admin/counselling/${id}/triage`, {
        status: form.status,
        urgency: form.urgency,
        category: form.category,
        summary: form.summary,
        followUpAt: form.followUpAt || null,
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModuleLayout
      title="Counselling case"
      description="Review the case, update urgency, and schedule follow-up."
      backHref="/admin/counselling"
      backLabel="Counselling"
      primaryAction={{ label: "Save changes", href: "/admin/counselling" }}
      secondaryAction={{ label: "Back to list", href: "/admin/counselling" }}
    >
      {loading ? (
        <LoadingState label="Loading counselling case..." />
      ) : !data ? (
        <EmptyState title="Counselling case not found" description="The case may have been removed or the route is incorrect." />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Counselling</div>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{data.category}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge status={data.status} />
                  <StatusBadge status={data.urgency} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

            <div className="mt-6">
              <AdminKeyValueGrid
                items={[
                  { label: "Member ID", value: data.memberId },
                  { label: "Created", value: data.createdAt ? new Date(data.createdAt).toLocaleString() : "—" },
                  { label: "Triaged", value: data.triagedAt ? new Date(data.triagedAt).toLocaleString() : "—" },
                  { label: "Resolved", value: data.resolvedAt ? new Date(data.resolvedAt).toLocaleString() : "—" },
                  { label: "Assigned admin", value: data.assignedToAdminId ?? "—" },
                  { label: "Follow-up", value: data.followUpAt ? new Date(data.followUpAt).toLocaleString() : "—" },
                ]}
              />
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Status</div>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  <option value="triaged">Triaged</option>
                  <option value="assigned">Assigned</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Urgency</div>
                <select
                  value={form.urgency}
                  onChange={(e) => setForm((prev) => ({ ...prev, urgency: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  <option value="urgent">Urgent</option>
                  <option value="non_urgent">Normal</option>
                </select>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Category</div>
                <input
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Summary</div>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Follow-up date/time</div>
                <input
                  type="datetime-local"
                  value={form.followUpAt}
                  onChange={(e) => setForm((prev) => ({ ...prev, followUpAt: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Case details</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {data.details ?? "No extra details provided."}
              </p>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Actions</h3>
              <div className="mt-4 grid gap-3">
                <Link href="/admin/counselling" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50">
                  Back to counselling list
                </Link>
                <Link href="/admin/dashboard" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50">
                  Back to dashboard
                </Link>
              </div>
            </section>
          </aside>
        </div>
      )}
    </AdminModuleLayout>
  );
}