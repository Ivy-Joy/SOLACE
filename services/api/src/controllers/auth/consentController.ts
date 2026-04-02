// src/controllers/consentController.ts
import type { Request, Response } from "express";
import ConsentRecord from "../../models/ConsentRecord";
import Member from "../../models/Member";
import { sendOTP } from "../../utils/otp";

/**
 * POST /api/consent/parent
 * Request parent OTP. Expects { signupId, parentName, parentPhone }
 */
export async function requestParentConsent(req: Request, res: Response) {
  try {
    const { signupId, parentName, parentPhone } = req.body;
    if (!signupId || !parentPhone || !parentName) return res.status(400).json({ message: "Missing fields" });

    const member = await Member.findById(signupId);
    if (!member) return res.status(404).json({ message: "Signup not found" });

    // ensure consent record exists or create one
    let consent = await ConsentRecord.findById(member.parentalConsent?.consentRecordId ?? null);
    if (!consent) {
      consent = await ConsentRecord.create({
        subjectMemberId: member._id,
        givenBy: { name: parentName, phone: parentPhone },
        method: "sms_otp",
        status: "pending"
      });
      member.parentalConsent.consentRecordId = consent._id;
    } else {
      consent.givenBy = { name: parentName, phone: parentPhone };
      consent.method = "sms_otp";
      consent.status = "pending";
      await consent.save();
    }

    // send OTP via provider
    const sendResult = await sendOTP(parentPhone, `Please confirm consent for ${member.fullName}. Code: XXXX`); // actual provider should generate code
    if (!sendResult.success) {
      console.error("OTP send failed", sendResult.error);
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    // persist providerRef
    consent.providerRef = sendResult.providerRef;
    consent.submittedAt = new Date();
    await consent.save();

    // update member parental contact info
    member.parentalConsent.parentName = parentName;
    member.parentalConsent.parentPhone = parentPhone;
    member.parentalConsent.submittedAt = new Date();
    await member.save();

    return res.json({ ok: true, consentId: consent._id.toString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * POST /api/consent/parent/verify
 * Verify the OTP for the provided consentId. In this mock, we accept any code when using mock provider.
 * Expect { consentId, code }
 */
export async function verifyParentConsent(req: Request, res: Response) {
  try {
    const { consentId, code } = req.body;
    if (!consentId || !code) return res.status(400).json({ message: "Missing fields" });

    const consent = await ConsentRecord.findById(consentId);
    if (!consent) return res.status(404).json({ message: "Consent record not found" });

    // In production: verify code with provider using providerRef + received code
    // For mock provider: accept any 4+ digit code for demo only
    const providerOk = process.env.OTP_PROVIDER === "mock" ? true : false;

    if (!providerOk) {
      // integrate with provider verification here
      // e.g., call provider verify API using consent.providerRef and code
      return res.status(501).json({ message: "Provider verification not implemented" });
    }

    consent.status = "verified";
    consent.verifiedAt = new Date();
    await consent.save();

    // update associated member
    const member = await Member.findById(consent.subjectMemberId);
    if (member) {
      member.parentalConsent.given = true;
      member.parentalConsent.verifiedAt = new Date();
      member.parentalConsent.consentRecordId = consent._id;
      await member.save();
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}