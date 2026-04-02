"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/src/lib/api";
import AdminModuleLayout from "@/src/components/admin/shared/AdminModuleLayout";
import AdminKeyValueGrid from "@/src/components/admin/shared/AdminKeyValueGrid";
import EmptyState from "@/src/components/admin/shared/EmptyState";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";
import type { JourneyDetail, JourneyRow, PagedResponse } from "@/src/lib/adminTypes";
import { Save } from "lucide-react";

export default function Page({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<JourneyDetail | null>(null);
  const [form, setForm] = useState({
    stage: "seeker",
    progressScore: 0,
    nextStep: "",
    lastMilestone: "",
    notes: "",
  });

  const memberId = params.id;

  async function load() {
    setLoading(true);
    try {
      try {
        const detail = await api.get<JourneyDetail>(`/admin/funnel/${memberId}`);
        setData(detail);
        setForm({
          stage: detail.stage ?? "seeker",
          progressScore: detail.progressScore ?? 0,
          nextStep: detail.nextStep ?? "",
          lastMilestone: detail.lastMilestone ?? "",
          notes: detail.notes ?? "",
        });
      } catch {
        const list = await api.get<PagedResponse<JourneyRow>>("/admin/funnel");
        const found = list.items?.find((row) => row.memberId === memberId);
        if (!found) {
          setData(null);
          return;
        }

        const fallback: JourneyDetail = {
          ...found,
          notes: "",
          updatedByAdminId: null,
        };

        setData(fallback);
        setForm({
          stage: fallback.stage ?? "seeker",
          progressScore: fallback.progressScore ?? 0,
          nextStep: fallback.nextStep ?? "",
          lastMilestone: fallback.lastMilestone ?? "",
          notes: fallback.notes ?? "",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [memberId]);

  async function save() {
    if (!data) return;
    setSaving(true);
    try {
      await api.patch(`/admin/funnel/${memberId}`, {
        stage: form.stage,
        progressScore: form.progressScore,
        nextStep: form.nextStep,
        lastMilestone: form.lastMilestone,
        notes: form.notes,
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModuleLayout
      title="Journey detail"
      description="Adjust the member’s discipleship stage, next step, and milestone notes."
      backHref="/admin/funnel"
      backLabel="Funnel"
      primaryAction={{ label: "Save changes", href: "/admin/funnel" }}
      secondaryAction={{ label: "Back to list", href: "/admin/funnel" }}
    >
      {loading ? (
        <LoadingState label="Loading journey..." />
      ) : !data ? (
        <EmptyState title="Journey not found" description="The route may be incorrect or the member has no journey yet." />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Member journey
                </div>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{data.memberId}</h2>
                <div className="mt-2">
                  <StatusBadge status={data.stage} />
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
                  { label: "Progress score", value: data.progressScore },
                  { label: "Updated", value: data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "—" },
                  { label: "Updated by admin", value: data.updatedByAdminId ?? "—" },
                  { label: "Next step", value: data.nextStep ?? "—" },
                  { label: "Last milestone", value: data.lastMilestone ?? "—" },
                  { label: "Notes", value: data.notes ?? "—" },
                ]}
              />
            </div>

            <div className="mt-6 grid gap-4">
              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Stage</div>
                <select
                  value={form.stage}
                  onChange={(e) => setForm((prev) => ({ ...prev, stage: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  <option value="seeker">Seeker</option>
                  <option value="newcomer">Newcomer</option>
                  <option value="believer">Believer</option>
                  <option value="foundation">Foundation</option>
                  <option value="serve">Serve</option>
                  <option value="leader">Leader</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Progress score</div>
                <input
                  type="number"
                  value={form.progressScore}
                  onChange={(e) => setForm((prev) => ({ ...prev, progressScore: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Next step</div>
                <input
                  value={form.nextStep}
                  onChange={(e) => setForm((prev) => ({ ...prev, nextStep: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Last milestone</div>
                <input
                  value={form.lastMilestone}
                  onChange={(e) => setForm((prev) => ({ ...prev, lastMilestone: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-slate-700">Notes</div>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Journey context</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use the stage, score, next step, and milestone fields to keep discipleship movement clear and consistent.
              </p>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Actions</h3>
              <div className="mt-4 grid gap-3">
                <Link href="/admin/funnel" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50">
                  Back to funnel
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