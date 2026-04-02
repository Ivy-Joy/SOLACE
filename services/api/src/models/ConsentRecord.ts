// services/api/src/models/ConsentRecord.ts
import mongoose, { Schema } from "mongoose";

const ConsentRecordSchema = new Schema({
  subjectMemberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  consentFor: { type: String, default: "onboarding" }, // or 'giving', 'casework'
  givenBy: {
    type: { name: String, phone: String, email: String },
    required: true
  },
  method: { type: String, enum: ["sms_otp","whatsapp_otp","e_signature","in_person","upload"], default: "sms_otp" },
  providerRef: String, // provider-provided reference id for OTP or payment
  evidenceUrl: String, // encrypted location (S3 path)
  ipAddress: String,
  userAgent: String,
  status: { type: String, enum: ["pending","verified","rejected"], default: "pending" },
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: Date,
  verifiedByAdminId: { type: Schema.Types.ObjectId, ref: "Admin" },
  notes: String
}, { timestamps: true });

export default mongoose.model("ConsentRecord", ConsentRecordSchema);