//ClassPost.ts
import mongoose, { Schema, Types, Document } from "mongoose";

export interface IClassPost {
  classKey: "vuka" | "ropes" | "teens" | "mph" | "young";
  authorMemberId: Types.ObjectId;
  title: string;
  body: string;
  pinned?: boolean;
  audience?: "class" | "leaders";
  status?: "draft" | "published" | "hidden" | "deleted";
  attachments?: { url: string; type?: string | null }[];
  likes?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date; 
}

export interface ClassPostDocument extends IClassPost, Document {}

const ClassPostSchema = new Schema<ClassPostDocument>(
  {
    classKey: {
      type: String,
      enum: ["vuka", "ropes", "teens", "mph", "young"],
      required: true,
      index: true,
    },
    authorMemberId: { type: Schema.Types.ObjectId, ref: "Member", required: true, index: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    pinned: { type: Boolean, default: false },
    audience: { type: String, enum: ["class", "leaders"], default: "class" },
    status: { type: String, enum: ["published", "hidden", "deleted"], default: "published" },
    attachments: {
      type: [{ url: String, type: { type: String, default: null } }],
      default: [],
    },
    likes: { type: [Schema.Types.ObjectId], ref: "Member", default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<ClassPostDocument>("ClassPost", ClassPostSchema);