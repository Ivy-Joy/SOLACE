//ClassEnrollment
import mongoose, { Schema, Document, Types } from "mongoose";

export type ClassKey = "vuka" | "ropes" | "teens" | "mph" | "young";
export type CohortType = "daily" | "weekly";
export type EnrollmentStatus = "pending" | "approved" | "rejected" | "waitlisted";

export interface ClassEnrollmentDocument extends Document {
  memberId: Types.ObjectId;
  classKey: ClassKey;
  cohortType: CohortType;
  cohortDate: Date;
  ageAtApplication?: number | null;

  status: EnrollmentStatus;
  decisionReason?: string | null;
  appliedAt: Date;
  reviewedAt?: Date | null;
  reviewedByAdminId?: Types.ObjectId | null;

  visibilityScope: "private" | "class" | "leaders";
  profileLocked: boolean;

  parentConsentRequired: boolean;
  parentConsentGiven: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ClassEnrollmentSchema = new Schema<ClassEnrollmentDocument>(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true, index: true },
    classKey: {
      type: String,
      enum: ["vuka", "ropes", "teens", "mph", "young"],
      required: true,
      index: true,
    },
    cohortType: { type: String, enum: ["daily", "weekly"], required: true, index: true },
    cohortDate: { type: Date, required: true, index: true },
    ageAtApplication: { type: Number, default: null },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "waitlisted"],
      default: "pending",
      index: true,
    },
    decisionReason: { type: String, default: null },
    appliedAt: { type: Date, default: Date.now, index: true },
    reviewedAt: { type: Date, default: null },
    reviewedByAdminId: { type: Schema.Types.ObjectId, ref: "Admin", default: null },

    visibilityScope: {
      type: String,
      enum: ["private", "class", "leaders"],
      default: "private",
    },
    profileLocked: { type: Boolean, default: true },

    parentConsentRequired: { type: Boolean, default: false },
    parentConsentGiven: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ClassEnrollmentSchema.index({ memberId: 1, cohortDate: 1, classKey: 1 }, { unique: false });

export default mongoose.model<ClassEnrollmentDocument>("ClassEnrollment", ClassEnrollmentSchema);