//controllers/member/memberProfileController.ts
import type { Request, Response } from "express";
import Member from "../../models/Member";
import MemberJourney from "../../models/MemberJourney";

type MemberUpdateBody = {
  email?: string | null;
  country?: string | null;
  city?: string | null;
  area?: string | null;
  preferredClass?: "vuka" | "ropes" | "teens" | "mph" | "young" | null;
  gifts?: string[];
  skills?: string[];
  ministries?: string[];
  languages?: string[];
  spiritualStage?: "seeker" | "new_believer" | "foundation" | "serve" |"leader" | "paused";
};

type MemberLean = {
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
  spiritualStage?: "seeker" | "new_believer" | "foundation" | "serve" |"leader" | "paused";
  roles?: string[];
  source?: string | null;
  status?: "pending" | "approved" | "rejected" | "archived";
  visibilityScope?: "private" | "class" | "leaders" | null;
  profileStatus?: "locked" | "pending_consent" | "active" | null;
  onboarding?: {
    checklist?: { stepId: string; completed?: boolean; completedAt?: Date | null }[];
    buddyId?: { toString(): string } | null;
  } | null;
  points?: number;
  tags?: string[];
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
  createdAt?: Date;
  updatedAt?: Date;
};

function iso(value?: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getAge(dob?: Date | null): number | null {
  if (!dob) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

function checklistProgress(checklist?: { stepId: string; completed?: boolean }[]) {
  const items = checklist ?? [];
  if (items.length === 0) return { completed: 0, total: 0, percent: 0 };

  const completed = items.filter((step) => Boolean(step.completed)).length;
  return {
    completed,
    total: items.length,
    percent: Math.round((completed / items.length) * 100),
  };
}

function serializeMember(member: any) {
  const age = getAge(member.dob ?? null);
  const isAdult = age !== null ? age >= 18 : false;
  const checklist = member.onboarding?.checklist ?? [];
  const progress = checklistProgress(checklist);

  const profileStatus = member.profileStatus ?? "locked";
  const visibilityScope = member.visibilityScope ?? "private";

  return {
    id: member._id.toString(),
    fullName: member.fullName,
    phone: member.phone,
    phoneVerified: Boolean(member.phoneVerified),
    email: member.email ?? null,
    dob: iso(member.dob ?? null),
    age,

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
    roles: member.roles ?? [],
    source: member.source ?? null,
    status: member.status ?? "pending",
    points: member.points ?? 0,
    tags: member.tags ?? [],
    onboarding: {
      checklist,
      buddyId: member.onboarding?.buddyId ? member.onboarding.buddyId.toString() : null,
      progress,
    },
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
       privacy: {
      visibility: visibilityScope,
      profileStatus,
      profileLocked: profileStatus !== "active",
      profileVisible: profileStatus === "active" && isAdult,
    },
    summary: {
      isAdult,
      canJoinCommunityInteractions: isAdult && member.status === "approved",
      canSeePeers: isAdult && member.status === "approved",
      nextAction:
        member.status === "pending"
          ? "Awaiting admin review."
          : member.parentalConsent?.required && !member.parentalConsent?.given
            ? "Parent consent required."
            : member.status === "approved"
              ? "Profile active."
              : "Follow onboarding steps.",
    },
    createdAt: iso(member.createdAt ?? null),
    updatedAt: iso(member.updatedAt ?? null),
  };
}

export async function getMyProfile(req: Request, res: Response) {
  try {
    const memberId = req.memberAuth?.memberId;
    if (!memberId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const member = await Member.findById(memberId).lean();
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.json(serializeMember(member));
  } catch (err) {
    console.error("getMyProfile error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateMyProfile(req: Request, res: Response) {
  try {
    const memberId = req.memberAuth?.memberId;
    if (!memberId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const body = req.body as MemberUpdateBody;

    // --- Standard Profile Updates ---
    if (body.email !== undefined) member.email = body.email ? String(body.email).trim() : null;
    if (body.country !== undefined) member.country = body.country ? String(body.country).trim() : null;
    if (body.city !== undefined) member.city = body.city ? String(body.city).trim() : null;
    if (body.area !== undefined) member.area = body.area ? String(body.area).trim() : null;

    if (body.preferredClass !== undefined) {
      const allowed = ["vuka", "ropes", "teens", "mph", "young"] as const;
      if (body.preferredClass !== null && !allowed.includes(body.preferredClass)) {
        return res.status(400).json({ message: "Invalid preferred class" });
      }
      member.preferredClass = body.preferredClass ?? null;
    }

    if (body.gifts !== undefined) member.gifts = normalizeList(body.gifts);
    if (body.skills !== undefined) member.skills = normalizeList(body.skills);
    if (body.ministries !== undefined) member.ministries = normalizeList(body.ministries);
    if (body.languages !== undefined) member.languages = normalizeList(body.languages);

    // --- Spiritual Stage & Journey Logic ---
    if (body.spiritualStage !== undefined) {
      const allowed = ["seeker", "new_believer", "foundation", "serve", "leader", "paused"] as const;
      if (!allowed.includes(body.spiritualStage)) {
        return res.status(400).json({ message: "Invalid spiritual stage" });
      }
      
      member.spiritualStage = body.spiritualStage;

      // Upsert MemberJourney record - This is where we use the model
      await MemberJourney.findOneAndUpdate(
        { memberId: member._id },
        { 
          stage: body.spiritualStage,
          $inc: { progressScore: 5 }, 
          nextStep: "Awaiting initial mentor meeting"
        },
        { upsert: true, new: true }
      );
    }

    await member.save();

    const updated = (await Member.findById(memberId).lean()) as MemberLean | null;
    
    // THE RETURN MUST BE AT THE VERY END OF THE LOGIC
    return res.json({
      ok: true,
      profile: updated ? serializeMember(updated) : null,
    });

  } catch (err) {
    console.error("updateMyProfile error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getMyDashboard(req: Request, res: Response) {
  try {
    const memberId = req.memberAuth?.memberId;
    if (!memberId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const member = await Member.findById(memberId).lean();
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const profile = serializeMember(member);

    return res.json({
      profile,
      cards: [
        {
          title: "Class",
          value: profile.preferredClass?.toUpperCase() ?? "UNASSIGNED",
          hint: "Assigned by backend DOB rules",
        },
        {
          title: "Status",
          value: profile.status,
          hint: profile.summary.nextAction,
        },
        {
          title: "Progress",
          value: `${profile.onboarding.progress.percent}%`,
          hint: `${profile.onboarding.progress.completed}/${profile.onboarding.progress.total} checklist steps`,
        },
        {
          title: "Visibility",
          value: profile.privacy.visibility,
          hint: profile.privacy.profileLocked ? "Locked" : "Active",
        },
      ],
      permissions: {
        canJoinLiveSessions: profile.summary.canJoinCommunityInteractions,
        canSeePeers: profile.summary.canSeePeers,
        canMessageLeaders: Boolean(profile.phoneVerified),
      },
      nextAction: profile.summary.nextAction,
    });
  } catch (err) {
    console.error("getMyDashboard error", err);
    return res.status(500).json({ message: "Server error" });
  }
}