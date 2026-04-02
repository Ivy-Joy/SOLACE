import type { Request, Response } from "express";
import ClassVisibilityPolicy from "../../models/ClassVisibilityPolicy";

const toId = (value: unknown): string => (value ? String(value) : "");
const iso = (value?: Date | null): string | null => (value ? value.toISOString() : null);

function serializePolicy(policy: any) {
  return {
    id: toId(policy._id),
    classKey: policy.classKey,
    visibilityScope: policy.visibilityScope ?? "private",
    allowClassChat: Boolean(policy.allowClassChat),
    moderationEnabled: Boolean(policy.moderationEnabled),
    updatedAt: iso(policy.updatedAt ?? null),
  };
}

export async function getPolicies(_req: Request, res: Response) {
  try {
    const rows = await ClassVisibilityPolicy.find().sort({ classKey: 1 }).lean();
    return res.json({ items: rows.map(serializePolicy) });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updatePolicy(req: Request, res: Response) {
  try {
    const { classKey } = req.params;
    const update = { ...req.body, updatedByAdminId: (req as any).admin?._id ?? null };

    const policy = await ClassVisibilityPolicy.findOneAndUpdate(
      { classKey },
      { $set: update },
      { new: true, upsert: true }
    ).lean();

    return res.json({ ok: true, item: policy ? serializePolicy(policy) : null });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}