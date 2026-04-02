//admin/event.ts
import { Router, type Router as ExpressRouter } from "express";
import {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../controllers/admin/eventController";

const router:ExpressRouter = Router();

router.get("/", listEvents);
router.post("/", createEvent);
router.get("/:id", getEventById);
router.patch("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;