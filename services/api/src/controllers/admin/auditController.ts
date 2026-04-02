// services/api/src/controllers/admin/auditController.ts
import type { Request, Response } from "express";
import AuditLog from "../../models/AuditLog";
import { getPagination, safeRegex } from "../../utils/adminQuery";

function iso(value?: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export async function listAuditLogs(req: Request, res: Response) {
  try {
    const { page, limit, q, status } = getPagination(req);

    // -------------------------------
    // FILTER
    // -------------------------------
    const filter: Record<string, unknown> = {};

    if (q) {
      const regex = safeRegex(q);
      filter.$or = [
        { action: regex },
        { targetType: regex },
      ];
    }

    if (status === "success" || status === "failure") {
      filter.status = status;
    }

    // -------------------------------
    // QUERY
    // -------------------------------
    const [total, rows] = await Promise.all([
      AuditLog.countDocuments(filter),
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    // -------------------------------
    // NORMALIZE (_id → id)
    // -------------------------------
    const items = rows.map((log: any) => ({
      id: log._id.toString(),
      action: log.action,
      status: log.status as "success" | "failure",
      targetType: log.targetType ?? null,
      createdAt: iso(log.createdAt ?? null),
    }));

    // -------------------------------
    // RESPONSE
    // -------------------------------
    return res.json({
      items,
      page,
      limit,
      total,
    });
  } catch (err) {
    console.error("listAuditLogs error:", err);
    return res.status(500).json({
      message: "Failed to load audit logs",
    });
  }
}