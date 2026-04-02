import type { Request, Response } from "express";
import ClassEnrollment from "../../models/ClassEnrollment";
import Member from "../../models/Member";

const toId = (value: unknown): string => (value ? String(value) : "");
const iso = (value?: Date | null): string | null => (value ? value.toISOString() : null);

function serializeEnrollment(enrollment: any) {
  return {
    id: toId(enrollment._id),
    memberId: toId(enrollment.memberId),
    classKey: enrollment.classKey,
    status: enrollment.status ?? "pending",
    appliedAt: iso(enrollment.appliedAt ?? null),
    parentConsentGiven: Boolean(enrollment.parentConsentGiven),
  };
}

export async function getEnrollments(_req: Request, res: Response) {
  try {
    const rows = await ClassEnrollment.find().sort({ appliedAt: -1 }).limit(100).lean();
    return res.json({ items: rows.map(serializeEnrollment) });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateEnrollmentStatus(req: Request, res: Response) {
  try {
    const enrollment = await ClassEnrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    const { status, decisionReason, visibilityScope } = req.body;
    enrollment.status = status;
    enrollment.decisionReason = decisionReason?.trim() || null;
    enrollment.reviewedAt = new Date();
    enrollment.reviewedByAdminId = (req as any).admin?._id ?? null;
    enrollment.profileLocked = status !== "approved";

    await enrollment.save();

    const member = await Member.findById(enrollment.memberId);
    if (member) {
      member.status = status === "approved" ? "approved" : "rejected";
      if (visibilityScope) member.visibilityScope = visibilityScope;
      await member.save();
    }

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}