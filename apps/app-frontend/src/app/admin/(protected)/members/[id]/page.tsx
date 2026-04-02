//view/edit member profile, status, tags, consent
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/src/lib/api";
import AdminPageHeader from "@/src/components/admin/layout/AdminPageHeader";
import LoadingState from "@/src/components/admin/shared/LoadingState";
import EmptyState from "@/src/components/admin/shared/EmptyState";
import StatusBadge from "@/src/components/admin/shared/StatusBadge";
import { ArrowLeft, Save, ShieldCheck, User, Tags, Phone, Mail, MapPin, CalendarDays } from "lucide-react";

type ParentalConsent = {
  required?: boolean;
  given?: boolean;
  parentName?: string | null;
  parentPhone?: string | null;
  parentEmail?: string | null;
  submittedAt?: string | null;
  verifiedAt?: string | null;
};

type MemberDetail = {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  preferredClass?: string | null;
  phoneVerified?: boolean;
  status?: "pending" | "approved" | "rejected" | "archived";
  roles?: string[];
  tags?: string[];
  points?: number;
  dob?: string | null;
  country?: string | null;
  city?: string | null;
  area?: string | null;
  source?: string | null;
  parentalConsent?: ParentalConsent | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type MemberEditPayload = {
  fullName: string;
  phone: string;
  email: string;
  preferredClass: string;
  status: "pending" | "approved" | "rejected" | "archived";
  phoneVerified: boolean;
  roles: string[];
  tags: string[];
  points: number;
  dob: string;
  country: string;
  city: string;
  area: string;
  source: string;
  parentalConsent: {
    required: boolean;
    given: boolean;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
  };
};

function toDateInput(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function csvToArray(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function arrayToCsv(value?: string[] | null) {
  return Array.isArray(value) ? value.join(", ") : "";
}

export default function AdminMemberDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [member, setMember] = useState<MemberDetail | null>(null);

  const [form, setForm] = useState<MemberEditPayload>({
    fullName: "",
    phone: "",
    email: "",
    preferredClass: "",
    status: "pending",
    phoneVerified: false,
    roles: [],
    tags: [],
    points: 0,
    dob: "",
    country: "",
    city: "",
    area: "",
    source: "",
    parentalConsent: {
      required: false,
      given: false,
      parentName: "",
      parentPhone: "",
      parentEmail: "",
    },
  });

  const currentTags = useMemo(() => form.tags.join(", "), [form.tags]);
  const currentRoles = useMemo(() => form.roles.join(", "), [form.roles]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    let mounted = true;

    async function load() {
      setLoading(true);
      setMessage(null);

      try {
        const res = await api.get<MemberDetail>(`/admin/members/${id}`);
        if (!mounted) return;

        setMember(res);
        setForm({
          fullName: res.fullName ?? "",
          phone: res.phone ?? "",
          email: res.email ?? "",
          preferredClass: res.preferredClass ?? "",
          status: res.status ?? "pending",
          phoneVerified: Boolean(res.phoneVerified),
          roles: res.roles ?? [],
          tags: res.tags ?? [],
          points: res.points ?? 0,
          dob: toDateInput(res.dob ?? null),
          country: res.country ?? "",
          city: res.city ?? "",
          area: res.area ?? "",
          source: res.source ?? "",
          parentalConsent: {
            required: Boolean(res.parentalConsent?.required),
            given: Boolean(res.parentalConsent?.given),
            parentName: res.parentalConsent?.parentName ?? "",
            parentPhone: res.parentalConsent?.parentPhone ?? "",
            parentEmail: res.parentalConsent?.parentEmail ?? "",
          },
        });
      } catch {
        if (!mounted) return;
        setMessage("Failed to load member.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [id, router]);

  function setField<K extends keyof MemberEditPayload>(key: K, value: MemberEditPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveProfile() {
    if (!member) return;

    setSaving(true);
    setMessage(null);

    try {
      await api.patch(`/admin/members/${member.id}/profile`, {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        preferredClass: form.preferredClass.trim(),
        status: form.status,
        phoneVerified: form.phoneVerified,
        roles: form.roles,
        tags: form.tags,
        points: form.points,
        dob: form.dob || null,
        country: form.country.trim(),
        city: form.city.trim(),
        area: form.area.trim(),
        source: form.source.trim(),
        parentalConsent: {
          required: form.parentalConsent.required,
          given: form.parentalConsent.given,
          parentName: form.parentalConsent.parentName.trim(),
          parentPhone: form.parentalConsent.parentPhone.trim(),
          parentEmail: form.parentalConsent.parentEmail.trim(),
        },
      });

      const refreshed = await api.get<MemberDetail>(`/admin/members/${member.id}`);
      setMember(refreshed);
      setMessage("Member saved successfully.");
    } catch {
      setMessage("Could not save member.");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(nextStatus: "pending" | "approved" | "rejected" | "archived") {
    if (!member) return;
    setSaving(true);
    setMessage(null);

    try {
      await api.patch(`/admin/members/${member.id}/status`, { status: nextStatus });
      const refreshed = await api.get<MemberDetail>(`/admin/members/${member.id}`);
      setMember(refreshed);
      setForm((prev) => ({ ...prev, status: nextStatus }));
      setMessage(`Status updated to ${nextStatus}.`);
    } catch {
      setMessage("Could not update status.");
    } finally {
      setSaving(false);
    }
  }

  async function saveTags() {
    if (!member) return;
    setSaving(true);
    setMessage(null);

    try {
      await api.patch(`/admin/members/${member.id}/tags`, { tags: form.tags });
      const refreshed = await api.get<MemberDetail>(`/admin/members/${member.id}`);
      setMember(refreshed);
      setMessage("Tags updated.");
    } catch {
      setMessage("Could not update tags.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading member..." />;
  }

  if (!member) {
    return <EmptyState title="Member not found" description="This record may have been removed." />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={member.fullName}
        description="View and edit the member record, status, tags, and consent details."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back to members
        </Link>

        <StatusBadge status={member.status ?? "pending"} />
        <StatusBadge status={member.phoneVerified ? "verified" : "unverified"} />
        <StatusBadge
          status={
            member.parentalConsent?.required
              ? member.parentalConsent?.given
                ? "consented"
                : "pending"
              : "not_needed"
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <User size={18} />
            <h2 className="text-lg font-bold text-gray-900">Profile</h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Full name" value={form.fullName} onChange={(v) => setField("fullName", v)} />
            <Field label="Phone" value={form.phone} onChange={(v) => setField("phone", v)} icon={<Phone size={16} />} />
            <Field label="Email" value={form.email} onChange={(v) => setField("email", v)} icon={<Mail size={16} />} />
            <Field
              label="Preferred class"
              value={form.preferredClass}
              onChange={(v) => setField("preferredClass", v)}
            />
            <Field label="Country" value={form.country} onChange={(v) => setField("country", v)} icon={<MapPin size={16} />} />
            <Field label="City" value={form.city} onChange={(v) => setField("city", v)} />
            <Field label="Area" value={form.area} onChange={(v) => setField("area", v)} />
            <Field label="Source" value={form.source} onChange={(v) => setField("source", v)} />
            <Field
              label="Date of birth"
              type="date"
              value={form.dob}
              onChange={(v) => setField("dob", v)}
              icon={<CalendarDays size={16} />}
            />
            <Field
              label="Points"
              type="number"
              value={String(form.points)}
              onChange={(v) => setField("points", Number(v || 0))}
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <MultiField
              label="Roles"
              value={currentRoles}
              onChange={(v) => setField("roles", csvToArray(v))}
              helper="Comma-separated roles"
            />
            <MultiField
              label="Tags"
              value={currentTags}
              onChange={(v) => setField("tags", csvToArray(v))}
              helper="Comma-separated tags"
              icon={<Tags size={16} />}
            />
          </div>

          <div className="mt-5 rounded-3xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} />
              <h3 className="font-semibold text-gray-900">Consent</h3>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.parentalConsent.required}
                  onChange={(e) =>
                    setField("parentalConsent", {
                      ...form.parentalConsent,
                      required: e.target.checked,
                    })
                  }
                />
                <span className="text-sm font-medium">Consent required</span>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.parentalConsent.given}
                  onChange={(e) =>
                    setField("parentalConsent", {
                      ...form.parentalConsent,
                      given: e.target.checked,
                    })
                  }
                />
                <span className="text-sm font-medium">Consent given</span>
              </label>

              <Field
                label="Parent name"
                value={form.parentalConsent.parentName}
                onChange={(v) =>
                  setField("parentalConsent", { ...form.parentalConsent, parentName: v })
                }
              />
              <Field
                label="Parent phone"
                value={form.parentalConsent.parentPhone}
                onChange={(v) =>
                  setField("parentalConsent", { ...form.parentalConsent, parentPhone: v })
                }
              />
              <Field
                label="Parent email"
                value={form.parentalConsent.parentEmail}
                onChange={(v) =>
                  setField("parentalConsent", { ...form.parentalConsent, parentEmail: v })
                }
              />
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Submitted: {member.parentalConsent?.submittedAt ? new Date(member.parentalConsent.submittedAt).toLocaleString() : "—"}
              <br />
              Verified: {member.parentalConsent?.verifiedAt ? new Date(member.parentalConsent.verifiedAt).toLocaleString() : "—"}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save changes"}
            </button>

            <button
              type="button"
              onClick={saveTags}
              disabled={saving}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-60"
            >
              Save tags only
            </button>
          </div>

          {message ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {message}
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Admin actions</h3>
            <p className="mt-1 text-sm text-gray-600">Quick status operations for this member.</p>

            <div className="mt-4 grid gap-2">
              <ActionButton label="Approve" onClick={() => void updateStatus("approved")} />
              <ActionButton label="Pending" onClick={() => void updateStatus("pending")} />
              <ActionButton label="Reject" onClick={() => void updateStatus("rejected")} />
              <ActionButton label="Archive" onClick={() => void updateStatus("archived")} />
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">Summary</h3>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <Row label="Member ID" value={member.id} />
              <Row label="Phone verified" value={member.phoneVerified ? "Yes" : "No"} />
              <Row label="Preferred class" value={member.preferredClass ?? "—"} />
              <Row label="Points" value={String(member.points ?? 0)} />
              <Row label="Tags" value={(member.tags ?? []).join(", ") || "—"} />
              <Row label="Roles" value={(member.roles ?? []).join(", ") || "—"} />
              <Row label="Created at" value={member.createdAt ? new Date(member.createdAt).toLocaleString() : "—"} />
              <Row label="Updated at" value={member.updatedAt ? new Date(member.updatedAt).toLocaleString() : "—"} />
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
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3">
        {icon ? <span className="text-gray-400">{icon}</span> : null}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  );
}

function MultiField({
  label,
  value,
  onChange,
  helper,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3">
        {icon ? <span className="text-gray-400">{icon}</span> : null}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
      {helper ? <span className="text-xs text-gray-500">{helper}</span> : null}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="max-w-[60%] text-right font-medium text-gray-900">{value}</span>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50"
    >
      {label}
    </button>
  );
}