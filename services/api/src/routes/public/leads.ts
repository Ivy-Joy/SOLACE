//services/api/src/routes/public/leads.ts
import { Router, type Router as ExpressRouter } from "express";
import { submitLeadApplication } from "../../controllers/public/leadController";

const router: ExpressRouter = Router();

// This is the endpoint the frontend will hit: POST /api/public/leads/apply
router.post("/apply", submitLeadApplication);

export default router;