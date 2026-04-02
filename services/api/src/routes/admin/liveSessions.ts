// routes/admin/liveSessions.ts
import { Router, type Router as ExpressRouter } from "express";
import {
  getLiveSessions,
  getLiveSessionById,
  createLiveSession,
  updateLiveSession,
} from "../../controllers/admin/liveSessionController";

const router: ExpressRouter = Router();

router.get("/", getLiveSessions);
router.get("/:id", getLiveSessionById);
router.post("/", createLiveSession);
router.patch("/:id", updateLiveSession);

export default router;