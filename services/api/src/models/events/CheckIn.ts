// models/events/CheckIn.ts
import { Schema, model, Types } from "mongoose";

const CheckInSchema = new Schema({
  registrationId: { type: Types.ObjectId, ref: "Registration", required: true, index: true },
  eventId: { type: Types.ObjectId, ref: "Event", required: true },
  adminId: { type: Types.ObjectId, ref: "Admin" }, // who checked them in (nullable for self checkin)
  method: { type: String, enum: ["qr","manual","door","kiosk"], default: "qr" },
  createdAt: { type: Date, default: () => new Date() },
  meta: Schema.Types.Mixed
});

export default model("CheckIn", CheckInSchema);