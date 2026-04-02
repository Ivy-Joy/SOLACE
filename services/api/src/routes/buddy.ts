import express from "express";
import { requireAdmin } from "../middleware/requireAdmin";
import BuddyAssignment from "../models/BuddyAssignment";
import { autoAssignBuddy } from "../services/buddyAssigner";

const router = express.Router();

// admin can trigger auto-assign for a member
router.post("/assign/:memberId", requireAdmin, async (req, res) => {
  const { memberId } = req.params;
  try {
    const result = await autoAssignBuddy(memberId);
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, message: String(err) });
  }
});

// list assignments (admin)
router.get("/", requireAdmin, async (req, res) => {
  const items = await BuddyAssignment.find().sort({ createdAt: -1 }).limit(200);
  res.json(items);
});

export default router;