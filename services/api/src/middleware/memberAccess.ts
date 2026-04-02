import Member from "../models/Member";

export async function canViewProfile(viewerId: string, targetId: string) {
  const target = await Member.findById(targetId);
  const viewer = await Member.findById(viewerId);

  if (!target || !viewer) return false;

  // admin bypass
  if (viewer.roles?.includes("admin")) return true;

  // self
  if (viewer.id === target.id) return true;

  // private
  if (target.visibilityScope === "private") return false;

  // class-level visibility
  if (target.visibilityScope === "class") {
    return viewer.preferredClass === target.preferredClass;
  }

  // leaders
  if (target.visibilityScope === "leaders") {
    return viewer.id === target.leaderId;
  }

  return false;
}