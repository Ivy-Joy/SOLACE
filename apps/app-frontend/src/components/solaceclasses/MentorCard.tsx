// Mentor profile card below timeline
// apps/app-frontend/src/components/solaceSunday/MentorCard.tsx
"use client";
import React from "react";
import Image from "next/image";
import type { Mentor } from "@/src/types/solaceclasses";

export default function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
      <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-100">
        {mentor.photo ? (
          <Image src={mentor.photo} alt={mentor.name} fill className="object-cover" />
        ) : null}
      </div>
      <div>
        <div className="font-bold">{mentor.name}</div>
        <div className="text-sm text-gray-500">{mentor.role}</div>
        <div className="text-xs text-gray-600 mt-2">{mentor.bio}</div>
      </div>
    </div>
  );
}