//ClassVisibilityPolicy.ts
import mongoose, { Schema, Document } from "mongoose";
import type { ClassKey } from "./ClassEnrollment";

export interface ClassVisibilityPolicyDocument extends Document {
  classKey: ClassKey;
  visibilityScope: "private" | "class" | "leaders";
  adultOnlyLiveSessions: boolean;
  allowClassPosts: boolean;
  allowClassChat: boolean;
  allowPeerDiscovery: boolean;
  moderationEnabled: boolean;
  updatedByAdminId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const ClassVisibilityPolicySchema = new Schema<ClassVisibilityPolicyDocument>(
  {
    classKey: { type: String, enum: ["vuka", "ropes", "teens", "mph", "young"], required: true, unique: true, index: true },
    visibilityScope: { type: String, enum: ["private", "class", "leaders"], default: "private" },
    adultOnlyLiveSessions: { type: Boolean, default: true },
    allowClassPosts: { type: Boolean, default: true },
    allowClassChat: { type: Boolean, default: true },
    allowPeerDiscovery: { type: Boolean, default: false },
    moderationEnabled: { type: Boolean, default: true },
    updatedByAdminId: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

export default mongoose.model<ClassVisibilityPolicyDocument>("ClassVisibilityPolicy", ClassVisibilityPolicySchema);