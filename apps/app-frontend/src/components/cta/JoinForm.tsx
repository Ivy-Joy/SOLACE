// apps/app-frontend/src/components/join/JoinForm.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/src/lib/api";
import { motion } from "framer-motion";

/* -------------------- Helpers -------------------- */
function calcAgeFromISO(dateString: string) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return NaN;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}

const E164_REGEX = /^\+[1-9]\d{1,14}$/;

/* -------------------- Utility Zod factories -------------------- */
const optionalString = (max: number, fieldName = "Field") =>
  z
    .union([z.string(), z.literal("")])
    .transform((v) => (v === "" ? undefined : v))
    .refine((v) => v === undefined || v.length <= max, {
      message: `${fieldName} too long`,
    })
    .optional();

const phoneSchema = z
  .union([z.string(), z.literal("")])
  .transform((v) => (v === "" ? undefined : v))
  .refine((v) => v === undefined || E164_REGEX.test(v), {
    message: "Phone must be E.164 (e.g. +254712345678)",
  })
  .optional();

const emailSchema = z
  .union([z.string(), z.literal("")])
  .transform((v) => (v === "" ? undefined : v))
  .refine((v) => v === undefined || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: "Invalid email address",
  })
  .refine((v) => v === undefined || v.length <= 254, {
    message: "Email is too long",
  })
  .optional();

const captchaSchema = z
  .union([z.string(), z.literal("")])
  .transform((v) => (v === "" ? undefined : v))
  .optional();

/* -------------------- Class mapping -------------------- */
/**
 * Use keys typed as keyof typeof CLASS_LABELS for safety
 */
const CLASS_LABELS = {
  vuka: "VUKA (Age 12)",
  ropes: "ROPEs (Age 13)",
  teens: "TEENS (14-17)",
  mph: "MPH (18-25)",
  young: "YOUNG PROFESSIONALS (18-35)",
} as const;

type ClassKey = keyof typeof CLASS_LABELS;

function getAllowedClassesForAge(age: number): ClassKey[] {
  if (Number.isNaN(age) || age < 0) return [];

  const allowed: ClassKey[] = [];

  if (age === 12) allowed.push("vuka");
  if (age === 13) allowed.push("ropes");
  if (age >= 14 && age <= 17) allowed.push("teens");
  if (age >= 18 && age <= 25) allowed.push("mph");
  if (age >= 18 && age <= 35) allowed.push("young");

  return allowed;
}

/* -------------------- Zod schema -------------------- */
const schema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long")
      .refine((s) => /^[\p{L}\p{M}\-.' ,]+$/u.test(s), {
        message: "Name contains invalid characters",
      }),

    phone: phoneSchema,
    email: emailSchema,

    // DOB is REQUIRED (used to verify class eligibility)
    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
      .refine((v) => !Number.isNaN(new Date(v).getTime()), {
        message: "Invalid date",
      })
      .refine((v) => {
        const age = calcAgeFromISO(v);
        return age >= 3 && age <= 120;
      }, {
        message: "Invalid age",
      }),

    country: optionalString(100, "Country"),
    city: optionalString(100, "City"),
    address: optionalString(200, "Address"),

    preferredClass: z.enum(["vuka", "ropes", "teens", "mph", "young"], "Please select a preferred class"),

    gifts: optionalString(200, "Gifts"),
    spiritualStage: z.enum(["seeker", "new_believer", "growing", "mature"]).optional(),
    vulnerabilities: optionalString(1000, "Vulnerabilities"),
    captchaToken: captchaSchema,
  })
  .superRefine((data, ctx) => {
    const age = calcAgeFromISO(data.dob);

    if (data.preferredClass === "vuka" && age !== 12) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredClass"], message: "VUKA is strictly for age 12" });
    }
    if (data.preferredClass === "ropes" && age !== 13) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredClass"], message: "ROPES is strictly for age 13" });
    }
    if (data.preferredClass === "teens" && (age < 14 || age > 17)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredClass"], message: "TEENS is for ages 14–17" });
    }
    if (data.preferredClass === "mph" && (age < 18 || age > 25)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredClass"], message: "MPH is for ages 18–25" });
    }
    if (data.preferredClass === "young" && (age < 18 || age > 35)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredClass"], message: "Young Professionals is for ages 18–35" });
    }
  });

type FormData = z.infer<typeof schema>;

/* -------------------- API response types -------------------- */
type RequestOtpResponse = { verificationId: string };
type ConfirmOtpResponse = { verified: boolean };
type MemberPostResponse = { parentalConsentRequired?: boolean; id?: string };

/* -------------------- Component -------------------- */
export default function JoinForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  // watch fields
  const watchedDob = watch("dob");
  const watchedPhone = watch("phone");
  const watchedPreferredClass = watch("preferredClass");

  const age = useMemo(() => {
    if (!watchedDob) return NaN;
    return calcAgeFromISO(watchedDob);
  }, [watchedDob]);

  const allowedClasses = useMemo(() => getAllowedClassesForAge(age), [age]);

  // Auto-select single allowed class or fix invalid selection
  useEffect(() => {
    if (!allowedClasses || allowedClasses.length === 0) {
      return;
    }
    const current = watchedPreferredClass as FormData["preferredClass"] | undefined;

    if (current && !allowedClasses.includes(current as ClassKey)) {
      setValue("preferredClass", allowedClasses[0]);
      return;
    }
    if (!current && allowedClasses.length === 1) {
      setValue("preferredClass", allowedClasses[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedClasses.join(","), setValue, watchedPreferredClass]);

  /* -------------------- Phone verification state -------------------- */
  const [phoneVerified, setPhoneVerified] = useState<boolean>(false);

  // OTP modal
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState<string>("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSending, setOtpSending] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const RESEND_COOLDOWN_MS = 30000; // 30s

  // pending form data when user needs to verify phone / consent
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  // parent consent state
  const [pendingSignupId, setPendingSignupId] = useState<string | null>(null);
  const [showParentModal, setShowParentModal] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  /* -------------------- OTP request / confirm handlers -------------------- */
  async function requestPhoneOtp(phone: string): Promise<void> {
    if (!phone || !E164_REGEX.test(phone)) {
      setOtpError("Enter a valid phone in E.164 format first.");
      return;
    }
    try {
      setOtpSending(true);
      setOtpError(null);
      const res = await api.post<RequestOtpResponse>("/verify/phone/request", { phone });
      setVerificationId(res.verificationId);
      setShowPhoneOtpModal(true);
      setResendDisabled(true);
      setTimeout(() => setResendDisabled(false), RESEND_COOLDOWN_MS);
    } catch (err: unknown) {
      console.error("OTP request failed", err);
      setOtpError(err instanceof Error ? err.message : "Failed to send OTP. Try again later.");
    } finally {
      setOtpSending(false);
    }
  }

  async function confirmPhoneOtp(): Promise<void> {
    if (!verificationId) {
      setOtpError("No verification in progress. Request an OTP first.");
      return;
    }
    if (!otpCode || otpCode.trim().length === 0) {
      setOtpError("Enter the OTP code.");
      return;
    }
    try {
      setOtpError(null);
      const res = await api.post<ConfirmOtpResponse>("/verify/phone/confirm", { verificationId, code: otpCode });
      if (res.verified) {
        setPhoneVerified(true);
        setShowPhoneOtpModal(false);
        setOtpCode("");
        setVerificationId(null);
        setOtpError(null);

        // submit pending form if exists
        if (pendingFormData) {
          await submitToApi(pendingFormData);
          setPendingFormData(null);
        }
      } else {
        setOtpError("OTP not valid. Try again.");
      }
    } catch (err: unknown) {
      console.error("OTP confirm failed", err);
      setOtpError(err instanceof Error ? err.message : "Failed to verify OTP. Try again.");
    }
  }

  async function resendOtp(): Promise<void> {
    if (resendDisabled) return;
    if (!watchedPhone || !E164_REGEX.test(watchedPhone)) {
      setOtpError("Enter a valid phone in E.164 format first.");
      return;
    }
    try {
      setOtpSending(true);
      setOtpError(null);
      const res = await api.post<RequestOtpResponse>("/verify/phone/request", { phone: watchedPhone });
      setVerificationId(res.verificationId);
      setShowPhoneOtpModal(true);
      setResendDisabled(true);
      setTimeout(() => setResendDisabled(false), RESEND_COOLDOWN_MS);
    } catch (err: unknown) {
      console.error("Resend failed", err);
      setOtpError(err instanceof Error ? err.message : "Failed to resend OTP. Try again later.");
    } finally {
      setOtpSending(false);
    }
  }

  /* -------------------- Final submit logic -------------------- */
  async function submitToApi(data: FormData): Promise<void> {
    try {
      // attach verificationId to payload when available (server accepts either a verified verificationId or finds verification by phone)
      const payload = {
        ...data,
        verificationId: verificationId ?? undefined,
      } as unknown as Record<string, unknown>;

      const res = await api.post<MemberPostResponse>("/members", payload);
      if (res.parentalConsentRequired && res.id) {
        setPendingSignupId(res.id);
        setShowParentModal(true);
        return;
      }
      alert("Welcome - a leader will contact you within 24 hours.");
    } catch (err: unknown) {
      console.error("Submission error", err);
      alert(err instanceof Error ? err.message : "Something went wrong. Please check your connection.");
    }
  }

  async function onSubmit(data: FormData) {
    try {
      const computedAge = calcAgeFromISO(data.dob);
      if (!Number.isNaN(computedAge) && computedAge < 18) {
        // require parental consent path (frontend UX)
        setPendingFormData(data);
        setPendingSignupId("client-temp");
        setShowParentModal(true);
        return;
      }

      // if phone is verified, submit immediately
      if (phoneVerified) {
        await submitToApi(data);
        return;
      }

      // otherwise prompt phone verification and store pending form
      setPendingFormData(data);
      if (verificationId) {
        setShowPhoneOtpModal(true);
      } else {
        await requestPhoneOtp(data.phone ?? "");
      }
    } catch (err: unknown) {
      console.error("onSubmit error", err);
      alert("Something went wrong during submit. Try again.");
    }
  }

  async function sendParentConsent() {
    try {
      if (!parentName || parentName.length < 2) {
        alert("Parent/guardian name is required.");
        return;
      }
      if (!E164_REGEX.test(parentPhone)) {
        alert("Parent phone must be in E.164 format (e.g. +254712345678).");
        return;
      }
      if (!pendingSignupId) {
        alert("Missing signup id - try again.");
        return;
      }

      await api.post("/consent/parent", {
        signupId: pendingSignupId,
        parentPhone,
        parentName,
      });

      alert("Parent consent requested - an OTP was sent to the parent. Admin will verify once confirmed.");
      setShowParentModal(false);
      setParentName("");
      setParentPhone("");
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to request parent consent. Try again or contact support.");
    }
  }

  const inputStyles =
    "w-full bg-[#F9F7F2] border border-gray-100 px-5 py-4 rounded-2xl text-sm text-dark placeholder:text-gray-400 focus:border-gold focus:ring-0 transition-all outline-none";

  return (
    <>
      <motion.form
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <input {...register("fullName")} placeholder="Full name" className={inputStyles} aria-invalid={!!errors.fullName} />
            {errors.fullName && <span className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.fullName.message}</span>}
          </div>

          <div className="relative">
            <input {...register("phone")} placeholder="Phone (e.g. +254712345678)" className={inputStyles} aria-invalid={!!errors.phone} />
            {/* Verify Phone button (only when phone looks valid) */}
            <div className="absolute right-2 top-2">
              {E164_REGEX.test(String(watchedPhone ?? "")) ? (
                <button
                  type="button"
                  onClick={() => requestPhoneOtp(String(watchedPhone ?? ""))}
                  disabled={otpSending || phoneVerified}
                  className={`py-2 px-3 rounded-xl text-[12px] font-semibold border ${phoneVerified ? "bg-green-600 text-white" : "bg-black text-white"}`}
                >
                  {phoneVerified ? "Verified" : otpSending ? "Sending..." : "Verify Phone"}
                </button>
              ) : (
                <span className="text-[11px] text-gray-400"></span>
              )}
            </div>
            {errors.phone && <span className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.phone.message}</span>}
          </div>

          <div>
            <input {...register("email")} placeholder="Email (optional)" className={inputStyles} aria-invalid={!!errors.email} />
            {errors.email && <span className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.email.message}</span>}
          </div>
        </div>

        <input {...register("dob")} placeholder="Birthday (YYYY-MM-DD)" className={inputStyles} aria-invalid={!!errors.dob} />
        {errors.dob && <span className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.dob.message}</span>}

        {/* Preferred Class: show all but disable invalid ones; preselect single allowed via effect */}
        <div>
          <label className="sr-only">Preferred Class</label>
          <select {...register("preferredClass")} className={inputStyles} aria-invalid={!!errors.preferredClass}>
            <option value="">Select your Preferred Class</option>
            {(Object.keys(CLASS_LABELS) as ClassKey[]).map((c) => {
              const isAllowed = allowedClasses.includes(c);
              return (
                <option key={c} value={c} disabled={!isAllowed}>
                  {CLASS_LABELS[c]} {!isAllowed ? " (Not eligible)" : ""}
                </option>
              );
            })}
          </select>
          {allowedClasses.length === 0 && watchedDob && !Number.isNaN(calcAgeFromISO(watchedDob)) && (
            <p className="text-[10px] text-yellow-600 mt-1">No eligible classes for this age - contact admin.</p>
          )}
          {errors.preferredClass && <span className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.preferredClass.message}</span>}
        </div>

        <textarea {...register("vulnerabilities")} placeholder="One thing you're struggling with (Optional & Confidential)" className={`${inputStyles} h-32 resize-none`} />
        {errors.vulnerabilities && <span className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.vulnerabilities.message}</span>}

        <button
          type="submit"
          disabled={isSubmitting || !phoneVerified}
          className="w-full bg-dark text-white disabled:opacity-50 hover:bg-gold hover:text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl hover:shadow-gold/20 transition-all active:scale-[0.98]"
          title={!phoneVerified ? "Please verify your phone before joining" : undefined}
        >
          {isSubmitting ? "Submitting..." : "Join the Movement"}
        </button>

        {!phoneVerified && (
          <p className="text-center text-[11px] text-red-500 mt-2">You must verify your phone before we can process your request.</p>
        )}

        <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-6">Protected by the S.O.L.A.C.E Privacy Policy</p>
      </motion.form>

      {/* PHONE OTP MODAL */}
      {showPhoneOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-bold mb-2">Verify your phone</h3>
            <p className="text-sm text-gray-600 mb-3">We sent an OTP to <strong>{watchedPhone}</strong>. Enter it below to confirm your phone number.</p>

            <input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="Enter OTP" className={`${inputStyles} mb-3`} />

            {otpError && <p className="text-sm text-red-500 mb-2">{otpError}</p>}

            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-3 bg-dark text-white rounded-xl" onClick={confirmPhoneOtp}>Confirm OTP</button>
              <button className="flex-1 py-3 border rounded-xl" onClick={() => setShowPhoneOtpModal(false)}>Cancel</button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button className="text-sm underline" onClick={resendOtp} disabled={resendDisabled || otpSending}>
                {resendDisabled ? "Resend (wait...)" : otpSending ? "Sending..." : "Resend OTP"}
              </button>
              <button className="text-sm" onClick={() => { setShowPhoneOtpModal(false); setVerificationId(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* PARENT CONSENT MODAL (unchanged) */}
      {showParentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="font-bold mb-2">Parental / Guardian Consent</h3>
            <p className="text-sm text-gray-600 mb-4">Because the child is under 18 we need the parent/guardian to confirm consent. We&apos;ll send an OTP to the parent.</p>

            <input placeholder="Parent full name" value={parentName} onChange={(e) => setParentName(e.target.value)} className={`${inputStyles} mb-3`} />
            <input placeholder="Parent phone (+254...)" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} className={inputStyles} />
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-3 bg-dark text-white rounded-xl" onClick={sendParentConsent}>Send Consent OTP</button>
              <button className="flex-1 py-3 border rounded-xl" onClick={() => setShowParentModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}