//services/api/src/models/AuditLog.ts
import { Schema, model, Types, Document } from "mongoose";

export interface IAuditLog extends Document {
  actorType: "admin" | "member" | "system";
  actorId?: Types.ObjectId;

  action: string; // e.g. "member.create", "consent.verify", "admin.login"

  targetType?: "Member" | "Admin" | "ConsentRecord" | "BuddyAssignment" | "LeadApplication";
  targetId?: Types.ObjectId;

  metadata?: Record<string, unknown>; // safe structured context (no sensitive data)

  ipAddress?: string;
  userAgent?: string;

  status: "success" | "failure";
  errorMessage?: string;

  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorType: {
      type: String,
      enum: ["admin", "member", "system"],
      required: true,
    },

    actorId: {
      type: Schema.Types.ObjectId,
      required: false,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      enum: ["Member", "Admin", "ConsentRecord", "BuddyAssignment", "LeadApplication"],
    },

    targetId: {
      type: Schema.Types.ObjectId,
    },

    metadata: {
      type: Schema.Types.Mixed,
    },

    ipAddress: String,
    userAgent: String,

    status: {
      type: String,
      enum: ["success", "failure"],
      required: true,
    },

    errorMessage: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// 🔍 Indexes for fast querying
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ targetId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });

export default model<IAuditLog>("AuditLog", AuditLogSchema);