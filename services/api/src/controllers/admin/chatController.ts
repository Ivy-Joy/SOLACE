import type { Request, Response } from "express";
import ClassChatMessage from "../../models/ClassChatMessage";

// Helpers
const toId = (value: unknown): string => (value ? String(value) : "");
const iso = (value?: Date | null): string | null => (value ? value.toISOString() : null);

function serializeChatMessage(msg: any) {
  return {
    id: toId(msg._id),
    classKey: msg.classKey,
    liveSessionId: msg.liveSessionId ? toId(msg.liveSessionId) : null,
    senderMemberId: toId(msg.senderMemberId),
    senderRole: msg.senderRole ?? null,
    message: msg.message ?? "",
    kind: msg.messageType ?? "text",
    hidden: Boolean(msg.hidden),
    deleted: Boolean(msg.isDeleted),
    moderationReason: msg.moderationReason ?? null,
    createdAt: iso(msg.createdAt ?? null),
  };
}

export async function getChatMessages(req: Request, res: Response) {
  try {
    const { classKey } = req.query; // Assuming classKey filter via query or params
    const filter = classKey ? { classKey } : {};
    const rows = await ClassChatMessage.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    return res.json({ items: rows.map(serializeChatMessage) });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getChatMessageById(req: Request, res: Response) {
  try {
    const msg = await ClassChatMessage.findById(req.params.id).lean();
    if (!msg) return res.status(404).json({ message: "Message not found" });
    return res.json(serializeChatMessage(msg));
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function moderateChatMessage(req: Request, res: Response) {
  try {
    const msg = await ClassChatMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    const { hidden, deleted, kind, moderationReason } = req.body;

    if (hidden !== undefined) msg.hidden = Boolean(hidden);
    if (deleted !== undefined) msg.isDeleted = Boolean(deleted);
    if (kind !== undefined) {
      const validKinds = ["text", "system", "announcement", "moderation"];
      if (validKinds.includes(kind)) msg.messageType = kind;
    }
    if (moderationReason !== undefined) msg.moderationReason = moderationReason.trim() || null;

    msg.moderatedByAdminId = (req as any).admin?._id ?? null;
    await msg.save();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}