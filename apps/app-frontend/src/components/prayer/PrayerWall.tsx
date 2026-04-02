//apps/app-frontend/src/components/prayer/PrayerWall.tsx
"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShieldCheck, Loader2 } from "lucide-react";
import api from "@/src/lib/api";
import PrayerForm from "./PrayerForm";
import PrayerCard from "./PrayerCard";
import IntercessorPanel from "./IntercessorPanel";
import SharedCalendarModal from "./SharedCalendarModal";
import { PrayerSubmission, PrayerListResponse, PublicPrayer } from "@/src/types/prayer";
import { Intercessor } from "@/src/types/intercessor";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";


const fetcher = async (url: string): Promise<PrayerListResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
};

export default function PrayerWall() {
  const { data, error, isLoading } = useSWR<PrayerListResponse>(`${BASE}/api/prayer-requests`, fetcher);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // selected intercessor (from panel) and selected prayer (from PrayerCard)
  const [selectedIntercessor, setSelectedIntercessor] = useState<Intercessor | undefined>();
  const [selectedPrayer, setSelectedPrayer] = useState<PublicPrayer | null>(null);

  function handleScheduleIntercessor(intercessor: Intercessor) {
    setSelectedIntercessor(intercessor);
    setShowCalendar(true);
  }

  function openCalendarForPrayer(prayer: PublicPrayer) {
    setSelectedPrayer(prayer);
    setShowCalendar(true);
  }

  async function onSubmit(values: PrayerSubmission) {
    setSubmitting(true);
    try {
      await api.post("/prayer-requests", values);
      mutate(`${BASE}/api/prayer-requests`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* header */}
      <div className="mb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest mb-4">
          Live Intercession
        </motion.div>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-32">
          <div className="bg-white border border-gray-100 rounded-[1rem] p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Request</h3>
            <PrayerForm onSubmit={onSubmit} submitting={submitting} />

            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mt-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm text-center font-medium">
                  Your request has been lifted up in prayer.
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex items-start gap-3 p-3 rounded-md bg-gray-50 border border-gray-100">
              <ShieldCheck className="text-gray-700 shrink-0" size={18} />
              <p className="text-xs leading-relaxed text-gray-600">
                <strong>Privacy:</strong> Sensitive details are encrypted and only pastoral staff can view them.
              </p>
            </div>

            <div className="mt-6">
              <IntercessorPanel onSchedule={handleScheduleIntercessor} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {error && <div className="p-6 text-center rounded-md bg-red-50 border border-red-100 text-red-600">Connection interrupted. Please refresh.</div>}

          {isLoading && <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-300"><Loader2 className="animate-spin" size={40} /><p className="text-sm font-bold tracking-widest uppercase">Fetching Stream...</p></div>}

          {!isLoading && data?.items?.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-lg">
              <Heart className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-500 font-light italic">No requests yet. Be the first to reach out.</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {data?.items?.map((p, index) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} layout>
                  <PrayerCard prayer={p} onOpenCalendar={(pr) => openCalendarForPrayer(pr)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <SharedCalendarModal
        open={showCalendar}
        intercessor={selectedIntercessor}
        prayer={selectedPrayer}
        onClose={() => {
          setShowCalendar(false);
          setSelectedIntercessor(undefined);
          setSelectedPrayer(null);
        }}
      />
    </div>
  );
}