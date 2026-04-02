//services/api/src/routes/adminVetting.ts
/*
Application submitted -pending
Assign reviewer - sceening
Reviewer evaluates
Decision made: approved - create admin, rejected - store session
*/
import { Router, type Router as ExpressRouter, type Request, type Response } from "express";
//import { Router, type Request, type Response } from "express";
import LeadApplication from "../models/LeadApplication.js";
import Admin from "../models/Admin.js";
import AuditLog from "../models/AuditLog.js";

//const router = Router();
const router: ExpressRouter = Router();

/**
 * Assign reviewer
 */
router.patch("/lead-applications/:id/assign", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { assignedReviewer } = req.body;

    if (!assignedReviewer) {
      return res.status(400).json({ message: "assignedReviewer is required" });
    }

    const app = await LeadApplication.findById(id);
    if (!app) return res.status(404).json({ message: "Not found" });

    app.assignedReviewer = assignedReviewer;
    app.status = "screening";
    await app.save();

  {
    const payload: Record<string, unknown> = {
      actorType: "admin",
      action: "lead.assign_reviewer",
      targetType: "LeadApplication",
      targetId: app._id,
      status: "success",
      metadata: { assignedReviewer }
    };
    if (req.admin?._id) payload.actorId = req.admin._id;
    await AuditLog.create(payload);
  }

    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Review decision
 */
router.patch("/lead-applications/:id/review", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, vettingNotes } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const app = await LeadApplication.findById(id);
    if (!app) return res.status(404).json({ message: "Not found" });

    const previousStatus = app.status;

    app.status = status;
    if (vettingNotes) app.vettingNotes = vettingNotes;

    if (status === "approved") {
      app.decisionAt = new Date();
    }

    await app.save();

    // review decision — replace the AuditLog.create(...) call with:
    {
      const payload: Record<string, unknown> = {
        actorType: "admin",
        action: "lead.review_decision",
        targetType: "LeadApplication",
        targetId: app._id,
        status: "success",
        metadata: { from: previousStatus, to: status }
      };
      if (req.admin?._id) payload.actorId = req.admin._id;
      await AuditLog.create(payload);
    }

    // If approved → create Admin
    if (status === "approved") {
      const bcrypt = await import("bcryptjs");

      const tempPassword = Math.random().toString(36).slice(-8);
      const hash = await bcrypt.hash(tempPassword, 10);

      const newAdmin = await Admin.create({
        name: app.fullName,
        email: app.email || `no-email+${app._id}@solace.local`,
        passwordHash: hash,
        role: "lead",
        permissions: ["mentor"]
      });

      // optional audit
      await AuditLog.create({
        actorType: "system",
        action: "admin.created_from_lead",
        targetType: "Admin",
        targetId: newAdmin._id,
        status: "success"
      });
    }

    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;