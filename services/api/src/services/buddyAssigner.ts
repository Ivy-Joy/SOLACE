//lightweight assigner
import Member from "../models/Member";
import Admin from "../models/Admin";
import Buddy from "../models/BuddyAssignment";
import { queueNotification } from "./notifications";
import Audit from "../models/AuditLog";

/**
 * Simple in-memory queue to avoid concurrent assigns heavy work.
 * For production swap to Redis/Bull.
 */
const queue: string[] = [];
let running = false;

export function scheduleWorkerStartup() {
  // start a loop that checks the queue
  setInterval(() => {
    if (!running && queue.length > 0) runQueue();
  }, 2000);
}

async function runQueue() {
  running = true;
  while (queue.length > 0) {
    const memberId = queue.shift()!;
    try {
      await assign(memberId);
    } catch (err) {
      console.error("buddy assign failed", err, memberId);
    }
  }
  running = false;
}

export async function autoAssignBuddy(memberId: string) {
  queue.push(memberId);
  return { queued: true };
}

async function assign(memberId: string) {
  const member = await Member.findById(memberId);
  if (!member) throw new Error("member not found");
  // find candidate leads (role lead, with 'mentor' permission)
  const leads = await Admin.find({ role: "lead", permissions: { $in: ["mentor"] } });
  if (!leads || leads.length === 0) {
    console.warn("no leads available");
    return;
  }
  // simple load logic: count how many assignments each lead has
  const loads = await Promise.all(leads.map(async (lead) => {
    const count = await Buddy.countDocuments({ buddyAdminId: lead._id });
    return { lead, count };
  }));
  loads.sort((a, b) => a.count - b.count);
  const pick = loads[0].lead;
  const newAssign = new Buddy({ memberId: member._id, buddyAdminId: pick._id });
  await newAssign.save();
  await Audit.create({ who: pick._id, action: "auto_buddy_assign", collection: "BuddyAssignment", documentId: newAssign._id, payload: { memberId } });

  // notify buddy and member
  await queueNotification({ to: pick.phone || process.env.ADMIN_PHONE, channel: "sms", message: `You have been assigned to welcome ${member.fullName} (${member.phone}). Please contact within 48 hours.` });
  await queueNotification({ to: member.phone, channel: "sms", message: `Hi ${member.fullName}, your SOLACE buddy ${pick.name} will contact you within 48 hours.` });

  return newAssign;
}