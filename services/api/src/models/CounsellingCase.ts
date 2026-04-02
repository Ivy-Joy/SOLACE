//CounsellingCase.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export type CounsellingUrgency = "urgent" | "non_urgent";
export type CounsellingStatus = "open" | "triaged" | "assigned" | "resolved" | "closed";

export interface CounsellingCaseDocument extends Document {
  memberId: Types.ObjectId;
  urgency: CounsellingUrgency;
  category: string;
  status: CounsellingStatus;
  summary: string;
  details?: string | null;
  assignedToAdminId?: Types.ObjectId | null;
  triagedAt?: Date | null;
  resolvedAt?: Date | null;
  followUpAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CounsellingCaseSchema = new Schema<CounsellingCaseDocument>(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true, index: true },
    urgency: { type: String, enum: ["urgent", "non_urgent"], required: true, index: true },
    category: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["open", "triaged", "assigned", "resolved", "closed"],
      default: "open",
      index: true,
    },
    summary: { type: String, required: true },
    details: { type: String, default: null },
    assignedToAdminId: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    triagedAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
    followUpAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<CounsellingCaseDocument>("CounsellingCase", CounsellingCaseSchema);