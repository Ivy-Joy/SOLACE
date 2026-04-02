"use client";

import { useEffect, useState } from "react";
import memberApi from "@/src/lib/memberApi";
import { Send } from "lucide-react";

type ChatItem = {
  id: string;
  senderMemberId: string;
  message: string;
  kind: string;
  createdAt?: string | null;
};

export default function ClassChatPanel({
  classKey,
  liveSessionId,
}: {
  classKey: string;
  liveSessionId?: string;
}) {
  const [items, setItems] = useState<ChatItem[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await memberApi.get<{ items: ChatItem[] }>(`/member/classes/${classKey}/chat`);
    setItems(res.items);
  }

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 6000);
    return () => clearInterval(t);
  }, [classKey]);

  async function send() {
    if (!message.trim()) return;
    await memberApi.post(`/member/classes/${classKey}/chat`, {
      message,
      liveSessionId,
    });
    setMessage("");
    await load();
  }

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Class chat</h2>

      <div className="mt-4 max-h-[420px] space-y-3 overflow-auto pr-1">
        {items.map((m) => (
          <div key={m.id} className="rounded-2xl border border-slate-200 px-4 py-3">
            <div className="text-sm text-slate-700">{m.message}</div>
            <div className="mt-1 text-xs text-slate-500">
              {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
        />
        <button
          type="button"
          onClick={send}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          <Send size={16} />
          Send
        </button>
      </div>
    </div>
  );
}