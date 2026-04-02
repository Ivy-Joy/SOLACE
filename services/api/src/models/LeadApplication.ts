//services/api/src/models/LeadApplication.ts
import { Schema, model } from "mongoose";

const ConsentSchema = new Schema({
  accepted: { type: Boolean, default: false },
  method: String,
  parentalName: String,
  parentalPhone: String
}, { _id: false });

const LeadApplicationSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true },
  dob: Date,

  preferredClass: String, // which role/group they applied for (Ministry organs eg teens, ropes etc)

  //Specific service area (e.g., Worship, Media)
  serviceArea: { type: String, required: true }, 

  // Pastoral Care Needs (e.g., Mental Health, Food)
  churchSupport: { type: String },

  testimony: String, //mapped from the "message" field on frontend
  priorService: String, // text
  spiritualStage: String,
  disciplineEvidence: String, // notes on discipline, references
  referees: [{ name: String, phone: String, relation: String }],
  attachedDocs: [String], // URLs to ID or CV (secure storage)
  status: { type: String, enum: ["submitted","screening","interview","approved","rejected"], default: "submitted" },
  assignedReviewer: { type: Schema.Types.ObjectId, ref: "Admin", default:null },
  vettingNotes: String,
  decisionAt: Date,
  createdAt: Date
}, { timestamps: true });

export default model("LeadApplication", LeadApplicationSchema);