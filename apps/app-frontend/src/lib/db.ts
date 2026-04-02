// lib/db.ts
import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI!;

if (!mongoUri) throw new Error('MONGODB_URI not set');

let cached: any = globalThis._mongoose;

if (!cached) {
  cached = globalThis._mongoose = { conn: null, promise: null };
}

export async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}