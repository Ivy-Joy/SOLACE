// isValidPhone helper referenced in verifyController.ts
export function isValidPhone(phone: unknown): phone is string {
  if (typeof phone !== "string") return false;
  // minimal E.164 check
  return /^\+[1-9]\d{1,14}$/.test(phone);
}