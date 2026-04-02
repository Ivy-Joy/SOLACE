"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "@/src/lib/api";
import { Edit3, Eye, Plus, Search, Trash2 } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  status?: string | null;
  published?: boolean;
  featured?: boolean;
  registrationEnabled?: boolean;
  capacity?: number | null;
  registeredCount?: number | null;
  timezone?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type EventsListResponse = {
  items: EventItem[];
  page: number;
  limit: number;
  total: number;
};

const PAGE_SIZE = 10;

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

function StatusPill({ status }: { status?: string | null }) {
  const normalized = (status ?? "draft").toLowerCase();

  const tone =
    normalized === "published"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : normalized === "archived"
        ? "bg-slate-100 text-slate-600 border-slate-200"
        : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>
      {normalized}
    </span>
  );
}

export default function EventsList() {
  //const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
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
        if (status.trim()) params.set("status", status.trim());

        const res = await api.get<EventsListResponse>(`/admin/events?${params.toString()}`);
        if (!mounted) return;

        setItems(res.items ?? []);
        setPage(res.page ?? page);
        setTotal(res.total ?? 0);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [page, limit, q, status]);

  async function removeEvent(id: string) {
    const ok = window.confirm("Delete this event permanently?");
    if (!ok) return;

    setBusyId(id);
    try {
      await api.del(`/admin/events/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
    } finally {
      setBusyId(null);
    }
  }

  function goSearch() {
    setPage(1);
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Event list</h2>
          <p className="text-sm text-slate-600">Search, publish, edit, or remove events.</p>
        </div>

        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          New event
        </Link>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_auto]">
        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3">
          <Search size={16} className="text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goSearch();
            }}
            placeholder="Search events..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
        >
          <option value="">All status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <button
          type="button"
          onClick={goSearch}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
        >
          Search
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Registration</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                    Loading events...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <div className="mx-auto max-w-sm">
                      <div className="text-base font-semibold text-slate-900">No events found</div>
                      <p className="mt-2 text-sm text-slate-600">
                        Create your first event or change the search filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const capacityText =
                    item.capacity != null
                      ? `${item.registeredCount ?? 0}/${item.capacity}`
                      : item.registeredCount != null
                        ? String(item.registeredCount)
                        : "—";

                  return (
                    <tr key={item.id} className="align-top">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900">{item.title}</div>
                        <div className="mt-1 text-sm text-slate-500">
                          {item.location ?? "No location"} · {item.slug ?? "no-slug"}
                        </div>
                        <div className="mt-2 text-xs text-slate-400">{formatDate(item.createdAt)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusPill status={item.status} />
                        <div className="mt-2 text-xs text-slate-500">
                          {item.published ? "Published" : "Not published"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{formatDate(item.startAt)}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{capacityText}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {item.registrationEnabled ? "Open" : "Closed"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/events/${item.id}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                          >
                            <Edit3 size={14} />
                            Edit
                          </Link>
                          <Link
                            href={`/admin/events/${item.id}/registrations`}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                          >
                            <Eye size={14} />
                            Registrations
                          </Link>
                          <button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => removeEvent(item.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          Page {page} of {totalPages} · {total} total
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