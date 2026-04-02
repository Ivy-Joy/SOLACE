import type { Request, Response } from "express";
import Member from "../../models/Member";
import AuditLog from "../../models/AuditLog";
import { getPagination, safeRegex } from "../../utils/adminQuery";

type MemberRow = {
  _id: { toString(): string };
  fullName: string;
  phone: string;
  phoneVerified?: boolean;
  email?: string | null;
  dob?: Date | null;
  country?: string | null;
  city?: string | null;
  area?: string | null;
  preferredClass?: "vuka" | "ropes" | "teens" | "mph" | "young" | null;
  gifts?: string[];
  skills?: string[];
  ministries?: string[];
  languages?: string[];
  mentorId?: { toString(): string } | null;
  spiritualStage?: "seeker" | "new_believer" | "growing" | "mature";
  vulnerabilitiesEncrypted?: string | null;
  parentalConsent?: {
    required?: boolean;
    given?: boolean;
    consentRecordId?: { toString(): string } | null;
    parentName?: string | null;
    parentPhone?: string | null;
    parentEmail?: string | null;
    submittedAt?: Date | null;
    verifiedAt?: Date | null;
  } | null;
  roles?: string[];
  source?: string | null;
  status?: "pending" | "approved" | "rejected" | "archived";
  visibilityScope?: "private" | "class" | "leaders" | null;
  profileStatus?: "locked" | "pending_consent" | "active" | null;
  classAssignedAt?: Date | null;
  leaderId?: { toString(): string } | null;
  profile?: {
    bio?: string;
    avatarUrl?: string;
    interests?: string[];
  } | null;
  lastActiveAt?: Date | null;
  onboarding?: {
    checklist?: { stepId: string; completed?: boolean; completedAt?: Date | null }[];
    buddyId?: { toString(): string } | null;
  } | null;
  points?: number;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

function iso(value?: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
}

function serializeMember(member: MemberRow) {
  return {
    id: member._id.toString(),
    fullName: member.fullName,
    phone: member.phone,
    phoneVerified: Boolean(member.phoneVerified),
    email: member.email ?? null,
    dob: iso(member.dob ?? null),
    country: member.country ?? null,
    city: member.city ?? null,
    area: member.area ?? null,
    preferredClass: member.preferredClass ?? null,
    gifts: member.gifts ?? [],
    skills: member.skills ?? [],
    ministries: member.ministries ?? [],
    languages: member.languages ?? [],
    mentorId: member.mentorId ? member.mentorId.toString() : null,
    spiritualStage: member.spiritualStage ?? "seeker",
    vulnerabilitiesEncrypted: member.vulnerabilitiesEncrypted ?? null,
    parentalConsent: member.parentalConsent
      ? {
          required: Boolean(member.parentalConsent.required),
          given: Boolean(member.parentalConsent.given),
          consentRecordId: member.parentalConsent.consentRecordId
            ? member.parentalConsent.consentRecordId.toString()
            : null,
          parentName: member.parentalConsent.parentName ?? null,
          parentPhone: member.parentalConsent.parentPhone ?? null,
          parentEmail: member.parentalConsent.parentEmail ?? null,
          submittedAt: iso(member.parentalConsent.submittedAt ?? null),
          verifiedAt: iso(member.parentalConsent.verifiedAt ?? null),
        }
      : null,
    roles: member.roles ?? [],
    source: member.source ?? null,
    status: member.status ?? "pending",
    visibilityScope: member.visibilityScope ?? "private",
    profileStatus: member.profileStatus ?? "locked",
    classAssignedAt: iso(member.classAssignedAt ?? null),
    leaderId: member.leaderId ? member.leaderId.toString() : null,
    profile: member.profile ?? null,
    lastActiveAt: iso(member.lastActiveAt ?? null),
    onboarding: {
      checklist: member.onboarding?.checklist ?? [],
      buddyId: member.onboarding?.buddyId ? member.onboarding.buddyId.toString() : null,
    },
    points: member.points ?? 0,
    tags: member.tags ?? [],
    createdAt: iso(member.createdAt ?? null),
    updatedAt: iso(member.updatedAt ?? null),
  };
}

export async function listMembers(req: Request, res: Response) {
  try {
    const { page, limit, q, status } = getPagination(req);

    const filter: Record<string, unknown> = { phoneVerified: true };
    if (q) {
      const regex = safeRegex(q);
      filter.$or = [{ fullName: regex }, { phone: regex }, { email: regex }];
    }
    if (status) filter.status = status;

    const [total, rowsRaw] = await Promise.all([
      Member.countDocuments(filter),
      Member.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ]);

    const rows = rowsRaw as unknown as MemberRow[];
    return res.json({ items: rows.map(serializeMember), page, limit, total });
  } catch (err) {
    console.error("listMembers error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getMemberById(req: Request, res: Response) {
  try {
    const row = (await Member.findById(req.params.id).lean()) as unknown as MemberRow | null;
    if (!row) return res.status(404).json({ message: "Member not found" });
    return res.json(serializeMember(row));
  } catch (err) {
    console.error("getMemberById error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateMemberStatus(req: Request, res: Response) {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const { status } = req.body as { status?: string };
    const allowed = ["pending", "approved", "rejected", "archived"] as const;
    if (!status || !allowed.includes(status as (typeof allowed)[number])) {
      return res.status(400).json({ message: "Invalid status" });
    }

    member.status = status as "pending" | "approved" | "rejected" | "archived";
    await member.save();

    await AuditLog.create({
      actorType: "admin",
      actorId: req.admin?._id,
      action: `member.status.${status}`,
      targetType: "Member",
      targetId: member._id,
      metadata: { memberId: member._id.toString(), status },
      ipAddress: req.ip,
      userAgent: req.get("user-agent") ?? null,
      status: "success",
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("updateMemberStatus error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateMemberTags(req: Request, res: Response) {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const { tags } = req.body as { tags?: string[] };
    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: "Tags must be an array" });
    }

    member.tags = normalizeList(tags);
    await member.save();

    return res.json({ ok: true });
  } catch (err) {
    console.error("updateMemberTags error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateMemberProfile(req: Request, res: Response) {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const body = req.body as {
      fullName?: string;
      phone?: string;
      email?: string | null;
      preferredClass?: "vuka" | "ropes" | "teens" | "mph" | "young" | null;
      country?: string | null;
      city?: string | null;
      area?: string | null;
      gifts?: string[];
      skills?: string[];
      ministries?: string[];
      languages?: string[];
      spiritualStage?: "seeker" | "new_believer" | "growing" | "mature";
      visibilityScope?: "private" | "class" | "leaders";
      profileStatus?: "locked" | "pending_consent" | "active";
    };

    if (body.fullName !== undefined) member.fullName = String(body.fullName).trim();
    if (body.phone !== undefined) member.phone = String(body.phone).trim();
    if (body.email !== undefined) member.email = body.email ? String(body.email).trim() : null;
    if (body.preferredClass !== undefined) member.preferredClass = body.preferredClass ?? null;
    if (body.country !== undefined) member.country = body.country ? String(body.country).trim() : null;
    if (body.city !== undefined) member.city = body.city ? String(body.city).trim() : null;
    if (body.area !== undefined) member.area = body.area ? String(body.area).trim() : null;
    if (body.gifts !== undefined) member.gifts = normalizeList(body.gifts);
    if (body.skills !== undefined) member.skills = normalizeList(body.skills);
    if (body.ministries !== undefined) member.ministries = normalizeList(body.ministries);
    if (body.languages !== undefined) member.languages = normalizeList(body.languages);
    if (body.spiritualStage !== undefined) member.spiritualStage = body.spiritualStage;
    if (body.visibilityScope !== undefined) member.visibilityScope = body.visibilityScope;
    if (body.profileStatus !== undefined) member.profileStatus = body.profileStatus;

    await member.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error("updateMemberProfile error", err);
    return res.status(500).json({ message: "Server error" });
  }
}