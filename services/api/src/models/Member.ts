// services/api/src/models/Member.ts
import mongoose, { Schema, Types, Document } from "mongoose";

/** 1) TS interface for Member document */
export interface IMember {
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
  mentorId?: Types.ObjectId | null;
  spiritualStage?: "seeker" | "new_believer" | "foundation" | "serve" | "leader";
  vulnerabilitiesEncrypted?: string | null;
  parentalConsent?: {
    required?: boolean;
    given?: boolean;
    consentRecordId?: Types.ObjectId | null;
    parentName?: string | null;
    parentPhone?: string | null;
    parentEmail?: string | null;
    submittedAt?: Date | null;
    verifiedAt?: Date | null;
  } | null;
  roles?: string[];
  source?: string;
  status?: "pending" | "approved" | "rejected" | "archived";

  visibilityScope?: "private" | "class" | "leaders" | null;
  profileStatus?: "locked" | "pending_consent" | "active" | null;

  classAssignedAt?: Date | null;
  leaderId?: Types.ObjectId | null;

  profile?: {
    bio?: string;
    avatarUrl?: string;
    interests?: string[];
  } | null;

  lastActiveAt?: Date | null;

  onboarding?: {
    checklist?: { stepId: string; completed?: boolean; completedAt?: Date | null }[];
    buddyId?: Types.ObjectId | null;
  } | null;
  points?: number;
  tags?: string[];
}

export interface MemberDocument extends IMember, Document {}

const ParentalConsentSchema = new Schema(
  {
    required: { type: Boolean, default: false },
    given: { type: Boolean, default: false },
    consentRecordId: { type: Schema.Types.ObjectId, ref: "ConsentRecord", default: null },
    parentName: { type: String, default: null },
    parentPhone: { type: String, default: null },
    parentEmail: { type: String, default: null },
    submittedAt: { type: Date, default: null },
    verifiedAt: { type: Date, default: null }
  },
  { _id: false }
);

const MemberSchema = new Schema<MemberDocument>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    phoneVerified: { type: Boolean, default: false, index: true }, // fix: boolean
    email: { type: String, index: true, default: null },
    dob: { type: Date, default: null }, // nullable date (avoid undefined)
    country: { type: String, default: null },
    city: { type: String, default: null },
    area: { type: String, default: null },
    preferredClass: { type: String, enum: ["vuka", "ropes", "teens", "mph", "young"], default: null },
    gifts: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    ministries: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    mentorId: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    spiritualStage: { type: String, enum: ["seeker", "new_believer", "foundation", "serve", "leader"], default: "seeker" },
    vulnerabilitiesEncrypted: { type: String, default: null },
    parentalConsent: { type: ParentalConsentSchema, default: () => ({}) },
    roles: { type: [String], default: ["member"] },
    source: { type: String, default: null },
    status: { type: String, enum: ["pending", "approved", "rejected", "archived"], default: "pending" },

    visibilityScope: {
      type: String,
      enum: ["private", "class", "leaders"],
      default: "private",
    },

    profileStatus: {
      type: String,
      enum: ["locked", "pending_consent", "active"],
      default: "locked",
    },

    classAssignedAt: { type: Date, default: null },

    leaderId: { type: Schema.Types.ObjectId, ref: "Admin", default: null },

    profile: {
      bio: { type: String, default: "" },
      avatarUrl: { type: String, default: "" },
      interests: { type: [String], default: [] },
    },

    lastActiveAt: { type: Date, default: null },

    onboarding: {
      checklist: { type: [{ stepId: String, completed: Boolean, completedAt: Date }], default: [] },
      buddyId: { type: Schema.Types.ObjectId, ref: "Member", default: null }
    },
    points: { type: Number, default: 0 },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

// export typed model
export default mongoose.model<MemberDocument>("Member", MemberSchema);