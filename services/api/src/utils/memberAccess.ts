import type { IMember } from "../models/Member";

export function getAge(dob?: Date | null): number | null {
  if (!dob) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

export function isAdult(member: Pick<IMember, "dob">): boolean {
  const age = getAge(member.dob ?? null);
  return age !== null ? age >= 18 : false;
}

export function canAccessCommunity(member: Pick<IMember, "dob" | "status" | "profileStatus">): boolean {
  return isAdult(member) && member.status === "approved" && member.profileStatus === "active";
}