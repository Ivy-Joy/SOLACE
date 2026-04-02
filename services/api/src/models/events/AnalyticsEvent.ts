// models/events/AnalyticsEvent.ts
import { Schema, model } from "mongoose";

const AnalyticsEventSchema = new Schema({
  event: String, // e.g., "registration_created", "checked_in", "email_opened"
  eventAt: { type: Date, default: () => new Date() },
  actorId: Schema.Types.ObjectId, // memberId/adminId
  eventId: Schema.Types.ObjectId, // optional - related Event
  props: Schema.Types.Mixed
}, { timestamps: true });

AnalyticsEventSchema.index({ event: 1, eventAt: -1 });
export default model("AnalyticsEvent", AnalyticsEventSchema);