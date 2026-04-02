//services/api/src/routes/admin/prayer.ts
import { Router, type Router as ExpressRouter } from "express";
import {
  listPrayerRequests,
  moderatePrayerRequest,
} from "../../controllers/admin/prayerController";

const router:ExpressRouter = Router();

router.get("/", listPrayerRequests);
router.patch("/:id", moderatePrayerRequest);

export default router;