"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import memberApi from "@/src/lib/memberApi";
import {
  CalendarDays,
  MessageCircle,
  Plus,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Lock,
  ArrowRight,
} from "lucide-react";

type DashboardData = {
  profile: {
    id: string;
    fullName: string;
    preferredClass: string | null;
    status: string;
    profileStatus: string;
    visibilityScope: string;
    age: number | null;
    isAdult: boolean;
    points: number;
    tags: string[];
  };
  access: {
    canUseCommunity: boolean;
    canJoinLiveSessions: boolean;
    canPost: boolean;
    canChat: boolean;
  };
  cards: { title: string; value: string; hint: string }[];
  liveSessions: Array<{
    id: string;
    title: string;
    description?: string | null;
    classKey: string;
    status: string;
    startsAt?: string | null;
    endsAt?: string | null;
    meetingUrl?: string | null;
    roomCode?: string | null;
    allowChat?: boolean;
    coverImage?: string | null;
  }>;
  posts: Array<{
    id: string;
    title: string;
    body: string;
    pinned: boolean;
    classKey: string;
    createdAt?: string | null;
  }>;
  nextAction: string;
};

export default function MemberDashboardHome() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("member_token");
    if (!token) {
      router.replace("/join");
      return;
    }

    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const res = await memberApi.get<DashboardData>("/member/community/dashboard");
        if (mounted) setData(res);
      } catch {
        localStorage.removeItem("member_token");
        router.replace("/join");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [router]);

  const classKey = useMemo(() => data?.profile.preferredClass ?? "unassigned", [data]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          Loading member dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                SOLACE member space
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Welcome back, {data.profile.fullName}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Your private dashboard, live sessions, class posts, and chat live here.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 px-5 py-4 text-white">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Class</div>
              <div className="text-2xl font-bold">{classKey.toUpperCase()}</div>
              <div className="mt-1 text-sm text-slate-300">{data.nextAction}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.cards.map((card) => (
              <div key={card.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-medium text-slate-500">{card.title}</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{card.value}</div>
                <div className="mt-1 text-sm text-slate-600">{card.hint}</div>
              </div>
            ))}
          </div>
        </div>

        {!data.access.canUseCommunity ? (
          <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <div className="flex items-center gap-2 font-bold">
              <Lock size={18} />
              Community access is restricted
            </div>
            <p className="mt-2 text-sm">
              Adult-only access is required for live sessions, posts, and chat. Your profile remains private until review is complete.
            </p>
          </div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <PanelTitle icon={<Video size={18} />} title="Live sessions" actionHref="/member/live-sessions" actionLabel="Open all" />
            <div className="grid gap-4 md:grid-cols-2">
              {data.liveSessions.slice(0, 4).map((session) => (
                <div key={session.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{session.status}</div>
                  <div className="mt-2 text-lg font-bold text-slate-900">{session.title}</div>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">{session.description ?? "Private class session"}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      {session.startsAt ? new Date(session.startsAt).toLocaleString() : "TBA"}
                    </div>
                    <Link
                      href={`/member/live-sessions/${session.id}`}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Open <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <PanelTitle icon={<Sparkles size={18} />} title="Class posts" actionHref={`/member/classes/${classKey}`} actionLabel="View class" />
            <div className="grid gap-4">
              {data.posts.slice(0, 5).map((post) => (
                <div key={post.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                    {post.pinned ? <span className="rounded-full bg-slate-900 px-2 py-1 text-white">Pinned</span> : null}
                    {post.classKey.toUpperCase()}
                  </div>
                  <div className="mt-2 text-lg font-bold text-slate-900">{post.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{post.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <QuickActionCard
              icon={<Users size={18} />}
              title="Community"
              body="Chat with your class, share posts, and stay updated."
              href={`/member/classes/${classKey}`}
              label="Open class room"
            />
            <QuickActionCard
              icon={<MessageCircle size={18} />}
              title="Live chat"
              body="Discuss session topics in a moderated class chat."
              href={`/member/classes/${classKey}`}
              label="Go to chat"
            />
            <QuickActionCard
              icon={<CalendarDays size={18} />}
              title="Live sessions"
              body="Join scheduled sessions from your class space."
              href="/member/live-sessions"
              label="Browse sessions"
            />
            <QuickActionCard
              icon={<ShieldCheck size={18} />}
              title="Privacy"
              body="Your profile is private and controlled by backend rules."
              href="/member/profile"
              label="Open profile"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function PanelTitle({
  icon,
  title,
  actionHref,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <Link href={actionHref} className="text-sm font-semibold text-slate-700 hover:text-slate-950">
        {actionLabel}
      </Link>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  body,
  href,
  label,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  label: string;
}) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-3 text-white">{icon}</div>
        <div>
          <div className="font-bold text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-600">{body}</div>
        </div>
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
      >
        {label} <PlayCircle size={14} />
      </Link>
    </div>
  );
}