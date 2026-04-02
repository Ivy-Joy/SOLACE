"use client";

import { useEffect, useState } from "react";
import api from "@/src/lib/api";
import { X, Mail } from "lucide-react";

type BulkEmailModalProps = {
  eventId: string;
  open: boolean;
  onClose: () => void;
};

export default function BulkEmailModal({ eventId, open, onClose }: BulkEmailModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setStatus(null);
    }
  }, [open]);

  async function send() {
    setSending(true);
    setStatus(null);

    try {
      await api.post(`/admin/events/${eventId}/bulk-email`, {
        subject: subject.trim(),
        message: message.trim(),
        audience,
      });

      setStatus("Email sent.");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("Email send failed.");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <Mail size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Bulk email</h2>
              <p className="text-sm text-slate-600">Send a targeted message to event contacts.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 p-2 hover:bg-slate-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Audience</span>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            >
              <option value="all">All registrants</option>
              <option value="checked_in">Checked in</option>
              <option value="waitlist">Waitlist</option>
              <option value="not_checked_in">Not checked in</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
              placeholder="Email subject"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Message</span>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
              placeholder="Write your message..."
            />
          </label>
        </div>

        {status ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {status}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={send}
            disabled={sending}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send email"}
          </button>
        </div>
      </div>
    </div>
  );
}