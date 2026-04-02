//Displays a single Sunday session with scripture and questions (includes scripture highlight card).
// apps/app-frontend/src/components/solaceSunday/SessionCard.tsx
"use client";
import React from "react";
import type { SundaySession } from "@/src/types/solaceclasses";
import ScriptureCard from "./ScriptureCard";
import QuestionsBlock from "./QuestionsBlock";
import { fmtDate } from "@/src/utils/date";

export default function SessionCard({ session }: { session: SundaySession }) {
  return (
    <article className="flex-1 bg-white rounded-2xl border p-6 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-xs text-gray-400">{fmtDate(session.date)}</div>
          <h4 className="text-lg font-black mt-1">{session.theme}</h4>
          <p className="mt-3 text-gray-600">{session.summary}</p>
        </div>
        <div className="w-48">
          <ScriptureCard scripture={session.scripture} />
        </div>
      </div>

      <div className="mt-6">
        <QuestionsBlock questions={session.questions} />
      </div>
    </article>
  );
}