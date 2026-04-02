//services/api/src/routes/auth/auth.ts
//admin signup/login
//import express from "express";
import { Router, type Router as ExpressRouter } from "express";
import { bootstrapAdmin, loginAdmin, me } from "../../controllers/auth/authController";
import { requireAdmin } from "../../middleware/requireAdmin";

const router: ExpressRouter = Router();

router.post("/bootstrap", bootstrapAdmin);
router.post("/login", loginAdmin);
router.get("/me", requireAdmin, me);

export default router;