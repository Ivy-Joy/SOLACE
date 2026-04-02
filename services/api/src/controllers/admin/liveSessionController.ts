import type { Request, Response } from "express";
import LiveSession from "../../models/LiveSession";

const toId = (value: unknown): string => (value ? String(value) : "");
const iso = (value?: Date | null): string | null => (value ? value.toISOString() : null);

function serializeLiveSession(session: any) {
  return {
    id: toId(session._id),
    title: session.title ?? "",
    classKey: session.classKey ?? null,
    startsAt: iso(session.startAt ?? null),
    endsAt: iso(session.endAt ?? session.endsAt ?? null),
    meetingUrl: session.meetingUrl ?? null,
  };
}

export async function getLiveSessions(_req: Request, res: Response) {
  try {
    const sessions = await LiveSession.find().sort({ startAt: -1 }).lean();
    return res.json({ items: sessions.map(serializeLiveSession) });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getLiveSessionById(req: Request, res: Response) {
  try {
    const session = await LiveSession.findById(req.params.id).lean();
    if (!session) return res.status(404).json({ message: "Session not found" });
    return res.json(serializeLiveSession(session));
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createLiveSession(req: Request, res: Response) {
  try {
    const session = new LiveSession(req.body);
    await session.save();
    return res.status(201).json({ ok: true, item: serializeLiveSession(session) });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateLiveSession(req: Request, res: Response) {
  try {
    const session = await LiveSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ message: "Session not found" });
    return res.json({ ok: true, item: serializeLiveSession(session) });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}