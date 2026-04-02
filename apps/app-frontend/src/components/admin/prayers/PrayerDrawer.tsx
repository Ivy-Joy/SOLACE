"use client";

import { X } from "lucide-react";
import type { PrayerDetail } from "@/src/lib/adminTypes";
import StatusBadge from "../shared/StatusBadge";

type Props = {
  prayer: PrayerDetail | null;
  open: boolean;
  onClose: () => void;
  answerDraft: string;
  onAnswerDraftChange: (value: string) => void;
  noteDraft: string;
  onNoteDraftChange: (value: string) => void;
  onAnswer: () => void;
  onHide: () => void;
  onUnhide: () => void;
  onEscalate: () => void;
  onClearEscalation: () => void;
};

export default function PrayerDrawer({
  prayer,
  open,
  onClose,
  answerDraft,
  onAnswerDraftChange,
  noteDraft,
  onNoteDraftChange,
  onAnswer,
  onHide,
  onUnhide,
  onEscalate,
  onClearEscalation,
}: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-2xl transform border-l border-gray-200 bg-white transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Prayer</p>
              <h2 className="mt-1 text-2xl font-black text-gray-900">{prayer?.title || "Prayer request"}</h2>
            </div>
            <button onClick={onClose} className="rounded-2xl border border-gray-200 p-2">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {prayer ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={prayer.answered ? "answered" : "open"} />
                  {prayer.hidden ? <StatusBadge status="hidden" /> : null}
                  {prayer.escalated ? <StatusBadge status="escalated" /> : null}
                  <StatusBadge status={prayer.anonymous ? "anonymous" : "named"} />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Request</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800">{prayer.text}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Info label="Prayers count" value={String(prayer.prayersCount)} />
                  <Info label="Created" value={prayer.createdAt ?? "—"} />
                  <Info label="Answered at" value={prayer.answeredAt ?? "—"} />
                  <Info label="Escalated note" value={prayer.escalatedNote ?? "—"} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Answer / testimony</p>
                  <textarea
                    value={answerDraft}
                    onChange={(e) => onAnswerDraftChange(e.target.value)}
                    className="mt-2 min-h-28 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[var(--gs-gold)] focus:ring-2 focus:ring-[rgba(224,190,83,0.2)]"
                  />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Moderation note</p>
                  <textarea
                    value={noteDraft}
                    onChange={(e) => onNoteDraftChange(e.target.value)}
                    className="mt-2 min-h-20 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[var(--gs-gold)] focus:ring-2 focus:ring-[rgba(224,190,83,0.2)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={onAnswer} className="rounded-2xl bg-[var(--gs-dark)] px-4 py-3 text-sm font-semibold text-white">
                    Mark answered
                  </button>
                  <button onClick={prayer.hidden ? onUnhide : onHide} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
                    {prayer.hidden ? "Unhide" : "Hide"}
                  </button>
                  <button onClick={prayer.escalated ? onClearEscalation : onEscalate} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
                    {prayer.escalated ? "Clear escalation" : "Escalate"}
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">Select a prayer request to view details.</div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}