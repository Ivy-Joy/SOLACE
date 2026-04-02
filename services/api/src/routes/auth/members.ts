// services/api/src/routes/auth/members.ts
//import express from "express";
import { Router as ExpressRouter, Router, type Request, type Response } from "express";
import { requireMemberJwt } from "../../middleware/requireMemberJwt";
import {
  getMyProfile,
  updateMyProfile,
  getMyDashboard,
} from "../../controllers/member/memberProfileController";
import {
  getDashboard,
  listLiveSessions,
  getLiveSessionById,
  joinLiveSession,
  listClassPosts,
  createClassPost,
  listClassChat,
  sendClassChat,
} from "../../controllers/member/communityController";

const router: ExpressRouter = Router();

router.use(requireMemberJwt);

router.get("/me", getMyProfile);
router.patch("/me", updateMyProfile);
router.get("/dashboard", getMyDashboard);

router.get("/community/dashboard", getDashboard);
router.get("/live-sessions", listLiveSessions);
router.get("/live-sessions/:id", getLiveSessionById);
router.post("/live-sessions/:id/join", joinLiveSession);

router.get("/classes/:classKey/posts", listClassPosts);
router.post("/classes/:classKey/posts", createClassPost);

router.get("/classes/:classKey/chat", listClassChat);
router.post("/classes/:classKey/chat", sendClassChat);

export default router;