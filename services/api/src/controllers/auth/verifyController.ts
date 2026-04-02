//services/api/src/controllers/auth/verifyController.ts
import type { Request, Response } from "express";
import Verification from "../../models/Verification";
import { sendOTP, hashOtp, computeExpiryDate, generateNumericOtp } from "../../utils/otp";
import { hash as shaHash } from "crypto";
import { isValidPhone } from "../../utils/phone"; 

/**
 * POST /api/verify/phone/request
 * Body: { phone: string, purpose?: "phone_verification" | "parent_consent" }
 * Returns: { verificationId: string }
 */
export async function requestPhoneVerification(req: Request, res: Response) {
  try {
    const { phone, purpose = "phone_verification" } = req.body as { phone?: string; purpose?: string };

    if (!phone || !isValidPhone(phone)) return res.status(400).json({ message: "Invalid phone (use E.164)" });

    // Rate limiting: check recent requests in DB (simple check)
    const recent = await Verification.findOne({ phone }).sort({ createdAt: -1 }).lean();
    if (recent && !recent.verified && recent.expiresAt > new Date()) {
      // optional: limit another request within 30s
      const madeAt = recent.createdAt;
      if (Date.now() - (madeAt?.getTime() ?? 0) < 10_000) {
        return res.status(429).json({ message: "Too many requests, wait a bit." });
      }
    }

    const sendResult = await sendOTP(phone, `Your SOLACE verification code is {{code}}`);
    if (!sendResult.success) {
      return res.status(500).json({ message: "Failed to send OTP", error: sendResult.error });
    }

    // For mock provider we got sendResult.code: plain OTP for dev logs; in prod it will be undefined
    const plainCode = (sendResult as { code?: string }).code ?? generateNumericOtp(); // fallback (won't be used in prod)
    const codeHash = hashOtp(plainCode);
    const expiresAt = sendResult.expiresAt ?? computeExpiryDate();

    const verification = await Verification.create({
      phone,
      purpose: purpose === "parent_consent" ? "parent_consent" : "phone_verification",
      codeHash,
      providerRef: sendResult.providerRef ?? null,
      expiresAt,
      ip: req.ip,
      userAgent: req.get("user-agent") ?? null
    });

    // In development we might include the code in server response (ONLY for mock),
    // but for safety we will not send the plain code to client. Developer checks server logs.
    return res.status(201).json({ verificationId: verification._id.toString() });
  } catch (err) {
    console.error("requestPhoneVerification error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/verify/phone/confirm
 * Body: { verificationId: string, code: string }
 * Returns: { verified: boolean }
 */
export async function confirmPhoneVerification(req: Request, res: Response) {
  try {
    const { verificationId, code } = req.body as { verificationId?: string; code?: string };
    if (!verificationId || !code) return res.status(400).json({ message: "Missing fields" });

    const verification = await Verification.findById(verificationId);
    if (!verification) return res.status(404).json({ message: "Verification not found" });

    if (verification.verified) return res.status(200).json({ verified: true });

    if (verification.expiresAt < new Date()) {
      return res.status(410).json({ message: "Verification expired" });
    }

    // Compare hashed code (use same hash function)
    const codeHash = hashOtp(code);
    // Constant-time compare
    const matches = cryptoSafeCompare(verification.codeHash, codeHash);
    if (!matches) {
      verification.attempts = verification.attempts + 1;
      await verification.save();
      return res.status(400).json({ verified: false, message: "Invalid code" });
    }

    verification.verified = true;
    verification.verifiedAt = new Date();
    await verification.save();

    return res.json({ verified: true });
  } catch (err) {
    console.error("confirmPhoneVerification error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/* Helper utilities inside this file */

import crypto from "crypto";

function cryptoSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}