//services/api/src/models/ClassChatMessage.ts
import mongoose, { Schema, Document, Types } from "mongoose";
import { devNull } from "os";

export interface IClassChatMessage {
  classKey: "vuka" | "ropes" | "teens" | "mph" | "young";
  senderMemberId: Types.ObjectId;
  senderName: string;
  senderRole: "member" | "leader" | "admin";

  message: string;

  messageType?: "text" | "system" | "announcement" | "moderation";

  liveSessionId?: Types.ObjectId | null;

  hidden: boolean;

  isDeleted?: boolean;

  moderatedByAdminId?: Types.ObjectId | null;
  moderationReason?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClassChatMessageDocument extends IClassChatMessage, Document {}

const ClassChatMessageSchema = new Schema<ClassChatMessageDocument>(
  {
    classKey: { type: String, required: true, index: true },

    senderMemberId: { type: Schema.Types.ObjectId, ref: "Member", required: true, index: true },
    senderName: { type: String, required: true },
    senderRole: {
      type: String,
      enum: ["member", "leader", "admin"],
      default: "member",
    },

    message: { type: String, required: true, trim: true },

    messageType: {
      type: String,
      enum: ["text", "system", "announcement", "moderation"],
      default: "text",
    },

    liveSessionId: {
        type: Schema.Types.ObjectId,
        ref: "LiveSession",
        default: null,
    },

    hidden: { type: Boolean, default: false },
  
    isDeleted: { type: Boolean, default: false },

    moderatedByAdminId: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    moderationReason: { type: String, default: null },  },
  { timestamps: true }
);

export default mongoose.model<ClassChatMessageDocument>(
  "ClassChatMessage",
  ClassChatMessageSchema
);