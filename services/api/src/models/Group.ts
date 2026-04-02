//services/api/src/models/Group.ts
import { Schema, model } from 'mongoose'

const GroupSchema = new Schema({
  key: { type: String, required: true, unique: true }, // vuka, ropes, teens...
  name: { type: String, required: true },
  ageMin: Number,
  ageMax: Number,
  leaderIds: [{ type: Schema.Types.ObjectId, ref: 'Admin' }],
  description: String
}, { timestamps: true })

export default model('Group', GroupSchema)