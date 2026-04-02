// models/events/Waitlist.ts
import { Schema, model, Types } from "mongoose";

const WaitlistSchema = new Schema({
  eventId: { type: Types.ObjectId, ref: "Event", required: true, index: true },
  name: String,
  email: String,
  phone: String,
  position: Number,
  createdAt: { type: Date, default: () => new Date() }
});

export default model("Waitlist", WaitlistSchema);