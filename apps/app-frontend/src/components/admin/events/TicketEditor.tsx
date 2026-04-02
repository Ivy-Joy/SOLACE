"use client";

import { useEffect, useState } from "react";
import api from "@/src/lib/api";
import { Plus, Trash2, Save } from "lucide-react";

type TicketRow = {
  id?: string;
  name: string;
  price: string;
  capacity: string;
  description: string;
  isActive: boolean;
  salesStart: string;
  salesEnd: string;
};

type TicketResponse = {
  items?: TicketRow[];
};

const emptyTicket = (): TicketRow => ({
  name: "",
  price: "",
  capacity: "",
  description: "",
  isActive: true,
  salesStart: "",
  salesEnd: "",
});

export default function TicketEditor({ eventId }: { eventId: string }) {
  const [tickets, setTickets] = useState<TicketRow[]>([emptyTicket()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const res = await api.get<TicketResponse>(`/admin/events/${eventId}/tickets`);
        if (!mounted) return;
        setTickets(res.items?.length ? res.items : [emptyTicket()]);
      } catch {
        if (mounted) setMessage("Could not load tickets.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [eventId]);

  function updateTicket(index: number, key: keyof TicketRow, value: string | boolean) {
    setTickets((prev) => prev.map((ticket, i) => (i === index ? { ...ticket, [key]: value } : ticket)));
  }

  function addTicket() {
    setTickets((prev) => [...prev, emptyTicket()]);
  }

  function removeTicket(index: number) {
    setTickets((prev) => (prev.length === 1 ? [emptyTicket()] : prev.filter((_, i) => i !== index)));
  }

  async function save() {
    setSaving(true);
    setMessage(null);

    try {
      const payload = tickets.map((ticket) => ({
        ...ticket,
        price: ticket.price.trim() ? Number(ticket.price) : null,
        capacity: ticket.capacity.trim() ? Number(ticket.capacity) : null,
      }));

      await api.patch(`/admin/events/${eventId}/tickets`, { tickets: payload });
      setMessage("Tickets saved.");
    } catch {
      setMessage("Could not save tickets.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Ticket editor</h2>
          <p className="text-sm text-slate-600">Manage pricing, capacity, and availability.</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={addTicket}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            <Plus size={16} />
            Add ticket
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {tickets.map((ticket, index) => (
          <div key={ticket.id ?? index} className="rounded-[24px] border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">Ticket {index + 1}</div>
              <button
                type="button"
                onClick={() => removeTicket(index)}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Name" value={ticket.name} onChange={(v) => updateTicket(index, "name", v)} />
              <Field label="Price" value={ticket.price} onChange={(v) => updateTicket(index, "price", v)} />
              <Field
                label="Capacity"
                value={ticket.capacity}
                onChange={(v) => updateTicket(index, "capacity", v)}
              />
              <Field
                label="Sales start"
                type="datetime-local"
                value={ticket.salesStart}
                onChange={(v) => updateTicket(index, "salesStart", v)}
              />
              <Field
                label="Sales end"
                type="datetime-local"
                value={ticket.salesEnd}
                onChange={(v) => updateTicket(index, "salesEnd", v)}
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
              <TextAreaField
                label="Description"
                value={ticket.description}
                onChange={(v) => updateTicket(index, "description", v)}
              />
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={ticket.isActive}
                  onChange={(e) => updateTicket(index, "isActive", e.target.checked)}
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {message ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
      />
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
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}