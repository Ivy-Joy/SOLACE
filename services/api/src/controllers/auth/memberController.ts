// services/api/src/controllers/auth/memberController.ts
import type { Request, Response } from "express";
import Member from "../../models/Member";
import ConsentRecord from "../../models/ConsentRecord";
import { isUnderAge } from "../../utils/age";
import { encryptField } from "../../utils/crypto";
//import type { DocumentDefinition } from "mongoose";

/**
 * POST /api/members
 * Create a member. Server computes age authoritatively.
 * If under threshold (18) we create a member with parentalConsent.required = true
 * and return { parentalConsentRequired: true, id: member._id } to let front end show modal.
 */
export async function createMember(req: Request, res: Response) {
  try {
    const body = req.body as Record<string, unknown>;

    // Basic required fields
    if (!body.fullName || !body.phone || !body.preferredClass) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Enforce phone verification: expect verificationId in body (or check existing verified record)
    const verificationId = typeof body.verificationId === "string" ? body.verificationId : null;
    const phone = String(body.phone);

    // Quick check: is there a verified Verification record for this phone & purpose=phone_verification?
    const Verification = (await import("../../models/Verification")).default;
    let phoneVerified = false;

    if (verificationId) {
      const v = await Verification.findById(verificationId);
      if (v && v.phone === phone && v.verified && v.expiresAt > new Date()) {
        phoneVerified = true;
      }
    } else {
      // fallback: find any recent verified verification for this phone
      const v = await Verification.findOne({ phone: phone, purpose: "phone_verification", verified: true }).sort({ verifiedAt: -1 }).lean();
      if (v && v.verified && v.expiresAt > new Date()) phoneVerified = true;
    }

    if (!phoneVerified) {
      return res.status(400).json({ message: "Phone not verified. Please verify phone before submitting." });
    }

    // now compute parental consent
    //const parentRequired = isUnderAge(body.dob ?? null, 18);
    //const dobValue = body.dob ? new Date(String(body.dob)) : null;

    //DOB handling...
    const rawDob = body.dob;

    let dobInput: string | Date | null = null;

    if (typeof rawDob === "string" || rawDob instanceof Date) {
      dobInput = rawDob;
    }

    const parentRequired = isUnderAge(dobInput, 18);

    const dobValue: Date | null =
      typeof rawDob === "string" ? new Date(rawDob) :
      rawDob instanceof Date ? rawDob :
      null;

    const payload: Record<string, unknown> = {
      fullName: body.fullName,
      phone,
      phoneVerified: true,
      email: body.email ?? null,
      dob: dobValue,
      country: body.country ?? null,
      city: body.city ?? null,
      area: body.address ?? null,
      preferredClass: body.preferredClass,
      gifts: Array.isArray(body.gifts) ? body.gifts : body.gifts ? [body.gifts] : [],
      skills: body.skills ?? [],
      languages: body.languages ?? [],
      spiritualStage: body.spiritualStage ?? "seeker",
      parentalConsent: {
        required: parentRequired,
        given: false
      },
      vulnerabilitiesEncrypted: body.vulnerabilities ? encryptField(String(body.vulnerabilities)) : null,
      source: body.source ?? "website"
    };

    const member = await Member.create(payload);

    if (parentRequired) {
      const consent = await ConsentRecord.create({
        subjectMemberId: member._id,
        consentFor: "onboarding",
        status: "pending"
      });
      member.parentalConsent = {
        ...member.parentalConsent,
        consentRecordId: consent._id,
        submittedAt: new Date()
      };
      await member.save();
      return res.status(201).json({ parentalConsentRequired: true, id: member._id.toString() });
    }

    // success (no parental consent needed)
    return res.status(201).json({ parentalConsentRequired: false, id: member._id.toString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * GET /api/members/:id
 * Return member details only to authorized roles (middleware must enforce).
 */
export async function getMember(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const member = await Member.findById(id).lean();
    if (!member) return res.status(404).json({ message: "Not found" });

    // NOTE: enforce RBAC in route/middleware; this controller returns the full member object
    return res.json(member);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

/**
 * Admin approves a member (simple example)
 */
export async function approveMember(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const member = await Member.findById(id);
    if (!member) return res.status(404).json({ message: "Not found" });

    member.status = "approved";
    await member.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}