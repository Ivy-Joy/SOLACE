//apps/app-frontend/src/components/prayer/IntercessorCard.tsx
"use client";

import { Intercessor } from "@/src/types/intercessor";
import { motion } from "framer-motion";
import { Calendar, MessageCircle, Wifi } from "lucide-react";

interface Props {
  intercessor: Intercessor;
  onSchedule: (intercessor: Intercessor) => void;
}

export default function IntercessorCard({ intercessor, onSchedule }: Props) {
  return (
    <motion.div
      layout
      className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">
          {intercessor.displayName}
        </h4>

        {intercessor.online && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <Wifi size={14} />
            Live
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
        {intercessor.bio}
      </p>

      <div className="flex flex-wrap gap-1 mt-3">
        {intercessor.tags.map(tag => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          className="flex items-center gap-1 text-xs bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-black"
          onClick={() => onSchedule(intercessor)}
        >
          <Calendar size={14} />
          Schedule
        </button>

        <button className="flex items-center gap-1 text-xs border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">
          <MessageCircle size={14} />
          Message
        </button>
      </div>
    </motion.div>
  );
}