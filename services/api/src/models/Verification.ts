//services/api/src/models/Verification.ts
//TTL index will delete docs after expiresAt. We still store verified status before deletion.
import mongoose, { Schema, Document } from "mongoose";

export type VerificationPurpose = "phone_verification" | "parent_consent" | "other";

export interface VerificationDocument extends Document {
  phone: string;
  purpose: VerificationPurpose;
  codeHash: string; // hashed OTP
  providerRef?: string | null; // provider reference returned by SMS gateway
  attempts: number;
  verified: boolean;
  verifiedAt?: Date | null;
  createdAt: Date;
  expiresAt: Date;
  meta?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}

const VerificationSchema = new Schema<VerificationDocument>(
  {
    phone: { type: String, required: true, index: true },
    purpose: { type: String, required: true, enum: ["phone_verification", "parent_consent", "other"], default: "phone_verification" },
    codeHash: { type: String, required: true },
    providerRef: { type: String, default: null },
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false, index: true },
    verifiedAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true, index: true },
    meta: { type: Schema.Types.Mixed, default: {} },
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
  },
  { timestamps: true }
);

// TTL index: remove expired docs automatically (requires background job or TTL index on expiresAt)
VerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<VerificationDocument>("Verification", VerificationSchema);