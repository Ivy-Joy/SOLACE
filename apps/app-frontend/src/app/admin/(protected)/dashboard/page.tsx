"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/src/lib/api";
import type { DashboardResponse } from "@/src/lib/adminTypes";
import MetricCards from "@/src/components/admin/dashboard/MetricCards";
import AdminPageHeader from "@/src/components/admin/layout/AdminPageHeader";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import EmptyState from "@/src/components/admin/shared/EmptyState";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  HeartHandshake,
  ScrollText,
  CalendarDays,
  ShieldCheck,
  Plus,
  BookOpen,
  HeartPulse,
  Settings2,
  BarChart3,
  MessageSquare,
  Layers3,
  BadgeCheck,
} from "lucide-react";

type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    async function load() {
      try {
        const res = await api.get<DashboardResponse>("/admin/dashboard/metrics");
        setData(res);
      } catch {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [router]);

  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        title: "Manage Members",
        description: "List, review, edit statuses, tags, and profiles.",
        href: "/admin/members",
        icon: <Users size={18} />,
      },
      {
        title: "Review Leads",
        description: "Screen, approve, reject, and update lead notes.",
        href: "/admin/leads",
        icon: <HeartHandshake size={18} />,
      },
      {
        title: "Moderate Prayers",
        description: "Answer, hide, unhide, escalate, or clear escalation.",
        href: "/admin/prayers",
        icon: <ScrollText size={18} />,
      },
      {
        title: "Manage Events",
        description: "Create, edit, publish, and archive events.",
        href: "/admin/events",
        icon: <CalendarDays size={18} />,
      },
      {
        title: "Audit Logs",
        description: "Track every admin action and status change.",
        href: "/admin/audit",
        icon: <ShieldCheck size={18} />,
      },
      {
        title: "Class Enrolments",
        description: "Review applications and approvals by class.",
        href: "/admin/enrollments",
        icon: <Layers3 size={18} />,
      },
      {
        title: "Discipleship Funnel",
        description: "Move members through journey stages.",
        href: "/admin/funnel",
        icon: <BookOpen size={18} />,
      },
      {
        title: "Counselling Cases",
        description: "Triaging, follow-up, and pastoral care tracking.",
        href: "/admin/counselling",
        icon: <HeartPulse size={18} />,
      },
      {
        title: "Class Policies",
        description: "Control visibility, moderation, and adult-only settings.",
        href: "/admin/policies",
        icon: <Settings2 size={18} />,
      },
      {
        title: "Live Sessions",
        description: "Manage scheduled and live class sessions.",
        href: "/admin/live-sessions",
        icon: <BadgeCheck size={18} />,
      },
      {
        title: "Chat Moderation",
        description: "Review announcements, hidden content, and deleted messages.",
        href: "/admin/chat",
        icon: <MessageSquare size={18} />,
      },
      {
        title: "Analytics",
        description: "View class activity, giving, and engagement trends.",
        href: "/admin/dashboard",
        icon: <BarChart3 size={18} />,
      },
    ],
    []
  );

  if (loading) return <LoadingState label="Loading dashboard..." />;

  if (!data) {
    return (
      <EmptyState
        title="No dashboard data"
        description="Check backend connectivity, admin token validity, and API permissions."
      />
    );
  }

  const counsellingData = Object.entries(data.insights.counselling).map(([label, value]) => ({
    label,
    value,
  }));

  const funnelData = Object.entries(data.insights.journeyFunnel).map(([label, value]) => ({
    label,
    value,
  }));

  //const maxChat = Math.max(...data.insights.chatActivity7d.map((p) => p.value), 1);
  const chatActivity7d = data.insights.chatActivity7d ?? [];
  const maxChat = Math.max(...chatActivity7d.map((p) => p.value), 1);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Control center for members, prayers, leads, events, moderation, counselling, discipleship, and reporting."
      />

      <MetricCards totals={data.totals} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-900 p-3 text-white">{item.icon}</div>
                <div>
                  <div className="text-base font-bold text-slate-900">{item.title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">{item.description}</div>
                </div>
              </div>
              <Plus className="mt-1 text-slate-400 transition group-hover:text-slate-900" size={18} />
            </div>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Signups last 7 days"
          action={
            <button
              type="button"
              onClick={() => router.push("/admin/members")}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
            >
              Open members
            </button>
          }
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.series.signups7d}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0a0a0b" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Prayers last 7 days"
          action={
            <button
              type="button"
              onClick={() => router.push("/admin/prayers")}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
            >
              Open prayers
            </button>
          }
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.series.prayers7d}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#111827" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Members by class">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byClass}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#111827" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Discipleship funnel">
          <div className="grid gap-3 sm:grid-cols-2">
            {funnelData.map((row) => (
              <StatBox key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Counselling overview">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatBox label="Urgent" value={data.insights.counselling.urgent} />
            <StatBox label="Normal" value={data.insights.counselling.normal} />
            <StatBox label="Open" value={data.insights.counselling.open} />
            <StatBox label="Triaged" value={data.insights.counselling.triaged} />
            <StatBox label="Assigned" value={data.insights.counselling.assigned} />
            <StatBox label="Resolved" value={data.insights.counselling.resolved} />
            <StatBox label="Closed" value={data.insights.counselling.closed} />
          </div>

          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={counsellingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f172a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Giving and engagement">
          <div className="grid gap-3 sm:grid-cols-2">
            <StatBox label="Retained donors" value={data.insights.giving.retained} />
            <StatBox label="Lapsed donors" value={data.insights.giving.lapsed} />
            <StatBox label="Retention rate" value={`${data.insights.giving.retentionRate}%`} />
            <StatBox label="Total giving" value={`KES ${data.insights.giving.totalAmount.toLocaleString()}`} />
            <StatBox label="Gift count" value={data.insights.giving.giftCount} />
            <StatBox label="Live sessions" value={data.insights.engagement.liveSessions} />
            <StatBox label="Chat messages" value={data.insights.engagement.chatMessages} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Chat activity heatmap">
          {chatActivity7d.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              No chat activity data yet.
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-7">
              {data.insights.chatActivity7d.map((cell) => {
                const intensity = Math.max(cell.value / maxChat, 0.08);
                return (
                  <div
                    key={cell.label}
                    className="rounded-2xl border border-slate-200 p-4 text-center"
                    style={{
                      backgroundColor: `rgba(15, 23, 42, ${intensity})`,
                      color: intensity > 0.45 ? "white" : "inherit",
                    }}
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-75">
                      {cell.label}
                    </div>
                    <div className="mt-2 text-2xl font-black">{cell.value}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        <Panel title="Class visibility policies">
          {data.insights.visibility.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              No class visibility policies found.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {data.insights.visibility.map((policy) => (
                <div key={policy.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-bold text-slate-900">
                        {policy.classKey.toUpperCase()}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">{policy.visibilityScope}</div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {policy.moderationEnabled ? "Moderation on" : "Moderation off"}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="rounded-xl bg-slate-50 p-3">
                      Adult live: {policy.adultOnlyLiveSessions ? "Yes" : "No"}
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      Posts: {policy.allowClassPosts ? "Yes" : "No"}
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      Chat: {policy.allowClassChat ? "Yes" : "No"}
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      Discovery: {policy.allowPeerDiscovery ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Recent activity"
          action={
            <Link href="/admin/audit" className="text-sm font-semibold text-slate-700 hover:text-slate-950">
              View all logs
            </Link>
          }
        >
          <div className="grid gap-3">
            {data.recent.audit.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                No recent audit entries.
              </div>
            ) : (
              data.recent.audit.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{item.action}</div>
                      <div className="text-sm text-slate-500">{item.targetType ?? "System"}</div>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {item.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel
          title="Event operations"
          action={
            <Link
              href="/admin/events/new"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Create event
            </Link>
          }
        >
          <div className="grid gap-3">
            <Link href="/admin/events" className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <CalendarDays size={18} />
                <div>
                  <div className="font-semibold text-slate-900">List & edit events</div>
                  <div className="text-sm text-slate-500">Open the event manager, edit details, publish updates.</div>
                </div>
              </div>
            </Link>

            <Link href="/admin/events" className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <BadgeCheck size={18} />
                <div>
                  <div className="font-semibold text-slate-900">Registrations and check-in</div>
                  <div className="text-sm text-slate-500">Review registrations and attendance.</div>
                </div>
              </div>
            </Link>

            <Link href="/admin/events" className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} />
                <div>
                  <div className="font-semibold text-slate-900">Bulk email</div>
                  <div className="text-sm text-slate-500">Send announcements to attendees and registrants.</div>
                </div>
              </div>
            </Link>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Recent members"
          action={
            <Link href="/admin/members" className="text-sm font-semibold text-slate-700 hover:text-slate-950">
              View all members
            </Link>
          }
        >
          <div className="grid gap-3">
            {data.recent.members.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                No recent member activity.
              </div>
            ) : (
              data.recent.members.map((member) => (
                <div key={member.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{member.fullName}</div>
                      <div className="text-sm text-slate-500">
                        {member.phone} {member.email ? `• ${member.email}` : ""}
                      </div>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {member.status}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    Class: {member.preferredClass ?? "unassigned"} · Verified: {member.phoneVerified ? "Yes" : "No"}
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel
          title="Recent prayers"
          action={
            <Link href="/admin/prayers" className="text-sm font-semibold text-slate-700 hover:text-slate-950">
              View all prayers
            </Link>
          }
        >
          <div className="grid gap-3">
            {data.recent.prayers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                No recent prayer activity.
              </div>
            ) : (
              data.recent.prayers.map((prayer) => (
                <div key={prayer.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{prayer.title || "Untitled prayer"}</div>
                      <div className="text-sm text-slate-500">
                        {prayer.excerpt || prayer.text.slice(0, 120)}
                      </div>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {prayer.answered ? "Answered" : prayer.hidden ? "Hidden" : prayer.escalated ? "Escalated" : "Open"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Recent leads"
          action={
            <Link href="/admin/leads" className="text-sm font-semibold text-slate-700 hover:text-slate-950">
              View all leads
            </Link>
          }
        >
          <div className="grid gap-3">
            {data.recent.leads.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                No recent leads.
              </div>
            ) : (
              data.recent.leads.map((lead) => (
                <div key={lead.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{lead.fullName}</div>
                      <div className="text-sm text-slate-500">
                        {lead.phone ?? "No phone"} {lead.email ? `• ${lead.email}` : ""}
                      </div>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {lead.status}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    Class: {lead.preferredClass ?? "none"} · Stage: {lead.spiritualStage ?? "unknown"}
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel
          title="Command center summary"
          action={
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
            >
              Refresh view
            </button>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <StatBox label="Events" value={data.totals.eventsTotal} />
            <StatBox label="Class enrolments" value={data.totals.classEnrollments} />
            <StatBox label="Counselling cases" value={data.totals.counsellingCases} />
            <StatBox label="Donor records" value={data.totals.donorRecords} />
            <StatBox label="Live sessions" value={data.totals.liveSessions} />
            <StatBox label="Chat messages" value={data.totals.chatMessages} />
          </div>
        </Panel>
      </div>
    </div>
  );
}