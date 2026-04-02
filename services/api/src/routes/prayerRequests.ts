//routes/prayerRequests.ts
import { Router as ExpressRouter, Router, type Request, type Response } from "express";
import Member from "../models/Member";
import { z } from "zod";
import PrayerRequest from "../models/PrayerRequest";
import { encryptField } from "../utils/crypto";
import { requireAdmin } from "../middleware/requireAdmin";

const router: ExpressRouter = Router();

/** list public prayer requests (paginated) */
router.get("/", async (req, res) => {
  const { limit = "20", after } = req.query;
  const lim = Math.min(Number(limit || 20), 100);

  const filter: any = { hidden: { $ne: true } };
  if (after) filter.createdAt = { $lt: new Date(String(after)) };

  const items = await PrayerRequest.find(filter)
    .sort({ createdAt: -1 })
    .limit(lim)
    .lean();

  // for public listing, do not return full `text` - return `excerpt`
  const publicItems = items.map(i => ({
    _id: i._id,
    title: i.title,
    excerpt: i.excerpt || (i.text ? i.text.slice(0, 240) + (i.text.length > 240 ? "…" : "") : ""),
    prayersCount: i.prayersCount,
    answered: i.answered,
    createdAt: i.createdAt,
    language: i.language
  }));

  res.json({ items: publicItems });
});

/** submit new request */
const SubmitSchema = z.object({
  title: z.string().max(120).optional(),
  text: z.string().min(3).max(5000),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  dob: z.string().optional(),
  consentToContact: z.boolean().optional(),
  anonymous: z.boolean().optional(),
  language: z.string().optional()
});

router.post("/", async (req, res) => {
  const result = SubmitSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.format() });

  const payload = result.data;
  // encrypt text for privacy
  const encrypted = encryptField(payload.text || "");

  const excerpt = payload.text.length > 240 ? payload.text.slice(0, 240) + "…" : payload.text;

  const doc = await PrayerRequest.create({
    title: payload.title || "",
    text: encrypted,
    excerpt,
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    dob: payload.dob ? new Date(payload.dob) : undefined,
    consentToContact: payload.consentToContact || false,
    anonymous: payload.anonymous !== false, // default true
    language: payload.language || "en"
  });

  // TODO: queue admin notification (email/SMS) for new prayer requests
  res.status(201).json({ ok: true, id: doc._id });
});

/** register an "I prayed" click */
router.post("/:id/prayed", async (req, res) => {
  const { id } = req.params;
  const doc = await PrayerRequest.findByIdAndUpdate(id, { $inc: { prayersCount: 1 } }, { new: true });
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true, prayersCount: doc.prayersCount });
});

/** admin: mark answered & add answerTestimony */
router.patch("/:id/answer", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { answered, answerText } = req.body;
  const doc = await PrayerRequest.findById(id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  doc.answered = !!answered;
  if (answered) doc.answeredAt = new Date();
  if (answerText) doc.answerText = answerText;
  await doc.save();
  res.json({ ok: true });
});

/** admin moderation */
router.patch("/:id/moderate", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { action, note } = req.body as { action: string; note?: string };
  const doc = await PrayerRequest.findById(id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  if (action === "hide") doc.hidden = true;
  if (action === "unhide") doc.hidden = false;
  if (action === "delete") await doc.remove();
  if (action === "escalate") { doc.escalated = true; doc.escalatedNote = note || ""; }

  await doc.save();
  res.json({ ok: true });
});

/** admin list (full access) */
router.get("/admin/list", requireAdmin, async (req, res) => {
  const items = await PrayerRequest.find().sort({ createdAt: -1 }).limit(500);
  res.json(items);
});

export default router;