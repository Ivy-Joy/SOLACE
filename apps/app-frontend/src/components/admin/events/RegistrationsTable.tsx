/*'use client'
import React, { useEffect, useState } from 'react';

export default function RegistrationsTable({ eventId }){
  const [regs,setRegs] = useState([]);
  useEffect(()=>{ fetch(`/api/admin/events/${eventId}/registrations`).then(r=>r.json()).then(setRegs) },[eventId]);

  async function exportCsv(){
    const res = await fetch(`/api/admin/events/${eventId}/registrations?action=export`, { method: 'POST' });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob); window.open(url);
  }

  async function checkIn(regId){ await fetch(`/api/admin/events/${eventId}/checkin`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ registrationId: regId }) }); setRegs(rs => rs.map(r => r._id===regId ? {...r, checkInAt: new Date().toISOString()} : r)); }
  async function reverse(regId){ await fetch(`/api/admin/events/${eventId}/checkin`, { method: 'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ registrationId: regId }) }); setRegs(rs => rs.map(r => r._id===regId ? {...r, checkInAt: null } : r)); }

  return (
    <div className="bg-white rounded p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Registrations</h3>
        <div>
          <button onClick={exportCsv} className="btn">Export CSV</button>
        </div>
      </div>
      <table className="w-full text-left">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Check-in</th><th>Actions</th></tr></thead>
        <tbody>
          {regs.map(r=> (
            <tr key={r._id}><td>{r.name}</td><td>{r.email}</td><td>{r.phone}</td><td>{r.status}</td>
              <td>{r.checkInAt ? new Date(r.checkInAt).toLocaleString() : '-'}</td>
              <td>
                <button onClick={()=>checkIn(r._id)} className="mr-2">Check-in</button>
                <button onClick={()=>reverse(r._id)}>Reverse</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}*/
"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/src/lib/api";
import { CheckCircle2, Search } from "lucide-react";

type RegistrationItem = {
  id: string;
  fullName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  ticketType?: string | null;
  status?: string | null;
  checkedIn?: boolean;
  checkedInAt?: string | null;
  registeredAt?: string | null;
  notes?: string | null;
};

type RegistrationsResponse = {
  items: RegistrationItem[];
  page: number;
  limit: number;
  total: number;
};

export default function RegistrationsTable({ eventId }: { eventId: string }) {
  const [items, setItems] = useState<RegistrationItem[]>([]);
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

        const res = await api.get<RegistrationsResponse>(
          `/admin/events/${eventId}/registrations?${params.toString()}`
        );

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

  async function checkIn(registrationId: string) {
    setBusyId(registrationId);
    try {
      await api.post(`/admin/events/${eventId}/check-in`, { registrationId });
      setItems((prev) =>
        prev.map((item) =>
          item.id === registrationId
            ? { ...item, checkedIn: true, checkedInAt: new Date().toISOString() }
            : item
        )
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Registrations</h2>
          <p className="text-sm text-slate-600">Track attendance and registration details.</p>
        </div>
        <div className="text-sm text-slate-500">{total} total</div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3">
        <Search size={16} className="text-slate-400" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search registrations..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Attendee</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Ticket</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Checked in</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                    Loading registrations...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const name = item.fullName ?? item.name ?? "Unnamed";
                  const checked = item.checkedIn || Boolean(item.checkedInAt);

                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900">{name}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {item.registeredAt ? new Date(item.registeredAt).toLocaleString() : "No date"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <div>{item.phone ?? "—"}</div>
                        <div className="text-slate-500">{item.email ?? "—"}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{item.ticketType ?? "General"}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{item.status ?? "registered"}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {checked ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 size={14} />
                            Checked in
                          </span>
                        ) : (
                          "Pending"
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          disabled={checked || busyId === item.id}
                          onClick={() => checkIn(item.id)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                        >
                          {busyId === item.id ? "Checking..." : "Check in"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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