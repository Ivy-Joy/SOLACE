//src/components/member/profile/MemberProfilePage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/src/lib/api";
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Lock,
  PencilLine,
  ShieldCheck,
  Sparkles,
  Users,
  UserCircle2,
  Save,
  RefreshCw,
  MessageCircle,
} from "lucide-react";

type MemberProfile = {
  id: string;
  fullName: string;
  phone: string;
  phoneVerified: boolean;
  email: string | null;
  dob: string | null;
  age: number | null;
  country: string | null;
  city: string | null;
  area: string | null;
  preferredClass: "vuka" | "ropes" | "teens" | "mph" | "young" | null;
  gifts: string[];
  skills: string[];
  ministries: string[];
  languages: string[];
  mentorId: string | null;
  spiritualStage: "seeker" | "new_believer" | "growing" | "mature";
  roles: string[];
  source: string | null;
  status: "pending" | "approved" | "rejected" | "archived";
  points: number;
  tags: string[];
  onboarding: {
    checklist: { stepId: string; completed?: boolean; completedAt?: string | null }[];
    buddyId: string | null;
    progress: { completed: number; total: number; percent: number };
  };
  parentalConsent: {
    required: boolean;
    given: boolean;
    consentRecordId: string | null;
    parentName: string | null;
    parentPhone: string | null;
    parentEmail: string | null;
    submittedAt: string | null;
    verifiedAt: string | null;
  } | null;
  privacy: {
    visibility: string;
    profileLocked: boolean;
    profileVisible: boolean;
  };
  summary: {
    isAdult: boolean;
    canJoinCommunityInteractions: boolean;
    canSeePeers: boolean;
    nextAction: string;
  };
  createdAt: string | null;
  updatedAt: string | null;
};

type DashboardResponse = {
  profile: MemberProfile;
  cards: { title: string; value: string; hint: string }[];
  permissions: {
    canJoinLiveSessions: boolean;
    canSeePeers: boolean;
    canMessageLeaders: boolean;
  };
  nextAction: string;
};

function csv(value: string[]) {
  return value.join(", ");
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function badgeTone(status: string) {
  const s = status.toLowerCase();
  if (s === "approved" || s === "active" || s === "verified") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "pending" || s === "draft") return "bg-amber-50 text-amber-700 border-amber-200";
  if (s === "rejected" || s === "archived") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function MemberProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"overview" | "identity" | "growth" | "privacy">("overview");
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    country: "",
    city: "",
    area: "",
    preferredClass: "",
    gifts: "",
    skills: "",
    ministries: "",
    languages: "",
    spiritualStage: "seeker",
  });

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
        const res = await api.get<DashboardResponse>("/member/dashboard");
        if (!mounted) return;
        setData(res);
        setForm({
          email: res.profile.email ?? "",
          country: res.profile.country ?? "",
          city: res.profile.city ?? "",
          area: res.profile.area ?? "",
          preferredClass: res.profile.preferredClass ?? "",
          gifts: csv(res.profile.gifts ?? []),
          skills: csv(res.profile.skills ?? []),
          ministries: csv(res.profile.ministries ?? []),
          languages: csv(res.profile.languages ?? []),
          spiritualStage: res.profile.spiritualStage ?? "seeker",
        });
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

  const profile = data?.profile;

  const cards = useMemo(() => data?.cards ?? [], [data]);

  async function saveProfile() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.patch<{ ok: boolean; profile: MemberProfile | null }>("/member/me", {
        email: form.email || null,
        country: form.country || null,
        city: form.city || null,
        area: form.area || null,
        preferredClass: form.preferredClass || null,
        gifts: splitCsv(form.gifts),
        skills: splitCsv(form.skills),
        ministries: splitCsv(form.ministries),
        languages: splitCsv(form.languages),
        spiritualStage: form.spiritualStage,
      });

      if (res.profile) {
        setData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            profile: res.profile as MemberProfile,
          };
      });
    }

      setMessage("Profile saved.");
    } catch {
      setMessage("Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function refresh() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.get<DashboardResponse>("/member/dashboard");
      setData(res);
      setForm({
        email: res.profile.email ?? "",
        country: res.profile.country ?? "",
        city: res.profile.city ?? "",
        area: res.profile.area ?? "",
        preferredClass: res.profile.preferredClass ?? "",
        gifts: csv(res.profile.gifts ?? []),
        skills: csv(res.profile.skills ?? []),
        ministries: csv(res.profile.ministries ?? []),
        languages: csv(res.profile.languages ?? []),
        spiritualStage: res.profile.spiritualStage ?? "seeker",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          Loading member profile...
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
                Member profile
              </div>
              <div className="mt-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {profile.fullName}
                </h1>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone(profile.status)}`}
                >
                  {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Your private profile, onboarding status, growth data, and class access live here.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 px-5 py-4 text-white">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Class</div>
              <div className="text-2xl font-bold">{profile.preferredClass?.toUpperCase() ?? "UNASSIGNED"}</div>
              <div className="mt-1 text-sm text-slate-300">{profile.summary.nextAction}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              ["overview", "Overview"],
              ["identity", "Identity"],
              ["growth", "Growth"],
              ["privacy", "Privacy"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key as typeof tab)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  tab === key
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            {tab === "overview" ? (
              <>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {cards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="text-sm font-medium text-slate-500">{card.title}</div>
                      <div className="mt-2 text-2xl font-bold text-slate-900">{card.value}</div>
                      <div className="mt-1 text-sm text-slate-600">{card.hint}</div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <StatCard icon={<ShieldCheck size={18} />} title="Profile lock" value={profile.privacy.profileLocked ? "Locked" : "Open"} />
                  <StatCard icon={<Users size={18} />} title="Peer access" value={profile.summary.canSeePeers ? "Allowed" : "Restricted"} />
                  <StatCard icon={<MessageCircle size={18} />} title="Community" value={profile.summary.canJoinCommunityInteractions ? "Enabled" : "Waiting"} />
                  <StatCard icon={<BookOpen size={18} />} title="Progress" value={`${profile.onboarding.progress.percent}%`} />
                </div>
              </>
            ) : null}

            {tab === "identity" ? (
              <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <UserCircle2 size={18} />
                  <h2 className="text-lg font-bold text-slate-900">Identity and contact</h2>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Full name" value={profile.fullName} disabled />
                  <Field label="Phone" value={profile.phone} disabled />
                  <Field label="DOB" value={profile.dob ? new Date(profile.dob).toLocaleDateString() : ""} disabled />
                  <Field label="Email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} />
                  <Field label="Country" value={form.country} onChange={(v) => setForm((p) => ({ ...p, country: v }))} />
                  <Field label="City" value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />
                  <Field label="Area" value={form.area} onChange={(v) => setForm((p) => ({ ...p, area: v }))} />
                  <Field
                    label="Preferred class"
                    value={form.preferredClass}
                    onChange={(v) => setForm((p) => ({ ...p, preferredClass: v }))}
                    helper="Backend remains source of truth"
                  />
                </div>
              </div>
            ) : null}

            {tab === "growth" ? (
              <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} />
                  <h2 className="text-lg font-bold text-slate-900">Growth profile</h2>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Gifts" value={form.gifts} onChange={(v) => setForm((p) => ({ ...p, gifts: v }))} helper="Comma-separated" />
                  <Field label="Skills" value={form.skills} onChange={(v) => setForm((p) => ({ ...p, skills: v }))} helper="Comma-separated" />
                  <Field label="Ministries" value={form.ministries} onChange={(v) => setForm((p) => ({ ...p, ministries: v }))} helper="Comma-separated" />
                  <Field label="Languages" value={form.languages} onChange={(v) => setForm((p) => ({ ...p, languages: v }))} helper="Comma-separated" />
                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">Spiritual stage</span>
                    <select
                      value={form.spiritualStage}
                      onChange={(e) => setForm((p) => ({ ...p, spiritualStage: e.target.value }))}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                    >
                      <option value="seeker">seeker</option>
                      <option value="new_believer">new_believer</option>
                      <option value="growing">growing</option>
                      <option value="mature">mature</option>
                    </select>
                  </label>
                </div>
              </div>
            ) : null}

            {tab === "privacy" ? (
              <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Lock size={18} />
                  <h2 className="text-lg font-bold text-slate-900">Privacy and visibility</h2>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <StatCard icon={<Lock size={18} />} title="Visibility" value={profile.privacy.visibility} />
                  <StatCard icon={<ShieldCheck size={18} />} title="Phone verified" value={profile.phoneVerified ? "Yes" : "No"} />
                  <StatCard icon={<BadgeCheck size={18} />} title="Public access" value="Disabled" />
                  <StatCard icon={<CalendarDays size={18} />} title="Next action" value={profile.summary.nextAction} />
                </div>

                {profile.parentalConsent ? (
                  <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-sm font-bold text-slate-900">Parental consent</div>
                    <div className="mt-3 grid gap-2 text-sm text-slate-700">
                      <Row label="Required" value={String(profile.parentalConsent.required)} />
                      <Row label="Given" value={String(profile.parentalConsent.given)} />
                      <Row label="Parent name" value={profile.parentalConsent.parentName ?? "—"} />
                      <Row label="Parent phone" value={profile.parentalConsent.parentPhone ?? "—"} />
                      <Row label="Parent email" value={profile.parentalConsent.parentEmail ?? "—"} />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <PencilLine size={18} />
                <h2 className="text-lg font-bold text-slate-900">Actions</h2>
              </div>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save profile"}
                </button>

                <button
                  type="button"
                  onClick={refresh}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>

                <Link
                  href="/member/sessions"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <CalendarDays size={16} />
                  Live sessions
                </Link>
              </div>

              {message ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {message}
                </div>
              ) : null}
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-bold text-slate-900">Checklist progress</div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-900"
                  style={{ width: `${profile.onboarding.progress.percent}%` }}
                />
              </div>
              <div className="mt-3 text-sm text-slate-600">
                {profile.onboarding.progress.completed} of {profile.onboarding.progress.total} steps complete
              </div>

              <div className="mt-4 space-y-3">
                {(profile.onboarding.checklist ?? []).map((step) => (
                  <div key={step.stepId} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">{step.stepId}</span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${step.completed ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                      {step.completed ? "Done" : "Open"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-bold text-slate-900">Access summary</div>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <Row label="Adult" value={String(profile.summary.isAdult)} />
                <Row label="Can see peers" value={String(profile.summary.canSeePeers)} />
                <Row label="Can join interactions" value={String(profile.summary.canJoinCommunityInteractions)} />
                <Row label="Points" value={String(profile.points)} />
                <Row label="Roles" value={(profile.roles ?? []).join(", ") || "member"} />
                <Row label="Tags" value={(profile.tags ?? []).join(", ") || "—"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled = false,
  helper,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  helper?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:text-slate-500"
      />
      {helper ? <span className="text-xs text-slate-500">{helper}</span> : null}
    </label>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-3 text-white">{icon}</div>
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-1 text-lg font-bold text-slate-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2 last:border-b-0">
      <span className="text-slate-500">{label}</span>
      <span className="max-w-[60%] text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}