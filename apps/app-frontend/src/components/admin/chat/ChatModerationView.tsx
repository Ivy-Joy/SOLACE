// apps/app-frontend/src/components/admin/chat/ChatModerationView.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  EyeOff,
  Trash2,
  RotateCcw,
  MessageSquare,
  CalendarDays,
  Users,
  Filter,
  Settings2,
} from "lucide-react";

import api from "@/src/lib/api";
import type { DashboardResponse } from "@/src/lib/adminTypes";
import AdminModuleLayout from "@/src/components/admin/shared/AdminModuleLayout";
import EmptyState from "@/src/components/admin/shared/EmptyState";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import Pagination from "@/src/components/admin/shared/Pagination";
import SearchInput from "@/src/components/admin/shared/SearchInput";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";

type ClassKey = "vuka" | "ropes" | "teens" | "mph" | "young";

const CLASS_KEYS: ClassKey[] = ["vuka", "ropes", "teens", "mph", "young"];

const CLASS_LABELS: Record<ClassKey, string> = {
  vuka: "VUKA",
  ropes: "ROPEs",
  teens: "TEENS",
  mph: "MPH",
  young: "YOUNG",
};

type ChatKind = "text" | "system" | "announcement" | "moderation";

type RawChatMessage = {
  id: string;
  classKey: string;
  liveSessionId?: string | null;
  senderMemberId?: string | null;
  senderName?: string;
  senderRole?: string;
  message?: string;
  kind?: string;
  messageType?: string;
  hidden?: boolean;
  deleted?: boolean;
  isDeleted?: boolean;
  moderationReason?: string | null;
  createdAt?: string | null;
};

type ChatMessage = {
  id: string;
  classKey: ClassKey;
  liveSessionId: string | null;
  senderName: string;
  senderRole: string;
  message: string;
  kind: ChatKind;
  hidden: boolean;
  deleted: boolean;
  moderationReason: string | null;
  createdAt: string | null;
};

type LiveSessionRow = {
  id: string;
  title: string;
  classKey: string | null;
  adultOnly: boolean;
  status: string | null;
  startsAt: string | null;
  endsAt: string | null;
  allowChat: boolean;
  meetingUrl: string | null;
};

type PolicyRow = DashboardResponse["insights"]["visibility"][number];

type EditorState = {
  id: string;
  senderName: string;
  classKey: ClassKey;
  kind: ChatKind;
  hidden: boolean;
  deleted: boolean;
  moderationReason: string;
};

function isClassKey(value: string): value is ClassKey {
  return CLASS_KEYS.includes(value as ClassKey);
}

function isChatKind(value: unknown): value is ChatKind {
  return value === "text" || value === "system" || value === "announcement" || value === "moderation";
}

function normalizeMessage(row: RawChatMessage): ChatMessage {
  const classKey = isClassKey(row.classKey) ? row.classKey : "vuka";
  const kind = isChatKind(row.messageType) ? row.messageType : isChatKind(row.kind) ? row.kind : "text";

  return {
    id: row.id,
    classKey,
    liveSessionId: row.liveSessionId ?? null,
    senderName: row.senderName ?? "Unknown sender",
    senderRole: row.senderRole ?? "member",
    message: row.message ?? "",
    kind,
    hidden: Boolean(row.hidden),
    deleted: Boolean(row.isDeleted ?? row.deleted),
    moderationReason: row.moderationReason ?? null,
    createdAt: row.createdAt ?? null,
  };
}

function statusForRow(msg: ChatMessage): string {
  if (msg.deleted) return "deleted";
  if (msg.hidden) return "hidden";
  if (msg.kind === "announcement") return "announcement";
  if (msg.kind === "system") return "system";
  if (msg.kind === "moderation") return "moderation";
  return "active";
}

function typeForRow(msg: ChatMessage): string {
  return msg.kind;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
        <div className="rounded-2xl bg-slate-900 p-3 text-white">{icon}</div>
      </div>
    </div>
  );
}

export default function ChatModerationView({ classKey }: { classKey?: ClassKey }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [liveSessions, setLiveSessions] = useState<LiveSessionRow[]>([]);
  const [policies, setPolicies] = useState<PolicyRow[]>([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "member" | "leader" | "admin">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "hidden" | "deleted" | "announcement" | "system" | "moderation"
  >("all");
  const [classFilter, setClassFilter] = useState<ClassKey | "all">(classKey ?? "all");
  const [page, setPage] = useState(1);

  const [editor, setEditor] = useState<EditorState | null>(null);

  const scope = classKey ? "class" : "all";
  const selectedClassKey = classKey ?? (classFilter === "all" ? null : classFilter);

  const tabs = useMemo(
    () => [
      { label: "All", href: "/admin/chat" },
      ...CLASS_KEYS.map((k) => ({
        label: CLASS_LABELS[k],
        href: `/admin/chat/${k}`,
      })),
    ],
    []
  );

  async function load() {
    setLoading(true);
    try {
      const dashPromise = api.get<DashboardResponse>("/admin/dashboard/metrics");
      const policiesPromise = api.get<{ items: PolicyRow[] }>("/admin/policies");
      const livePromise = api.get<{ items: LiveSessionRow[] }>("/admin/live-sessions");

      const chatPromises = classKey
        ? [api.get<{ items: RawChatMessage[] }>(`/admin/chat/${classKey}`)]
        : CLASS_KEYS.map((k) => api.get<{ items: RawChatMessage[] }>(`/admin/chat/${k}`));

      const [dashRes, policiesRes, liveRes, ...chatRes] = await Promise.all([
        dashPromise,
        policiesPromise,
        livePromise,
        ...chatPromises,
      ]);

      const merged = chatRes.flatMap((res) => res.items.map(normalizeMessage));

      setDashboard(dashRes);
      setPolicies(policiesRes.items ?? []);
      setLiveSessions(liveRes.items ?? []);
      setMessages(merged.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }));
    } catch (err) {
      console.error("Chat moderation load failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classKey, router]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter, classFilter]);

  const summary = useMemo(() => {
    const filteredClass = classKey ? messages.filter((m) => m.classKey === classKey) : messages;
    const active = filteredClass.filter((m) => !m.hidden && !m.deleted).length;
    const hidden = filteredClass.filter((m) => m.hidden && !m.deleted).length;
    const deleted = filteredClass.filter((m) => m.deleted).length;
    const announcements = filteredClass.filter((m) => m.kind === "announcement").length;
    const moderation = filteredClass.filter((m) => m.kind === "moderation").length;
    const live = classKey
      ? liveSessions.filter((s) => s.classKey === classKey).length
      : liveSessions.length;
    const adultOnly = classKey
      ? liveSessions.filter((s) => s.classKey === classKey && s.adultOnly).length
      : liveSessions.filter((s) => s.adultOnly).length;

    return { active, hidden, deleted, announcements, moderation, live, adultOnly };
  }, [classKey, liveSessions, messages]);

  const selectedPolicy = useMemo(() => {
    if (!selectedClassKey) return null;
    return policies.find((p) => p.classKey === selectedClassKey) ?? null;
  }, [policies, selectedClassKey]);

  const filteredMessages = useMemo(() => {
    let rows = [...messages];

    if (classFilter !== "all") {
      rows = rows.filter((m) => m.classKey === classFilter);
    }

    if (roleFilter !== "all") {
      rows = rows.filter((m) => m.senderRole === roleFilter);
    }

    if (statusFilter !== "all") {
      rows = rows.filter((m) => statusForRow(m) === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((m) => {
        return (
          m.senderName.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q) ||
          m.classKey.toLowerCase().includes(q) ||
          m.senderRole.toLowerCase().includes(q) ||
          (m.moderationReason ?? "").toLowerCase().includes(q)
        );
      });
    }

    if (classKey) {
      rows = rows.filter((m) => m.classKey === classKey);
    }

    return rows;
  }, [classFilter, classKey, messages, roleFilter, search, statusFilter]);

  const limit = 12;
  const total = filteredMessages.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pageItems = filteredMessages.slice((page - 1) * limit, page * limit);

  async function saveModeration() {
    if (!editor) return;
    setSavingId(editor.id);
    try {
      await api.patch(`/admin/chat/${editor.id}`, {
        hidden: editor.hidden,
        deleted: editor.deleted,
        kind: editor.kind,
        moderationReason: editor.moderationReason.trim() || null,
      });
      setEditor(null);
      await load();
    } catch (err) {
      console.error("Failed to moderate message", err);
    } finally {
      setSavingId(null);
    }
  }

  const title = classKey
    ? `Chat moderation: ${CLASS_LABELS[classKey]}`
    : "Chat moderation";

  const description = classKey
    ? `Review and moderate the ${CLASS_LABELS[classKey]} class chat, live sessions, and visibility settings.`
    : "Review every class chat, apply moderation, and monitor live engagement from one place.";

  return (
    <AdminModuleLayout
      title={title}
      description={description}
      backHref="/admin/dashboard"
      backLabel="Dashboard"
      primaryAction={
        classKey
          ? { label: "All chats", href: "/admin/chat" }
          : { label: "Open class view", href: "/admin/chat/vuka" }
      }
      secondaryAction={
        classKey
          ? { label: "Live sessions", href: "/admin/live-sessions" }
          : { label: "Policies", href: "/admin/policies" }
      }
      tabs={tabs}
    >
      {loading ? (
        <LoadingState label="Loading chat moderation..." />
      ) : !dashboard ? (
        <EmptyState
          title="No chat data"
          description="Check backend connectivity, admin token validity, and chat route permissions."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <MetricCard label="Messages" value={classKey ? total : dashboard.totals.chatMessages} icon={<MessageSquare size={18} />} />
            <MetricCard label="Active" value={summary.active} icon={<Users size={18} />} />
            <MetricCard label="Hidden" value={summary.hidden} icon={<EyeOff size={18} />} />
            <MetricCard label="Deleted" value={summary.deleted} icon={<Trash2 size={18} />} />
            <MetricCard label="Announcements" value={summary.announcements} icon={<CalendarDays size={18} />} />
            <MetricCard label="Moderation events" value={summary.moderation} icon={<ShieldAlert size={18} />} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Live sessions" value={summary.live} icon={<CalendarDays size={18} />} />
            <MetricCard label="Adult-only sessions" value={summary.adultOnly} icon={<Settings2 size={18} />} />
            <MetricCard label="Visible posts" value={summary.active} icon={<MessageSquare size={18} />} />
            <MetricCard label="Filter scope" value={classKey ? CLASS_LABELS[classKey] : "All classes"} icon={<Filter size={18} />} />
          </div>

          {!classKey ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {CLASS_KEYS.map((k) => {
                const classCount = messages.filter((m) => m.classKey === k).length;
                const hiddenCount = messages.filter((m) => m.classKey === k && m.hidden && !m.deleted).length;
                const deletedCount = messages.filter((m) => m.classKey === k && m.deleted).length;

                return (
                  <Link
                    key={k}
                    href={`/admin/chat/${k}`}
                    className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                          {CLASS_LABELS[k]}
                        </div>
                        <div className="mt-2 text-2xl font-black text-slate-900">{classCount}</div>
                        <div className="mt-1 text-sm text-slate-500">messages</div>
                      </div>
                      <div className="rounded-2xl bg-slate-900 p-3 text-white">
                        <MessageSquare size={18} />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="rounded-xl bg-slate-50 p-3">Hidden {hiddenCount}</div>
                      <div className="rounded-xl bg-slate-50 p-3">Deleted {deletedCount}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Messages</h2>
                  <p className="text-sm text-slate-500">
                    Search, filter, and moderate messages without leaving this screen.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void load()}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
                <SearchInput value={search} onChange={setSearch} placeholder="Search sender, message, reason..." />

                {!classKey ? (
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value as ClassKey | "all")}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[var(--gs-gold)] focus:ring-2 focus:ring-[rgba(224,190,83,0.2)]"
                  >
                    <option value="all">All classes</option>
                    {CLASS_KEYS.map((k) => (
                      <option key={k} value={k}>
                        {CLASS_LABELS[k]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
                    {CLASS_LABELS[classKey]}
                  </div>
                )}

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[var(--gs-gold)] focus:ring-2 focus:ring-[rgba(224,190,83,0.2)]"
                >
                  <option value="all">All roles</option>
                  <option value="member">Member</option>
                  <option value="leader">Leader</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[var(--gs-gold)] focus:ring-2 focus:ring-[rgba(224,190,83,0.2)]"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="hidden">Hidden</option>
                  <option value="deleted">Deleted</option>
                  <option value="announcement">Announcement</option>
                  <option value="system">System</option>
                  <option value="moderation">Moderation</option>
                </select>
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.22em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Sender</th>
                        <th className="px-4 py-3">Message</th>
                        <th className="px-4 py-3">Meta</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pageItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8">
                            <EmptyState
                              title="No messages found"
                              description="Try a different search term or switch filters."
                            />
                          </td>
                        </tr>
                      ) : (
                        pageItems.map((msg) => {
                          const rowStatus = statusForRow(msg);

                          return (
                            <tr key={msg.id} className="border-t border-slate-100 align-top">
                              <td className="px-4 py-4">
                                <div className="font-semibold text-slate-900">{msg.senderName}</div>
                                <div className="text-xs text-slate-500">
                                  {msg.senderRole} · {CLASS_LABELS[msg.classKey]}
                                </div>
                              </td>

                              <td className="px-4 py-4">
                                <div className="max-w-[420px] whitespace-pre-wrap text-slate-800">
                                  {msg.message}
                                </div>
                                {msg.moderationReason ? (
                                  <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                                    <ShieldAlert size={12} />
                                    {msg.moderationReason}
                                  </div>
                                ) : null}
                              </td>

                              <td className="px-4 py-4">
                                <div className="flex flex-wrap gap-2">
                                  <StatusBadge status={typeForRow(msg)} />
                                  {msg.liveSessionId ? (
                                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                                      Live session
                                    </span>
                                  ) : null}
                                </div>
                              </td>

                              <td className="px-4 py-4">
                                <StatusBadge status={rowStatus} />
                              </td>

                              <td className="px-4 py-4 text-xs text-slate-500">
                                {formatDate(msg.createdAt)}
                              </td>

                              <td className="px-4 py-4">
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditor({
                                        id: msg.id,
                                        senderName: msg.senderName,
                                        classKey: msg.classKey,
                                        kind: msg.kind,
                                        hidden: msg.hidden,
                                        deleted: msg.deleted,
                                        moderationReason: msg.moderationReason ?? "",
                                      })
                                    }
                                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                                  >
                                    Moderate
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-slate-100 p-4">
                  <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  <h3 className="text-lg font-bold text-slate-900">Live sessions</h3>
                </div>

                <div className="mt-4 grid gap-3">
                  {(classKey
                    ? liveSessions.filter((s) => s.classKey === classKey)
                    : liveSessions
                  ).slice(0, 5).map((session) => (
                    <div key={session.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="font-semibold text-slate-900">{session.title}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        {session.classKey ? CLASS_LABELS[session.classKey as ClassKey] : "No class"} ·{" "}
                        {session.status ?? "unknown"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {session.adultOnly ? "Adult-only" : "Open"} · {session.allowChat ? "Chat on" : "Chat off"}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Settings2 size={18} />
                  <h3 className="text-lg font-bold text-slate-900">Visibility policy</h3>
                </div>

                {selectedPolicy ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                    <div className="text-sm font-semibold text-slate-900">
                      {selectedPolicy.classKey.toUpperCase()}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">{selectedPolicy.visibilityScope}</div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div className="rounded-xl bg-slate-50 p-3">
                        Adult live: {selectedPolicy.adultOnlyLiveSessions ? "Yes" : "No"}
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        Posts: {selectedPolicy.allowClassPosts ? "Yes" : "No"}
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        Chat: {selectedPolicy.allowClassChat ? "Yes" : "No"}
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        Discovery: {selectedPolicy.allowPeerDiscovery ? "Yes" : "No"}
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-slate-500">
                      Moderation: {selectedPolicy.moderationEnabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    Select a class to see its policy.
                  </div>
                )}
              </section>
            </aside>
          </div>
        </div>
      )}

      {editor ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Moderate message
                </div>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{editor.senderName}</h3>
                <p className="text-sm text-slate-500">{CLASS_LABELS[editor.classKey]}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditor(null)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={editor.hidden}
                  onChange={(e) => setEditor({ ...editor, hidden: e.target.checked })}
                />
                <span className="text-sm font-semibold text-slate-800">Hidden</span>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={editor.deleted}
                  onChange={(e) => setEditor({ ...editor, deleted: e.target.checked })}
                />
                <span className="text-sm font-semibold text-slate-800">Deleted</span>
              </label>

              <label className="md:col-span-2">
                <div className="mb-2 text-sm font-semibold text-slate-700">Message type</div>
                <select
                  value={editor.kind}
                  onChange={(e) => setEditor({ ...editor, kind: e.target.value as ChatKind })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="text">Text</option>
                  <option value="system">System</option>
                  <option value="announcement">Announcement</option>
                  <option value="moderation">Moderation</option>
                </select>
              </label>

              <label className="md:col-span-2">
                <div className="mb-2 text-sm font-semibold text-slate-700">Moderation reason</div>
                <textarea
                  value={editor.moderationReason}
                  onChange={(e) => setEditor({ ...editor, moderationReason: e.target.value })}
                  rows={4}
                  placeholder="Explain why this message was moderated..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditor(null)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveModeration()}
                disabled={savingId === editor.id}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {savingId === editor.id ? "Saving..." : "Save moderation"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminModuleLayout>
  );
}