// src/utils/age.ts
import { differenceInYears, isBefore } from "date-fns";

/**
 * Compute exact age in years based on DOB (ISO string or Date).
 * Uses date-fns to avoid float math inaccuracies.
 */
export function computeAge(dobInput?: string | Date | null): number | null {
  if (!dobInput) return null;
  const dob = typeof dobInput === "string" ? new Date(dobInput) : dobInput;
  if (isNaN(dob.getTime())) return null;
  return differenceInYears(new Date(), dob);
}

/**
 * Helper: returns true if person is under given age threshold.
 */
export function isUnderAge(dobInput: string | Date | null, threshold = 18): boolean {
  const age = computeAge(dobInput);
  if (age === null) return false;
  return age < threshold;
}