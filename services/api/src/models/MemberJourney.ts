//MemberJourney.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export type JourneyStage =
  | "seeker"
  | "new_believer"
  | "foundation"
  | "serve"
  | "leader"
  | "paused";

export interface MemberJourneyDocument extends Document {
  memberId: Types.ObjectId;
  stage: JourneyStage;
  progressScore: number;
  nextStep?: string | null;
  lastMilestone?: string | null;
  updatedByAdminId?: Types.ObjectId | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const MemberJourneySchema = new Schema<MemberJourneyDocument>(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true, unique: true, index: true },
    stage: {
      type: String,
      enum: ["seeker", "new_believer", "foundation", "serve", "leader", "paused"],
      default: "seeker",
      index: true,
    },
    progressScore: { type: Number, default: 0 },
    nextStep: { type: String, default: null },
    lastMilestone: { type: String, default: null },
    updatedByAdminId: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    notes: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<MemberJourneyDocument>("MemberJourney", MemberJourneySchema);