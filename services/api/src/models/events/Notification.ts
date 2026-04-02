// models/events/Notification.ts
import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
  type: String, // 'email','sms','push'
  to: Schema.Types.Mixed, // {email:..} or {phone:..}
  payload: Schema.Types.Mixed,
  scheduledFor: Date,
  status: { type: String, enum: ['pending','sent','failed','cancelled'], default: 'pending' },
  attempts: { type: Number, default: 0 },
  lastError: String
}, { timestamps: true });

export default model("Notification", NotificationSchema);