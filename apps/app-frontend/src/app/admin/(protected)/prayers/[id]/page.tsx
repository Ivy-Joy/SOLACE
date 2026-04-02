//full moderation screen
// app/admin/(protected)/prayers/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/src/lib/api";
import type { PrayerDetail } from "@/src/lib/adminTypes";

import AdminPageHeader from "@/src/components/admin/layout/AdminPageHeader";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";

export default function PrayerDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [data, setData] = useState<PrayerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [answer, setAnswer] = useState("");
  const [note, setNote] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<PrayerDetail>(`/admin/prayers/${id}`);
      setData(res);
      setAnswer(res.answerText ?? "");
      setNote(res.moderationNote ?? "");
    } catch {
      router.replace("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  async function act(action: string) {
    if (!data) return;

    await api.patch(`/admin/prayers/${data.id}`, {
      action,
      answerText: answer,
      note,
    });

    await load();
  }

  useEffect(() => {
    void load();
  }, [id]);

  if (loading || !data) return <LoadingState />;

  const status = data.answered
    ? "answered"
    : data.hidden
    ? "hidden"
    : data.escalated
    ? "escalated"
    : "open";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Prayer Moderation"
        description="Full review and action center"
      />

      {/* PRAYER CONTENT */}
      <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">{data.title || "Prayer request"}</h2>
          <StatusBadge status={status} />
        </div>

        <p className="text-gray-700 whitespace-pre-line">{data.text}</p>

        <div className="text-sm text-gray-500">
          Created: {data.createdAt ?? "—"}
        </div>
      </div>

      {/* ANSWER */}
      <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Answer / Testimony</h3>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          className="w-full border rounded-2xl p-3 text-sm"
        />

        <button
          onClick={() => act("answered")}
          className="bg-green-600 text-white px-4 py-2 rounded-xl"
        >
          Mark as Answered
        </button>
      </div>

      {/* MODERATION */}
      <div className="rounded-3xl bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-semibold">Moderation Notes</h3>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full border rounded-2xl p-3 text-sm"
        />

        <div className="flex flex-wrap gap-2">
          <button onClick={() => act("hidden")} className="px-4 py-2 border rounded-xl">
            Hide
          </button>

          <button onClick={() => act("unhidden")} className="px-4 py-2 border rounded-xl">
            Unhide
          </button>

          <button onClick={() => act("escalated")} className="px-4 py-2 bg-yellow-500 text-white rounded-xl">
            Escalate
          </button>

          <button onClick={() => act("clear_escalation")} className="px-4 py-2 border rounded-xl">
            Clear Escalation
          </button>
        </div>
      </div>

      {/* ESCALATION INFO */}
      {data.escalated && (
        <div className="rounded-3xl bg-yellow-50 p-6 text-sm">
          <strong>Escalated:</strong> {data.escalatedNote ?? "No note"}
        </div>
      )}
    </div>
  );
}