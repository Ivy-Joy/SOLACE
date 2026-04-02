"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Trash2, Loader2, Shield, User } from "lucide-react";
import { PrayerSubmission } from "@/src/types/prayer";

type Props = {
  onSubmit: (values: PrayerSubmission) => Promise<void>;
  submitting: boolean;
};

export default function PrayerForm({ onSubmit, submitting }: Props) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [anonymous, setAnonymous] = useState(true);

  // Accent is configurable by setting --accent on a parent or page.
  // Default fallback used inline where useful.
  const accent = "var(--accent, #0ea5a4)";

  const inputBase =
    "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-opacity-80 transition-all duration-150 text-sm";

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!text || text.trim().length < 3) {
      // prefer unobtrusive UI — but fallback to alert if nothing else
      alert("Please enter your request (3+ characters).");
      return;
    }

    await onSubmit({
      title: title.trim() || undefined,
      text: text.trim(),
      name: name.trim() || undefined,
      phone: contact.trim() || undefined,
      consentToContact: consent,
      anonymous,
      language: "en",
    });

    // Reset
    setTitle("");
    setText("");
    setName("");
    setContact("");
    setConsent(false);
    setAnonymous(true);
  }

  return (
    <form onSubmit={handle} className="space-y-5" style={{ ["--accent" as any]: accent }}>
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Prayer Title <span className="text-xs font-normal text-gray-500">(optional)</span>
        </label>
        <input
          aria-label="Prayer title"
          className={inputBase}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Strength for exams"
          maxLength={120}
        />
      </div>

      {/* Request textarea */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-2">Your Request</label>
        <textarea
          aria-label="Your prayer request"
          className={`${inputBase} h-32 resize-none`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share what is on your heart…"
          maxLength={2000}
        />
        <div className="text-right text-xs text-gray-400 mt-1">{text.length}/2000</div>
      </div>

      {/* Personal details */}
      <div className="pt-3 border-t border-gray-100 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
          <User size={14} /> Personal Details
        </div>

        <div className="grid grid-cols-1 gap-3">
          <input
            aria-label="Your name (optional)"
            className={inputBase}
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            aria-label="Email or phone (optional)"
            className={inputBase}
            placeholder="Email or phone (optional)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3 pt-2">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            aria-label="Consent to be contacted"
            className="w-4 h-4 rounded border-gray-300"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span className="text-sm text-gray-600">Consent to be contacted by pastors</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            aria-label="Post anonymously"
            className="w-4 h-4 rounded border-gray-300"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          <span className="text-sm text-gray-600">Post anonymously to the Prayer Wall</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <button
          aria-label="Post prayer"
          disabled={submitting}
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[--accent] text-white font-semibold text-sm py-3 rounded-lg shadow-md hover:brightness-105 disabled:opacity-60 transition"
          style={{ backgroundColor: accent }}
        >
          {submitting ? <Loader2 className="animate-spin" /> : <Send size={16} />}
          <span>{submitting ? "Posting..." : "Post Prayer"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setText("");
            setTitle("");
            setName("");
            setContact("");
            setConsent(false);
            setAnonymous(true);
          }}
          className="p-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
          title="Clear form"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* subtle privacy note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-gray-500"
      >
        <Shield size={12} className="inline-block mr-1" /> Sensitive details remain private and
        are only visible to pastoral staff (encrypted).
      </motion.p>
    </form>
  );
}