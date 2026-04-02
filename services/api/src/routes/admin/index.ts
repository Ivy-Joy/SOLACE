//services/api/src/routes/admin/index.ts
import { Router, type Router as ExpressRouter } from "express";
import { requireAdmin } from "../../middleware/requireAdmin";
import dashboardRoutes from "./dashboard";
import membersRoutes from "./members";
import prayersRoutes from "./prayers";
import leadsRoutes from "./leads";
import auditRoutes from "./audit";
import eventsRoutes from "./events";

import chatRoutes from "./chat";
import liveSessionRoutes from "./liveSessions";
import enrollmentRoutes from "./enrollments";
import policyRoutes from "./policies";
import counsellingRoutes from "./counselling";

const router:ExpressRouter = Router();

router.use(requireAdmin);

router.use("/dashboard", dashboardRoutes);
router.use("/members", membersRoutes);
router.use("/prayers", prayersRoutes);
router.use("/leads", leadsRoutes);
router.use("/audit", auditRoutes);
router.use("/events", eventsRoutes);

router.use("/chat", chatRoutes);
router.use("/live-sessions", liveSessionRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/policies", policyRoutes);
router.use("/counselling", counsellingRoutes);

export default router;