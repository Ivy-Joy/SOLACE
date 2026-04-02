// models/events/Registration.ts
import { Schema, model, Types } from "mongoose";

const RegistrationSchema = new Schema({
  eventId: { type: Types.ObjectId, ref: "Event", required: true, index: true },
  memberId: { type: Types.ObjectId, ref: "Member" }, // optional — guest registrations allowed
  name: String,
  email: String,
  phone: String,
  ticketTypeId: { type: Types.ObjectId }, // references Event.tickets._id
  status: { type: String, enum: ["registered","confirmed","cancelled","waitlisted"], default: "registered" },
  paid: { type: Boolean, default: false }, // set to true if paid
  paymentRef: String, // external gateway ref
  checkInAt: Date, // filled on checkin
  qrCodeId: String, // token id for qr check-in
  source: String, // web, qr, walkin, admin
  createdBy: { type: Types.ObjectId, ref: "Admin" },
  meta: Schema.Types.Mixed
}, { timestamps: true });

RegistrationSchema.index({ eventId: 1, email: 1 });
RegistrationSchema.index({ qrCodeId: 1 }, { unique: true, sparse: true });

export default model("Registration", RegistrationSchema);