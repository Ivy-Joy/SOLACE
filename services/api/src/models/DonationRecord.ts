//DonationRecords.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface DonationRecordDocument extends Document {
  memberId?: Types.ObjectId | null;
  donorName: string;
  donorPhone?: string | null;
  donorEmail?: string | null;
  currency: string;
  totalAmount: number;
  giftCount: number;
  firstGiftAt: Date;
  lastGiftAt: Date;
  recurring: boolean;
  retained: boolean;
  lapsedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const DonationRecordSchema = new Schema<DonationRecordDocument>(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", default: null, index: true },
    donorName: { type: String, required: true, index: true },
    donorPhone: { type: String, default: null },
    donorEmail: { type: String, default: null },
    currency: { type: String, default: "KES" },
    totalAmount: { type: Number, default: 0 },
    giftCount: { type: Number, default: 0 },
    firstGiftAt: { type: Date, default: Date.now, index: true },
    lastGiftAt: { type: Date, default: Date.now, index: true },
    recurring: { type: Boolean, default: false },
    retained: { type: Boolean, default: true, index: true },
    lapsedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<DonationRecordDocument>("DonationRecord", DonationRecordSchema);