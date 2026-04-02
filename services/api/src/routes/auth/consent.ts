// services/api/src/routes/auth/consent.ts
//import { Router } from "express";
import { Router, type Router as ExpressRouter, type Request, type Response } from "express";
import { requestParentConsent, verifyParentConsent } from "../../controllers/auth/consentController";

const router: ExpressRouter = Router();

router.post("/parent", requestParentConsent);
router.post("/parent/verify", verifyParentConsent);

export default router;