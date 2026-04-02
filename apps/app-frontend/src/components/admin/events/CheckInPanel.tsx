"use client";

import { useState } from "react";
import api from "@/src/lib/api";
import { BadgeCheck, Search } from "lucide-react";

export default function CheckInPanel({ eventId }: { eventId: string }) {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setResult(null);

    try {
      const payload: Record<string, string> = {};
      if (code.trim()) payload.code = code.trim();
      if (phone.trim()) payload.phone = phone.trim();
      if (email.trim()) payload.email = email.trim();

      const res = await api.post<{ message?: string }>(`/admin/events/${eventId}/check-in`, payload);
      setResult(res?.message ?? "Check-in saved.");
      setCode("");
      setPhone("");
      setEmail("");
    } catch {
      setResult("Check-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-3 text-white">
          <BadgeCheck size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Check-in panel</h2>
          <p className="text-sm text-slate-600">Search by code, phone, or email and mark attendance.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Registration code</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            placeholder="Enter code"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            placeholder="Enter phone"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            placeholder="Enter email"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Search size={16} />
          {busy ? "Checking in..." : "Check in"}
        </button>
      </div>

      {result ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {result}
        </div>
      ) : null}
    </div>
  );
}