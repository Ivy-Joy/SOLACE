import mongoose, { Schema, Types, Document } from "mongoose";

export interface ILiveSession {
  title: string;
  description?: string | null;
  classKey: "vuka" | "ropes" | "teens" | "mph" | "young";
  adultOnly: boolean;
  status: "scheduled" | "live" | "ended" | "cancelled";
  startsAt: Date;
  endsAt?: Date | null;
  meetingUrl?: string | null;
  roomCode?: string | null;
  hostId?: Types.ObjectId | null;
  maxParticipants?: number | null;
  createdBy?: Types.ObjectId | null;
  coverImage?: string | null;
  allowChat?: boolean;
}

export interface LiveSessionDocument extends ILiveSession, Document {}

const LiveSessionSchema = new Schema<LiveSessionDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, default: null },
    classKey: {
      type: String,
      enum: ["vuka", "ropes", "teens", "mph", "young"],
      required: true,
      index: true,
    },
    adultOnly: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["scheduled", "live", "ended", "cancelled"],
      default: "scheduled",
      index: true,
    },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, default: null },
    meetingUrl: { type: String, default: null },
    roomCode: { type: String, default: null },
    hostId: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    maxParticipants: { type: Number, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    coverImage: { type: String, default: null },
    allowChat: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<LiveSessionDocument>("LiveSession", LiveSessionSchema);