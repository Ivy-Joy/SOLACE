"use client";

import { useEffect, useMemo, useState } from "react";
import memberApi from "@/src/lib/memberApi";
import { ArrowLeft, MessageCircle, PlayCircle, Video } from "lucide-react";
import Link from "next/link";
import ClassChatPanel from "../community/ClassChatPanel";

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
  maxParticipants?: number | null;
};

export default function LiveSessionRoom({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    memberApi
      .get<Session>(`/member/live-sessions/${sessionId}`)
      .then(setSession)
      .catch((err) => setMessage(err.message));
  }, [sessionId]);

  const joinUrl = useMemo(() => {
    if (!session) return null;
    return session.meetingUrl || `/member/live-sessions/${session.id}/join`;
  }, [session]);

  if (message) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          {message}
        </div>
      </div>
    );
  }

  if (!session) {
    return <div className="p-6">Loading session...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <Link href="/member/live-sessions" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ArrowLeft size={16} />
                Back
              </Link>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {session.status}
              </span>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <div className="rounded-2xl bg-slate-900 p-3 text-white">
                <Video size={18} />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{session.title}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{session.description ?? "Private live session"}</p>
                <div className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                  {session.classKey.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950">
              <div className="aspect-video grid place-items-center text-center text-white">
                <div>
                  <PlayCircle size={56} className="mx-auto" />
                  <div className="mt-3 text-lg font-bold">Video room placeholder</div>
                  <p className="mt-1 text-sm text-slate-300">
                    Plug in Zoom, Jitsi, or your meeting provider here.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {joinUrl ? (
                <a
                  href={joinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                >
                  Join session
                </a>
              ) : null}
              <Link
                href={`/member/classes/${session.classKey}`}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Open class chat
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {session.allowChat ? (
            <ClassChatPanel classKey={session.classKey as any} liveSessionId={session.id} />
          ) : (
            <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
              Chat is disabled for this room.
            </div>
          )}

          <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <h2 className="text-lg font-bold text-slate-900">Room notes</h2>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              Use this space for scripture, teaching points, and follow-up actions after the session.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}