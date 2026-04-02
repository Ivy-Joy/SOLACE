"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import memberApi from "@/src/lib/memberApi";
import { CalendarDays, Video, Lock } from "lucide-react";

type Session = {
  id: string;
  title: string;
  description?: string | null;
  classKey: string;
  status: string;
  startsAt?: string | null;
  endsAt?: string | null;
  meetingUrl?: string | null;
  roomCode?: string | null;
  adultOnly?: boolean;
  allowChat?: boolean;
  coverImage?: string | null;
};

export default function LiveSessionsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Session[]>([]);
  const [restricted, setRestricted] = useState(false);

  useEffect(() => {
    memberApi
      .get<{ items: Session[] }>("/member/live-sessions")
      .then((res) => setItems(res.items))
      .catch((err) => {
        if (String(err.message).includes("Adult-only access required")) setRestricted(true);
        else router.replace("/member/dashboard");
      });
  }, [router]);

  if (restricted) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <div className="flex items-center gap-2 font-bold">
            <Lock size={18} />
            Adult-only access required
          </div>
          <p className="mt-2 text-sm">
            Live sessions are available after approval and adult eligibility checks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <Video size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Live sessions
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your class rooms</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Join scheduled rooms, open recorded or external meetings, and move into the live chat.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((s) => (
            <div key={s.id} className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{s.status}</div>
              <div className="mt-2 text-lg font-bold text-slate-900">{s.title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{s.description ?? "Session details"}</p>
              <div className="mt-4 text-xs text-slate-500">
                Starts: {s.startsAt ? new Date(s.startsAt).toLocaleString() : "TBA"}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/member/live-sessions/${s.id}`}
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Open room
                </Link>
                <Link
                  href={`/member/classes/${s.classKey}`}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Class chat
                </Link>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No sessions available right now.
          </div>
        ) : null}
      </div>
    </div>
  );
}