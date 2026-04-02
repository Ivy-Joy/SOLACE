//Creates a prayer session booking.
//apps/app-frontend/src/components/prayer/SharedCalendarModal.tsx
"use client";

import { useEffect, useState } from "react";
import { X, Calendar, Loader2 } from "lucide-react";
import { PublicPrayer } from "@/src/types/prayer";
import { Intercessor } from "@/src/types/intercessor";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

interface Props {
  open: boolean;
  intercessor?: Intercessor | undefined;
  prayer?: PublicPrayer | null;
  onClose: () => void;
}

export default function SharedCalendarModal({ open, intercessor, prayer, onClose }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setDate("");
      setTime("");
      setLoading(false);
    }
  }, [open]);

  async function schedule() {
    if (!prayer) {
      alert("No prayer selected.");
      return;
    }
    if (!date || !time) {
      alert("Please choose date and time.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE}/api/prayer-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prayerRequest: prayer._id,
          intercessor: intercessor?._id ?? null,
          start: `${date}T${time}:00`,
        }),
      });

      if (!res.ok) throw new Error("Failed to schedule");
      onClose();
      alert("Prayer session scheduled");
    } catch (err) {
      console.error(err);
      alert("Failed to schedule prayer session.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Schedule Prayer Session</h3>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {intercessor && (
          <p className="text-sm text-gray-700 mb-3">
            With <strong>{intercessor.displayName}</strong>
          </p>
        )}

        {prayer && (
          <p className="text-sm text-gray-600 mb-4">
            For: <strong>{prayer.title ?? "Prayer Request"}</strong>
          </p>
        )}

        <div className="space-y-3">
          <input
            type="date"
            className="w-full border border-gray-200 rounded-md px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            className="w-full border border-gray-200 rounded-md px-3 py-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <button
          onClick={schedule}
          disabled={loading}
          className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-[--accent] text-white py-2 rounded-md"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Calendar size={16} />}
          <span>{loading ? "Scheduling…" : "Confirm Booking"}</span>
        </button>
      </div>
    </div>
  );
}