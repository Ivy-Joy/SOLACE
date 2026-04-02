// controllers/qr.ts
import QRCode from "qrcode";
import { nanoid } from "nanoid";
import Registration from "../models/events/Registration";

export async function generateRegistrationQr(registrationId) {
  const qrCodeId = nanoid(12); // or use uuid
  await Registration.findByIdAndUpdate(registrationId, { qrCodeId });

  const url = `${process.env.BASE_URL}/api/checkin/scan/${qrCodeId}`; // or deep link
  const dataUrl = await QRCode.toDataURL(url, { errorCorrectionLevel: 'H' });
  return { dataUrl, url, qrCodeId };
}