// routes/admin/counselling.ts
import { Router, type Router as ExpressRouter } from "express";
import {
  getCases,
  getCaseById,
  updateCase,
} from "../../controllers/admin/counsellingController";

const router: ExpressRouter = Router();

router.get("/", getCases);
router.get("/:id", getCaseById);
router.patch("/:id", updateCase);

export default router;