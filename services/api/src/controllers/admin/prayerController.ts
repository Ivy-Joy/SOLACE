//services/api/src/controllers/admin/prayerController.ts
import type { Request, Response } from "express";
import PrayerRequest from "../../models/PrayerRequest";
import AuditLog from "../../models/AuditLog";
import { decryptField } from "../../utils/crypto";
import { getPagination, safeRegex } from "../../utils/adminQuery";

type PrayerRow = {
  _id: { toString(): string };
  title?: string;
  textEncrypted: string;
  excerpt?: string;
  anonymous?: boolean;
  answered?: boolean;
  answeredAt?: Date | null;
  answerText?: string | null;
  hidden?: boolean;
  escalated?: boolean;
  escalatedNote?: string | null;
  prayersCount?: number;
  createdAt?: Date;
  moderatedAt?: Date | null;
  moderationAction?: string | null;
  moderationNote?: string | null;
};

function iso(value?: Date | null): string | null {
  return value ? value.toISOString() : null;
}

type PrayerAction = "answered" | "hidden" | "unhidden" | "escalated" | "clear_escalation";

export async function listPrayerRequests(req: Request, res: Response) {
  try {
    const { page, limit, q, status } = getPagination(req);

    const filter: Record<string, unknown> = {};
    if (q) {
      const regex = safeRegex(q);
      filter.$or = [{ title: regex }, { excerpt: regex }];
    }

    if (status === "answered") filter.answered = true;
    if (status === "open") filter.answered = false;
    if (status === "hidden") filter.hidden = true;
    if (status === "escalated") filter.escalated = true;

    const [total, rows] = await Promise.all([
      PrayerRequest.countDocuments(filter),
      PrayerRequest.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ]);

    const items = (rows as PrayerRow[]).map((p) => ({
      id: p._id.toString(),
      title: p.title ?? "",
      text: decryptField(p.textEncrypted),
      excerpt: p.excerpt ?? "",
      anonymous: Boolean(p.anonymous),
      answered: Boolean(p.answered),
      hidden: Boolean(p.hidden),
      escalated: Boolean(p.escalated),
      prayersCount: p.prayersCount ?? 0,
      answerText: p.answerText ?? null,
      escalatedNote: p.escalatedNote ?? null,
      createdAt: iso(p.createdAt ?? null),
      answeredAt: iso(p.answeredAt ?? null),
      moderatedAt: iso(p.moderatedAt ?? null),
      moderationAction: p.moderationAction ?? null,
      moderationNote: p.moderationNote ?? null,
    }));

    return res.json({ items, page, limit, total });
  } catch (err) {
    console.error("listPrayerRequests error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getPrayerById(req: Request, res: Response) {
  try {
    const prayer = await PrayerRequest.findById(req.params.id).lean();
    if (!prayer) {
      return res.status(404).json({ message: "Prayer request not found" });
    }

    const row = prayer as PrayerRow;

    return res.json({
      id: row._id.toString(),
      title: row.title ?? "",
      text: decryptField(row.textEncrypted),
      excerpt: row.excerpt ?? "",
      anonymous: Boolean(row.anonymous),
      answered: Boolean(row.answered),
      hidden: Boolean(row.hidden),
      escalated: Boolean(row.escalated),
      prayersCount: row.prayersCount ?? 0,
      answerText: row.answerText ?? null,
      escalatedNote: row.escalatedNote ?? null,
      createdAt: iso(row.createdAt ?? null),
      answeredAt: iso(row.answeredAt ?? null),
      moderatedAt: iso(row.moderatedAt ?? null),
      moderationAction: row.moderationAction ?? null,
      moderationNote: row.moderationNote ?? null,
    });
  } catch (err) {
    console.error("getPrayerById error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function moderatePrayerRequest(req: Request, res: Response) {
  try {
    const prayer = await PrayerRequest.findById(req.params.id);
    if (!prayer) {
      return res.status(404).json({ message: "Prayer request not found" });
    }

    const body = req.body as { action?: PrayerAction; answerText?: string; note?: string };

    if (!body.action) {
      return res.status(400).json({ message: "Missing action" });
    }

    switch (body.action) {
      case "answered":
        prayer.answered = true;
        prayer.answeredAt = new Date();
        prayer.answerText = body.answerText?.trim() || prayer.answerText || "";
        prayer.hidden = false;
        prayer.escalated = false;
        break;
      case "hidden":
        prayer.hidden = true;
        break;
      case "unhidden":
        prayer.hidden = false;
        break;
      case "escalated":
        prayer.escalated = true;
        prayer.escalatedNote = body.note?.trim() || prayer.escalatedNote || "";
        break;
      case "clear_escalation":
        prayer.escalated = false;
        prayer.escalatedNote = "";
        break;
    }

    prayer.moderatedAt = new Date();
    prayer.moderatedByAdminId = req.admin?._id ?? null;
    prayer.moderationAction = body.action;
    prayer.moderationNote = body.note?.trim() || null;

    await prayer.save();

    await AuditLog.create({
      actorType: "admin",
      actorId: req.admin?._id,
      action: `prayer.${body.action}`,
      targetType: "PrayerRequest",
      targetId: prayer._id,
      metadata: {
        prayerId: prayer._id.toString(),
        action: body.action,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent") ?? null,
      status: "success",
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("moderatePrayerRequest error", err);
    return res.status(500).json({ message: "Server error" });
  }
}