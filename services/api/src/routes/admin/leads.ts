//services/api/admin/leads.ts
import { Router, type Router as ExpressRouter } from "express";
import {
  listLeadApplications,
  getLeadById,
  updateLeadStatus,
} from "../../controllers/admin/leadController";

const router:ExpressRouter = Router();

router.get("/", listLeadApplications);
router.get("/:id", getLeadById);
router.patch("/:id/status", updateLeadStatus);

export default router;