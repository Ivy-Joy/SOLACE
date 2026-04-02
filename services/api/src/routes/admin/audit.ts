//admin/audit.ts
import { Router, type Router as ExpressRouter } from "express";
import { listAuditLogs } from "../../controllers/admin/auditController";

const router:ExpressRouter = Router();

router.get("/", listAuditLogs);

export default router;