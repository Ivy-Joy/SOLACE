//services/api/src/models/BuddyAssignment.ts
import mongoose, { Schema } from "mongoose";

const BuddySchema = new Schema({
  memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true, index: true },
  buddyAdminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  assignedByAdminId: { type: Schema.Types.ObjectId, ref: "Admin" },
  assignedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["assigned","contacted","confirmed"], default: "assigned" },
  lastContactAt: Date
}, { timestamps: true });

export default mongoose.model("BuddyAssignment", BuddySchema);