// src/utils/otp.ts
/*generates a secure numeric code, hashes via HMAC-SHA256 + secret, calls provider, and returns providerRef. For mock provider it logs the code to console (dev-only).*/
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

import { sendOTP as providerSendOTP } from "./otpProvider"; 

const OTP_LENGTH = Number(process.env.OTP_LENGTH ?? 6);
const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES ?? 10);
const OTP_HMAC_KEY = process.env.OTP_HMAC_KEY ?? "dev-otp-key-change-in-prod";

/**
 * Create a random numeric OTP with length OTP_LENGTH.
 */
export function generateNumericOtp(length = OTP_LENGTH): string {
  const max = 10 ** length;
  const num = crypto.randomInt(max / 10, max); // ensure leading digit not zero
  return String(num).padStart(length, "0");
}

/**
 * Hash OTP with HMAC for storage.
 */
export function hashOtp(otp: string): string {
  return crypto.createHmac("sha256", OTP_HMAC_KEY).update(otp).digest("hex");
}

/**
 * TTL helper
 */
export function computeExpiryDate(minutes = OTP_TTL_MINUTES): Date {
  return new Date(Date.now() + minutes * 60_000);
}

/**
 * sendOTP wrapper that delegates to provider. Returns providerRef and the plain OTP *only for mock provider*.
 * PRODUCTION: providerRef is returned, but plainCode is NEVER returned by server to client.
 */
export async function sendOTP(toPhone: string, messageTemplate?: string): Promise<{ success: boolean; providerRef?: string; code?: string; error?: string; expiresAt?: Date }> {
  const provider = process.env.OTP_PROVIDER ?? "mock";
  const code = generateNumericOtp();

  // For mock: log and return code for dev testing (server console)
  if (provider === "mock") {
    const providerRef = `mock-${Date.now()}`;
    // in dev we print the message + code to server console
    console.log(`[MOCK OTP] to=${toPhone} code=${code} message=${messageTemplate ?? ""}`);
    return { success: true, providerRef, code, expiresAt: computeExpiryDate() };
  }

  // Production provider integration goes here. Example: Twilio, Africa's Talking, etc.
  try {
    const result = await providerSendOTP(toPhone, messageTemplate?.replace("{{code}}", code) ?? `Your verification code is ${code}`);
    // providerSendOTP should return { success: boolean, providerRef?: string }
    if (!result.success) {
      return { success: false, error: result.error ?? "provider error" };
    }
    if(!result.providerRef){
      return {
        success: false,
        error: "Missing providerRef from OTP provider",
      };
    }
    return { success: true, providerRef: result.providerRef, expiresAt: computeExpiryDate()};
  } catch (err) {
    return { success: false, error: (err as Error).message ?? "unknown" };
  }
}