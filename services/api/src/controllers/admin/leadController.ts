//services/api/src/controllers/admin/leadController.ts
import type { Request, Response } from "express";
import LeadApplication from "../../models/LeadApplication";
import AuditLog from "../../models/AuditLog";
import { getPagination, safeRegex } from "../../utils/adminQuery";

type LeadRow = {
  _id: { toString(): string };
  fullName: string;
  phone?: string | null;
  email?: string | null;
  preferredClass?: string | null;
  status?: string;
  spiritualStage?: string | null;
  vettingNotes?: string | null;
  serviceArea: string;
  churchSupport?: string | null;
  testimony?: string | null;
  createdAt?: Date;
  decisionAt?: Date | null;
};

function iso(value?: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export async function listLeadApplications(req: Request, res: Response) {
  try {
    const { page, limit, q, status } = getPagination(req);

    const filter: Record<string, unknown> = {};
    if (q) {
      const regex = safeRegex(q);
      filter.$or = [{ fullName: regex }, { phone: regex }, { email: regex }];
    }
    if (status) {
      filter.status = status;
    }

    const [total, rows] = await Promise.all([
      LeadApplication.countDocuments(filter),
      LeadApplication.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ]);

    const items = (rows as LeadRow[]).map((lead) => ({
      id: lead._id.toString(),
      fullName: lead.fullName,
      phone: lead.phone ?? null,
      email: lead.email ?? null,
      preferredClass: lead.preferredClass ?? null,
      serviceArea: lead.serviceArea, 
      churchSupport: lead.churchSupport ?? null, 
      testimony: lead.testimony ?? null, 
      status: lead.status ?? "submitted",
      spiritualStage: lead.spiritualStage ?? null,
      vettingNotes: lead.vettingNotes ?? null,
      createdAt: iso(lead.createdAt ?? null),
      decisionAt: iso(lead.decisionAt ?? null),
    }));

    return res.json({ items, page, limit, total });
  } catch (err) {
    console.error("listLeadApplications error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getLeadById(req: Request, res: Response) {
  try {
    const lead = await LeadApplication.findById(req.params.id).lean();
    if (!lead) {
      return res.status(404).json({ message: "Lead application not found" });
    }

    const row = lead as LeadRow;

    return res.json({
      id: row._id.toString(),
      fullName: row.fullName,
      phone: row.phone ?? null,
      email: row.email ?? null,
      preferredClass: row.preferredClass ?? null,
      serviceArea: row.serviceArea, 
      churchSupport: row.churchSupport ?? null, 
      testimony: row.testimony ?? null, 
      status: row.status ?? "submitted",
      spiritualStage: row.spiritualStage ?? null,
      vettingNotes: row.vettingNotes ?? null,
      createdAt: iso(row.createdAt ?? null),
      decisionAt: iso(row.decisionAt ?? null),
    });
  } catch (err) {
    console.error("getLeadById error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateLeadStatus(req: Request, res: Response) {
  try {
    const lead = await LeadApplication.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead application not found" });
    }

    const { status, notes } = req.body as { status?: string; notes?: string };

    const allowed = ["submitted", "screening", "interview", "approved", "rejected"] as const;
    if (!status || !allowed.includes(status as (typeof allowed)[number])) {
      return res.status(400).json({ message: "Invalid status" });
    }

    lead.status = status as "submitted" | "screening" | "interview" | "approved" | "rejected";
    lead.assignedReviewer = req.admin?._id ?? null;
    lead.vettingNotes = notes?.trim() || lead.vettingNotes || "";
    if (status === "approved" || status === "rejected") {
      lead.decisionAt = new Date();
    }

    await lead.save();

    await AuditLog.create({
      actorType: "admin",
      actorId: req.admin?._id,
      action: `lead.${status}`,
      targetType: "LeadApplication",
      targetId: lead._id,
      metadata: { leadId: lead._id.toString(), status },
      ipAddress: req.ip,
      userAgent: req.get("user-agent") ?? null,
      status: "success",
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("updateLeadStatus error", err);
    return res.status(500).json({ message: "Server error" });
  }
}