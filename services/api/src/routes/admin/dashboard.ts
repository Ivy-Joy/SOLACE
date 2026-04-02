import { Router, type Router as ExpressRouter } from "express";
import { getDashboardMetrics } from "../../controllers/admin/dashboardController";

const router:ExpressRouter = Router();

router.get("/metrics", getDashboardMetrics);

export default router;