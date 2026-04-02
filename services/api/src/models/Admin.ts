//services/api/src/models/Admin.ts
import mongoose, { Schema, type Document } from "mongoose";

export type AdminRole = "admin" | "lead" | "finance" | "pastor";

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  permissions: string[];
  phone?: string;
  safeguardingCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "lead", "finance", "pastor"], required: true, default: "admin" },
    permissions: { type: [String], default: [] },
    phone: { type: String, default: undefined },
    safeguardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IAdmin>("Admin", AdminSchema);