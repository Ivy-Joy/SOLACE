// routes/admin/enrollments.ts
import { Router, type Router as ExpressRouter } from "express";
import {
  getEnrollments,
  updateEnrollmentStatus,
} from "../../controllers/admin/enrollmentController";

const router: ExpressRouter = Router();

router.get("/", getEnrollments);
router.patch("/:id", updateEnrollmentStatus);

export default router;