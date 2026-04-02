//services/api/src/utils/adminQuery.ts
import type { Request } from "express";

function normalizeQueryValue(
  value: unknown
): string | string[] | undefined {
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string");
  }

  return undefined;
}

export function toInt(value: string | string[] | undefined, fallback: number, min: number, max: number): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = raw ? Number(raw) : fallback;
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}

export function toText(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw.trim() : "";
}

export function safeRegex(value: string): RegExp {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
}

export function getPagination(req: Request) {
  return {
    page: toInt(normalizeQueryValue(req.query.page), 1, 1, 100000),
    limit: toInt(normalizeQueryValue(req.query.limit), 20, 1, 100),
    q: toText(normalizeQueryValue(req.query.q)),
    status: toText(normalizeQueryValue(req.query.status)),
  };
}