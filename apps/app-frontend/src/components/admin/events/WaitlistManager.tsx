"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/src/lib/api";
import { ArrowRightLeft, Search, Users } from "lucide-react";

type WaitlistItem = {
  id: string;
  fullName?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  note?: string | null;
  position?: number | null;
  status?: string | null;
  requestedAt?: string | null;
};

type WaitlistResponse = {
  items: WaitlistItem[];
  page: number;
  limit: number;
  total: number;
};

export default function WaitlistManager({ eventId }: { eventId: string }) {
  const [items, setItems] = useState<WaitlistItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (q.trim()) params.set("q", q.trim());

        const res = await api.get<WaitlistResponse>(`/admin/events/${eventId}/waitlist?${params.toString()}`);
        if (!mounted) return;
        setItems(res.items ?? []);
        setTotal(res.total ?? 0);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [eventId, page, limit, q]);

  async function move(itemId: string, action: "promote" | "remove") {
    setBusyId(itemId);
    try {
      await api.patch(`/admin/events/${eventId}/waitlist`, {
        waitlistId: itemId,
        action,
      });
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      setTotal((prev) => Math.max(0, prev - 1));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Waitlist manager</h2>
          <p className="text-sm text-slate-600">Promote people from the waitlist or remove them.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users size={16} />
          {total} entries
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3">
        <Search size={16} className="text-slate-400" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search waitlist..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-5 grid gap-3">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-500">
            Loading waitlist...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            No waitlisted people found.
          </div>
        ) : (
          items.map((item) => {
            const name = item.fullName ?? item.name ?? "Unnamed";
            return (
              <div key={item.id} className="rounded-[24px] border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">{name}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {item.phone ?? "—"} · {item.email ?? "—"}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Position: {item.position ?? "—"} ·{" "}
                      {item.requestedAt ? new Date(item.requestedAt).toLocaleString() : "No date"}
                    </div>
                    {item.note ? <div className="mt-2 text-sm text-slate-700">{item.note}</div> : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => move(item.id, "promote")}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      <ArrowRightLeft size={14} />
                      Promote
                    </button>
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => move(item.id, "remove")}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}