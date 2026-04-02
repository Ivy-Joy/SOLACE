// services/api/src/models/PrayerRequest.ts
import { Schema, model, type Types } from "mongoose";

const PrayerRequestSchema = new Schema(
  {
    title: { type: String, default: "" },
    textEncrypted: { type: String, required: true },
    excerpt: { type: String },
    nameEncrypted: { type: String },
    phoneEncrypted: { type: String },
    email: { type: String },
    dob: Date,
    consentToContact: { type: Boolean, default: false },
    anonymous: { type: Boolean, default: true },
    language: { type: String, default: "en" },
    pastoralNotesEncrypted: { type: String },

    prayersCount: { type: Number, default: 0 },
    answered: { type: Boolean, default: false },
    answeredAt: Date,
    answerText: String,

    hidden: { type: Boolean, default: false },
    escalated: { type: Boolean, default: false },
    escalatedNote: String,

    moderatedByAdminId: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
    moderatedAt: { type: Date, default: null },
    moderationAction: {
      type: String,
      enum: ["answered", "hidden", "unhidden", "escalated", "clear_escalation"],
      default: null,
    },
    moderationNote: { type: String, default: null },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("PrayerRequest", PrayerRequestSchema);