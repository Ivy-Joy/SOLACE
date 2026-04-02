//src/routes/metrics.ts
//aggregated admin metrics
import express from "express";
import { Router as ExpressRouter, Router, type Request, type Response } from "express";
import Member from "../models/Member";
import LeadApplication from "../models/LeadApplication";
import Buddy from "../models/BuddyAssignment";
import { requireAdmin } from "../middleware/requireAdmin";

const router: ExpressRouter = Router();

router.use(requireAdmin);

router.get("/", async (req, res) => {
  const thirtyDays = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  const newSignups = await Member.countDocuments({ createdAt: { $gte: thirtyDays } });
  const openApplications = await LeadApplication.countDocuments({ status: { $in: ["submitted", "screening", "interview"] } });
  const activeLeads = await (await (await import("../models/Admin")).default.find({ role: "lead" })).length;

  // buddy SLA (rough)
  const assignments = await Buddy.find({ createdAt: { $gte: thirtyDays } });
  let within48 = 0;
  for (const a of assignments) {
    if (a.lastContactAt && a.lastContactAt.getTime() - a.assignedAt.getTime() <= 1000 * 60 * 60 * 48) within48++;
  }
  const buddySLA = assignments.length > 0 ? Math.round((within48 / assignments.length) * 100) : 100;

  res.json({
    newSignups,
    openApplications,
    activeLeads,
    buddySLA
  });
});

export default router;