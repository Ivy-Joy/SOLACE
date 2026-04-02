// services/api/src/models/Event.ts
import { Schema, model, Types } from "mongoose";

const TicketTypeSchema = new Schema({
  name: { type: String, required: true },        // e.g., "General", "VIP", "Student"
  price: { type: Number, default: 0 },           // in cents/lowest currency unit
  capacity: { type: Number, default: 0 },        // seats for this ticket type
  sold: { type: Number, default: 0 },            // increment atomically
  metadata: { type: Schema.Types.Mixed }
}, { _id: true });

const EventSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  location: {
    name: String,
    address: String,
    geo: { type: { type: String }, coordinates: [Number] } // GeoJSON optional
  },
  startAt: { type: Date, required: true },
  endAt: { type: Date },
  category: String,
  image: String,
  featured: { type: Boolean, default: false },
  capacity: { type: Number, default: 0 }, // overall capacity (sum of ticket types or physical limit)
  tickets: { type: [TicketTypeSchema], default: [] },
  published: { type: Boolean, default: false },
  organizerId: { type: Types.ObjectId, ref: "Admin" },
  meta: Schema.Types.Mixed
}, { timestamps: true });

EventSchema.index({ slug: 1 });
EventSchema.index({ startAt: 1, category: 1 });

export default model("Event", EventSchema);