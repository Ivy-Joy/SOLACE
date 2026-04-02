// api/checkin/scan/[qrCodeId].ts (Next.js / Express)
import Registration from "../../models/events/Registration";
import CheckIn from "../../models/events/CheckIn";
import AnalyticsEvent from "../../models/events/AnalyticsEvent";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { qrCodeId } = req.query;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const registration = await Registration.findOne({ qrCodeId }).session(session);
    if (!registration) return res.status(404).json({ error: "Invalid QR" });
    if (registration.checkInAt) {
      return res.json({ ok: true, already: true });
    }

    const check = await CheckIn.create([{ registrationId: registration._id, eventId: registration.eventId, method: "qr" }], { session });
    registration.checkInAt = new Date();
    await registration.save({ session });

    await AnalyticsEvent.create([{ event: "checked_in", eventId: registration.eventId, actorId: registration._id }], { session });

    await session.commitTransaction();
    return res.json({ ok: true, checkIn: check[0] });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}