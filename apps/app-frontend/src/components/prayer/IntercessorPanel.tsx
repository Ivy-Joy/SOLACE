//Displays the live intercessor directory.
//apps/app-frontend/src/components/prayer/IntercessorPanel.tsx
"use client";

import useSWR from "swr";
import { useState } from "react";
import { Loader2, Users } from "lucide-react";
import IntercessorCard from "./IntercessorCard";
import { Intercessor, IntercessorResponse } from "@/src/types/intercessor";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

const fetcher = async (url: string): Promise<IntercessorResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed");
  return res.json();
};

interface Props {
  onSchedule: (intercessor: Intercessor) => void;
}

export default function IntercessorPanel({ onSchedule }: Props) {
  const { data, isLoading, error } = useSWR<IntercessorResponse>(
    `${BASE}/api/intercessors`,
    fetcher
  );

  const [filter, setFilter] = useState("");

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-10 text-gray-400">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="text-sm text-red-600">
        Failed to load intercessors
      </div>
    );

  const intercessors =
    data?.items.filter(i =>
      i.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
    ) ?? [];

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Users size={16} />
        <h3 className="text-sm font-semibold text-gray-900">
          Available Intercessors
        </h3>
      </div>

      <input
        placeholder="Filter by topic..."
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm mb-4"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      <div className="grid gap-3">
        {intercessors.map(i => (
          <IntercessorCard
            key={i._id}
            intercessor={i}
            onSchedule={onSchedule}
          />
        ))}
      </div>

      {intercessors.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-6">
          No intercessors found
        </p>
      )}
    </div>
  );
}