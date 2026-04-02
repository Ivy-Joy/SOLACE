import type { Request, Response } from "express";
import CounsellingCase from "../../models/CounsellingCase";

const toId = (value: unknown): string => (value ? String(value) : "");
const iso = (value?: Date | null): string | null => (value ? value.toISOString() : null);

function serializeCounselling(caseRow: any) {
  return {
    id: toId(caseRow._id),
    memberId: toId(caseRow.memberId),
    urgency: caseRow.urgency ?? "non_urgent",
    category: caseRow.category ?? "",
    status: caseRow.status ?? "triaged",
    summary: caseRow.summary ?? "",
    details: caseRow.details ?? null,
    assignedToAdminId: caseRow.assignedToAdminId ? toId(caseRow.assignedToAdminId) : null,
    followUpAt: iso(caseRow.followUpAt ?? null),
    createdAt: iso(caseRow.createdAt ?? null),
    triagedAt: iso(caseRow.triagedAt ?? null),
    resolvedAt: iso(caseRow.resolvedAt ?? null),
  };
}

export async function getCases(_req: Request, res: Response) {
  try {
    const rows = await CounsellingCase.find().sort({ createdAt: -1 }).limit(100).lean();
    return res.json({ items: rows.map(serializeCounselling) });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getCaseById(req: Request, res: Response) {
  try {
    const caseRow = await CounsellingCase.findById(req.params.id).lean();
    if (!caseRow) return res.status(404).json({ message: "Case not found" });
    return res.json(serializeCounselling(caseRow));
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateCase(req: Request, res: Response) {
  try {
    const caseRow = await CounsellingCase.findById(req.params.id);
    if (!caseRow) return res.status(404).json({ message: "Case not found" });

    const body = req.body;
    if (body.status) caseRow.status = body.status;
    if (body.urgency) caseRow.urgency = body.urgency;
    if (body.category) caseRow.category = body.category.trim();
    if (body.summary) caseRow.summary = body.summary.trim();
    if (body.followUpAt) caseRow.followUpAt = new Date(body.followUpAt);

    if (body.status === "resolved") caseRow.resolvedAt = new Date();
    caseRow.assignedToAdminId = (req as any).admin?._id ?? null;

    await caseRow.save();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}