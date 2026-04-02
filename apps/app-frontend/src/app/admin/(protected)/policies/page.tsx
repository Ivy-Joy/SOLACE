// apps/app-frontend/src/app/admin/(protected)/policies/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/src/lib/api";
import AdminModuleLayout from "@/src/components/admin/shared/AdminModuleLayout";
import EmptyState from "@/src/components/admin/shared/EmptyState";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";
import { ShieldCheck, Settings2, MessageSquare, Users, Eye, Save } from "lucide-react";

type PolicyRow = {
  id: string;
  classKey: string;
  visibilityScope: string;
  adultOnlyLiveSessions: boolean;
  allowClassPosts: boolean;
  allowClassChat: boolean;
  allowPeerDiscovery: boolean;
  moderationEnabled: boolean;
  updatedAt: string | null;
};

type PagedResponse = {
  items: PolicyRow[];
};

type EditState = {
  classKey: string;
  visibilityScope: string;
  adultOnlyLiveSessions: boolean;
  allowClassPosts: boolean;
  allowClassChat: boolean;
  allowPeerDiscovery: boolean;
  moderationEnabled: boolean;
};

function StatCard({
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

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PolicyRow[]>([]);
  const [savingClassKey, setSavingClassKey] = useState<string | null>(null);

  const [edit, setEdit] = useState<EditState | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<PagedResponse>("/admin/policies");
      setItems(res.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!edit && items.length > 0) {
      const first = items[0];
      setEdit({
        classKey: first.classKey,
        visibilityScope: first.visibilityScope,
        adultOnlyLiveSessions: first.adultOnlyLiveSessions,
        allowClassPosts: first.allowClassPosts,
        allowClassChat: first.allowClassChat,
        allowPeerDiscovery: first.allowPeerDiscovery,
        moderationEnabled: first.moderationEnabled,
      });
    }
  }, [edit, items]);

  const stats = useMemo(() => {
    const total = items.length;
    const adultOnly = items.filter((p) => p.adultOnlyLiveSessions).length;
    const moderated = items.filter((p) => p.moderationEnabled).length;
    const chatOn = items.filter((p) => p.allowClassChat).length;
    const postsOn = items.filter((p) => p.allowClassPosts).length;
    return { total, adultOnly, moderated, chatOn, postsOn };
  }, [items]);

  async function save() {
    if (!edit) return;
    setSavingClassKey(edit.classKey);
    try {
      await api.patch(`/admin/policies/${edit.classKey}`, {
        visibilityScope: edit.visibilityScope,
        adultOnlyLiveSessions: edit.adultOnlyLiveSessions,
        allowClassPosts: edit.allowClassPosts,
        allowClassChat: edit.allowClassChat,
        allowPeerDiscovery: edit.allowPeerDiscovery,
        moderationEnabled: edit.moderationEnabled,
      });
      await load();
    } finally {
      setSavingClassKey(null);
    }
  }

  const selected = edit ? items.find((p) => p.classKey === edit.classKey) ?? null : null;

  return (
    <AdminModuleLayout
      title="Class policies"
      description="Control class visibility, adult-only sessions, chat access, posting rules, and moderation."
      backHref="/admin/dashboard"
      backLabel="Dashboard"
      primaryAction={{ label: "Save changes", href: "/admin/policies" }}
      secondaryAction={{ label: "Live sessions", href: "/admin/live-sessions" }}
      tabs={[
        { label: "All", href: "/admin/policies" },
        { label: "Private", href: "/admin/policies?scope=private" },
        { label: "Class", href: "/admin/policies?scope=class" },
        { label: "Leaders", href: "/admin/policies?scope=leaders" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Policies" value={stats.total} icon={<Settings2 size={18} />} />
        <StatCard label="Adult-only" value={stats.adultOnly} icon={<ShieldCheck size={18} />} />
        <StatCard label="Moderated" value={stats.moderated} icon={<Eye size={18} />} />
        <StatCard label="Chat enabled" value={stats.chatOn} icon={<MessageSquare size={18} />} />
        <StatCard label="Posts enabled" value={stats.postsOn} icon={<Users size={18} />} />
      </div>

      {loading ? (
        <LoadingState label="Loading policies..." />
      ) : items.length === 0 ? (
        <EmptyState
          title="No policies found"
          description="Create policies in the backend or ensure the policy collection has been seeded."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Policies list</h2>
            <div className="mt-4 grid gap-3">
              {items.map((policy) => (
                <button
                  key={policy.id}
                  type="button"
                  onClick={() =>
                    setEdit({
                      classKey: policy.classKey,
                      visibilityScope: policy.visibilityScope,
                      adultOnlyLiveSessions: policy.adultOnlyLiveSessions,
                      allowClassPosts: policy.allowClassPosts,
                      allowClassChat: policy.allowClassChat,
                      allowPeerDiscovery: policy.allowPeerDiscovery,
                      moderationEnabled: policy.moderationEnabled,
                    })
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    edit?.classKey === policy.classKey
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-bold text-slate-900">{policy.classKey.toUpperCase()}</div>
                      <div className="mt-1 text-sm text-slate-500">{policy.visibilityScope}</div>
                    </div>
                    <StatusBadge status={policy.moderationEnabled ? "success" : "pending"} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
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
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit policy</h2>
                <p className="text-sm text-slate-500">
                  {selected ? `Editing ${selected.classKey.toUpperCase()}` : "Select a class policy"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void save()}
                disabled={!edit || savingClassKey === edit.classKey}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Save size={16} />
                {savingClassKey === edit?.classKey ? "Saving..." : "Save"}
              </button>
            </div>

            {edit ? (
              <div className="mt-5 grid gap-4">
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-700">Visibility scope</div>
                  <select
                    value={edit.visibilityScope}
                    onChange={(e) => setEdit({ ...edit, visibilityScope: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                  >
                    <option value="private">Private</option>
                    <option value="class">Class</option>
                    <option value="leaders">Leaders</option>
                  </select>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      checked={edit.adultOnlyLiveSessions}
                      onChange={(e) => setEdit({ ...edit, adultOnlyLiveSessions: e.target.checked })}
                    />
                    <span className="text-sm font-semibold text-slate-800">Adult-only live sessions</span>
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      checked={edit.allowClassPosts}
                      onChange={(e) => setEdit({ ...edit, allowClassPosts: e.target.checked })}
                    />
                    <span className="text-sm font-semibold text-slate-800">Allow class posts</span>
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      checked={edit.allowClassChat}
                      onChange={(e) => setEdit({ ...edit, allowClassChat: e.target.checked })}
                    />
                    <span className="text-sm font-semibold text-slate-800">Allow class chat</span>
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      checked={edit.allowPeerDiscovery}
                      onChange={(e) => setEdit({ ...edit, allowPeerDiscovery: e.target.checked })}
                    />
                    <span className="text-sm font-semibold text-slate-800">Allow peer discovery</span>
                  </label>

                  <label className="sm:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                    <input
                      type="checkbox"
                      checked={edit.moderationEnabled}
                      onChange={(e) => setEdit({ ...edit, moderationEnabled: e.target.checked })}
                    />
                    <span className="text-sm font-semibold text-slate-800">Moderation enabled</span>
                  </label>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Policy changes affect who can post, chat, view live sessions, and discover peers.
                </div>
              </div>
            ) : (
              <EmptyState title="Select a policy" description="Choose a class from the left panel to edit its rules." />
            )}
          </section>
        </div>
      )}
    </AdminModuleLayout>
  );
}