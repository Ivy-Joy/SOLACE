//services/api/src/routes/leadApplications.ts
//import express from "express";
import { Router, type Router as ExpressRouter, type Request, type Response } from "express";
import { z } from "zod";
import LeadApplication from "../models/LeadApplication";
import { queueNotification } from "../services/notifications";

//const router = express.Router();
const router: ExpressRouter = Router();

const AppSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().optional(),
  dob: z.string().optional(),
  preferredClass: z.string().optional(),
  testimony: z.string().optional(),
  priorService: z.string().optional(),
  referees: z.array(z.object({ name: z.string(), phone: z.string(), relation: z.string() })).optional()
});

router.post("/", async (req, res) => {
  const p = AppSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.format() });
  const app = new LeadApplication(p.data as any);
  await app.save();
  // notify admin (simple)
  await queueNotification({
    toAdmin: true,
    channel: "email",
    subject: "New SOLACE Lead Application",
    message: `${app.fullName} applied for ${app.preferredClass || "a leadership role"}.`
  });
  res.status(201).json(app);
});

// admin listing (protect later)
router.get("/", async (req, res) => {
  const apps = await LeadApplication.find().sort({ createdAt: -1 }).limit(500);
  res.json(apps);
});

export default router;