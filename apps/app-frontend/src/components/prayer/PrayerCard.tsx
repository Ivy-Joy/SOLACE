//apps/app-frontend/src/components/prayer/PrayerCard.tsx
"use client";

import api from "@/src/lib/api";
import { PublicPrayer } from "@/src/types/prayer";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Clock, User2, Calendar as CalendarIcon } from "lucide-react";

type Props = {
  prayer: PublicPrayer;
  onOpenCalendar?: (prayer: PublicPrayer) => void;
};

export default function PrayerCard({ prayer, onOpenCalendar }: Props) {
  const [count, setCount] = useState(prayer.prayersCount);
  const [justPrayed, setJustPrayed] = useState(false);

  async function handlePray() {
    if (justPrayed) return;
    try {
      await api.post(`/prayer-requests/${prayer._id}/prayed`);
      setCount((prev) => prev + 1);
      setJustPrayed(true);
    } catch {
      console.error("Prayer failed to register");
    }
  }

  return (
    <motion.article
      layout
      className="relative group bg-white border border-gray-200 p-5 rounded-xl shadow-sm transition hover:shadow-md"
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-600 font-semibold">
            <User2 size={14} />
            <span>Community</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={14} />
            <span>{formatDistanceToNow(new Date(prayer.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {prayer.title || "Prayer Request"}
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">{prayer.excerpt}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Heart
                size={18}
                className={`${justPrayed ? "text-rose-500 fill-rose-500" : "text-gray-300"}`}
              />
              <AnimatePresence>
                {justPrayed && (
                  <motion.div
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    className="absolute inset-0 rounded-full bg-rose-100"
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="text-sm font-medium text-gray-800">
              {count} <span className="text-xs text-gray-500 font-normal">Intercessions</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePray}
              disabled={justPrayed}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                justPrayed ? "bg-gray-100 text-gray-400" : "bg-[--accent] text-white"
              }`}
            >
              {justPrayed ? "Lifted Up" : "I Prayed"}
            </button>

            <button
              onClick={() => onOpenCalendar?.(prayer)}
              className="px-3 py-2 rounded-lg text-xs border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              title="Schedule prayer session"
            >
              <CalendarIcon size={14} />
              <span>Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}