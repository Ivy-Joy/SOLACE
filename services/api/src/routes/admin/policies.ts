// routes/admin/policies.ts
import { Router, type Router as ExpressRouter } from "express";
import {
  getPolicies,
  updatePolicy,
} from "../../controllers/admin/policyController";

const router: ExpressRouter = Router();

router.get("/", getPolicies);
router.patch("/:id", updatePolicy);

export default router;