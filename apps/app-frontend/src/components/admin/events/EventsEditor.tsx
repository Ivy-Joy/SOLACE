"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/api";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";

type EventFormState = {
  title: string;
  slug: string;
  description: string;
  location: string;
  imageUrl: string;
  startAt: string;
  endAt: string;
  timezone: string;
  organizer: string;
  registrationUrl: string;
  capacity: string;
  status: "draft" | "published" | "archived";
  published: boolean;
  featured: boolean;
  registrationEnabled: boolean;
  tags: string;
};

type EventItem = {
  id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  timezone?: string | null;
  organizer?: string | null;
  registrationUrl?: string | null;
  capacity?: number | null;
  status?: string | null;
  published?: boolean;
  featured?: boolean;
  registrationEnabled?: boolean;
  tags?: string[] | null;
};

function toDatetimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${y}-${m}-${d}T${h}:${min}`;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EventsEditor({ eventId }: { eventId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(eventId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<EventFormState>({
    title: "",
    slug: "",
    description: "",
    location: "",
    imageUrl: "",
    startAt: "",
    endAt: "",
    timezone: "Africa/Nairobi",
    organizer: "",
    registrationUrl: "",
    capacity: "",
    status: "draft",
    published: false,
    featured: false,
    registrationEnabled: true,
    tags: "",
  });

  const payload = useMemo(() => {
    const parsedCapacity = form.capacity.trim() ? Number(form.capacity) : null;
    return {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      imageUrl: form.imageUrl.trim(),
      startAt: form.startAt ? new Date(form.startAt).toISOString() : null,
      endAt: form.endAt ? new Date(form.endAt).toISOString() : null,
      timezone: form.timezone.trim(),
      organizer: form.organizer.trim(),
      registrationUrl: form.registrationUrl.trim(),
      capacity: Number.isFinite(parsedCapacity as number) ? parsedCapacity : null,
      status: form.status,
      published: form.published,
      featured: form.featured,
      registrationEnabled: form.registrationEnabled,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
  }, [form]);

  useEffect(() => {
    if (!eventId) return;

    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const item = await api.get<EventItem>(`/admin/events/${eventId}`);
        if (!mounted) return;

        setForm({
          title: item.title ?? "",
          slug: item.slug ?? "",
          description: item.description ?? "",
          location: item.location ?? "",
          imageUrl: item.imageUrl ?? "",
          startAt: toDatetimeLocal(item.startAt ?? null),
          endAt: toDatetimeLocal(item.endAt ?? null),
          timezone: item.timezone ?? "Africa/Nairobi",
          organizer: item.organizer ?? "",
          registrationUrl: item.registrationUrl ?? "",
          capacity: item.capacity != null ? String(item.capacity) : "",
          status: (item.status as "draft" | "published" | "archived") ?? "draft",
          published: Boolean(item.published),
          featured: Boolean(item.featured),
          registrationEnabled: item.registrationEnabled ?? true,
          tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
        });
      } catch {
        setMessage("Failed to load event.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [eventId]);

  function update<K extends keyof EventFormState>(key: K, value: EventFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!payload.title) {
        setMessage("Title is required.");
        return;
      }

      if (isEdit && eventId) {
        await api.patch(`/admin/events/${eventId}`, payload);
      } else {
        await api.post("/admin/events", payload);
      }

      router.push("/admin/events");
      router.refresh();
    } catch {
      setMessage("Could not save event.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        Loading event...
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{isEdit ? "Edit event" : "Create event"}</h2>
          <p className="text-sm text-slate-600">
            Fill in the event details, publish status, and registration settings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" value={form.title} onChange={(v) => update("title", v)} required />
          <Field label="Slug" value={form.slug} onChange={(v) => update("slug", v)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Location" value={form.location} onChange={(v) => update("location", v)} />
          <Field label="Image URL" value={form.imageUrl} onChange={(v) => update("imageUrl", v)} />
        </div>

        <TextAreaField
          label="Description"
          value={form.description}
          onChange={(v) => update("description", v)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Start at"
            type="datetime-local"
            value={form.startAt}
            onChange={(v) => update("startAt", v)}
          />
          <Field
            label="End at"
            type="datetime-local"
            value={form.endAt}
            onChange={(v) => update("endAt", v)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Timezone" value={form.timezone} onChange={(v) => update("timezone", v)} />
          <Field label="Organizer" value={form.organizer} onChange={(v) => update("organizer", v)} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Registration URL"
            value={form.registrationUrl}
            onChange={(v) => update("registrationUrl", v)}
          />
          <Field
            label="Capacity"
            type="number"
            value={form.capacity}
            onChange={(v) => update("capacity", v)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Tags"
            value={form.tags}
            onChange={(v) => update("tags", v)}
            helper="Comma-separated tags"
          />
          <div className="grid gap-3 rounded-3xl border border-slate-200 p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => update("published", e.target.checked)}
              />
              <span className="text-sm font-medium">Published</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.registrationEnabled}
                onChange={(e) => update("registrationEnabled", e.target.checked)}
              />
              <span className="text-sm font-medium">Registration enabled</span>
            </label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value as EventFormState["status"])}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => update("slug", slugify(form.title))}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Generate slug
            </button>
          </div>
        </div>

        {message ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {message}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save event"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  helper?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">
        {label} {required ? <span className="text-rose-500">*</span> : null}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
      />
      {helper ? <span className="text-xs text-slate-500">{helper}</span> : null}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}