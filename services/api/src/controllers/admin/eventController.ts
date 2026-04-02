import type { Request, Response } from "express";
import Event from "../../models/events/Event";
import AuditLog from "../../models/AuditLog";
import { getPagination, safeRegex } from "../../utils/adminQuery";

type EventRow = {
  _id: { toString(): string };
  title: string;
  slug?: string | null;
  description?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  startAt?: Date | null;
  endAt?: Date | null;
  status?: string | null;
  published?: boolean;
  featured?: boolean;
  registrationEnabled?: boolean;
  capacity?: number | null;
  registeredCount?: number | null;
  tags?: string[] | null;
  timezone?: string | null;
  organizer?: string | null;
  registrationUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

function iso(value?: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseDate(value: unknown): Date | null {
  if (value === undefined || value === null || value === "") return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "off"].includes(normalized)) return false;
  }
  if (typeof value === "number") return value !== 0;
  return fallback;
}

function parseNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function parseTags(value: unknown): string[] | null {
  if (value === undefined || value === null) return null;
  if (!Array.isArray(value)) return null;

  const tags = value
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags;
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value.trim() : null;
}

function addIfDefined(target: Record<string, unknown>, key: string, value: unknown): void {
  if (value !== undefined) {
    target[key] = value;
  }
}

function buildEventPayload(body: Record<string, unknown>, isCreate = false): {
  payload: Record<string, unknown>;
  error: string | null;
} {
  const title = asString(body.title);
  if (isCreate && !title) {
    return { payload: {}, error: "Title is required" };
  }

  const payload: Record<string, unknown> = {};

  if (title) {
    payload.title = title;
  }

  const rawSlug = asString(body.slug);
  if (rawSlug) {
    payload.slug = toSlug(rawSlug);
  } else if (title) {
    payload.slug = toSlug(title);
  }

  addIfDefined(payload, "description", asString(body.description));
  addIfDefined(payload, "location", asString(body.location) ?? asString(body.venue));
  addIfDefined(payload, "imageUrl", asString(body.imageUrl) ?? asString(body.coverImage) ?? asString(body.bannerImage));
  addIfDefined(payload, "timezone", asString(body.timezone));
  addIfDefined(payload, "organizer", asString(body.organizer));
  addIfDefined(payload, "registrationUrl", asString(body.registrationUrl));

  const startAtInput = body.startAt ?? body.startDate ?? body.date;
  const endAtInput = body.endAt ?? body.endDate;

  if (startAtInput !== undefined) {
    const startAt = parseDate(startAtInput);
    if (!startAt) {
      return { payload: {}, error: "Invalid start date" };
    }
    payload.startAt = startAt;
  }

  if (endAtInput !== undefined) {
    const endAt = parseDate(endAtInput);
    if (!endAt) {
      return { payload: {}, error: "Invalid end date" };
    }
    payload.endAt = endAt;
  }

  if (body.status !== undefined) {
    const status = asString(body.status);
    if (!status) {
      return { payload: {}, error: "Invalid status" };
    }
    payload.status = status;
  }

  if (body.published !== undefined) {
    payload.published = parseBoolean(body.published);
  }

  if (body.featured !== undefined) {
    payload.featured = parseBoolean(body.featured);
  }

  if (body.registrationEnabled !== undefined) {
    payload.registrationEnabled = parseBoolean(body.registrationEnabled);
  }

  if (body.capacity !== undefined) {
    const capacity = parseNumber(body.capacity);
    if (capacity === null) {
      return { payload: {}, error: "Invalid capacity" };
    }
    payload.capacity = capacity;
  }

  const tags = parseTags(body.tags);
  if (tags !== null) {
    payload.tags = tags;
  }

  return { payload, error: null };
}

function normalizeEvent(row: EventRow) {
  return {
    id: row._id.toString(),
    title: row.title,
    slug: row.slug ?? null,
    description: row.description ?? null,
    location: row.location ?? null,
    imageUrl: row.imageUrl ?? null,
    startAt: iso(row.startAt ?? null),
    endAt: iso(row.endAt ?? null),
    status: row.status ?? null,
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    registrationEnabled: Boolean(row.registrationEnabled),
    capacity: row.capacity ?? null,
    registeredCount: row.registeredCount ?? null,
    tags: row.tags ?? [],
    timezone: row.timezone ?? null,
    organizer: row.organizer ?? null,
    registrationUrl: row.registrationUrl ?? null,
    createdAt: iso(row.createdAt ?? null),
    updatedAt: iso(row.updatedAt ?? null),
  };
}

export async function listEvents(req: Request, res: Response) {
  try {
    const { page, limit, q, status } = getPagination(req);

    const filter: Record<string, unknown> = {};

    if (q) {
      const regex = safeRegex(q);
      filter.$or = [
        { title: regex },
        { slug: regex },
        { description: regex },
        { location: regex },
        { organizer: regex },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const [total, rows] = await Promise.all([
      Event.countDocuments(filter),
      Event.find(filter).sort({ startAt: 1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ]);

    const items = (rows as EventRow[]).map(normalizeEvent);

    return res.json({ items, page, limit, total });
  } catch (err) {
    console.error("listEvents error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getEventById(req: Request, res: Response) {
  try {
    const event = await Event.findById(req.params.id).lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(normalizeEvent(event as EventRow));
  } catch (err) {
    console.error("getEventById error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createEvent(req: Request, res: Response) {
  try {
    const body = req.body as Record<string, unknown>;
    const { payload, error } = buildEventPayload(body, true);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const event = await Event.create(payload);

    await AuditLog.create({
      actorType: "admin",
      actorId: req.admin?._id,
      action: "event.create",
      targetType: "Event",
      targetId: event._id,
      metadata: {
        eventId: event._id.toString(),
        title: payload.title ?? null,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent") ?? null,
      status: "success",
    });

    return res.status(201).json({
      ok: true,
      item: normalizeEvent(event.toObject() as EventRow),
    });
  } catch (err) {
    console.error("createEvent error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateEvent(req: Request, res: Response) {
  try {
    const body = req.body as Record<string, unknown>;
    const { payload, error } = buildEventPayload(body, false);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    Object.assign(event, payload);
    await event.save();

    await AuditLog.create({
      actorType: "admin",
      actorId: req.admin?._id,
      action: "event.update",
      targetType: "Event",
      targetId: event._id,
      metadata: {
        eventId: event._id.toString(),
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent") ?? null,
      status: "success",
    });

    return res.json({
      ok: true,
      item: normalizeEvent(event.toObject() as EventRow),
    });
  } catch (err) {
    console.error("updateEvent error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const deletedId = event._id.toString();
    await event.deleteOne();

    await AuditLog.create({
      actorType: "admin",
      actorId: req.admin?._id,
      action: "event.delete",
      targetType: "Event",
      targetId: event._id,
      metadata: {
        eventId: deletedId,
      },
      ipAddress: req.ip,
      userAgent: req.get("user-agent") ?? null,
      status: "success",
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteEvent error", err);
    return res.status(500).json({ message: "Server error" });
  }
}