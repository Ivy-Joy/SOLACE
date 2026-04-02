//services/api/src/routes/auth/verify.ts
import { Router, type Router as ExpressRouter } from "express";
import { requestPhoneVerification, confirmPhoneVerification } from "../../controllers/auth/verifyController";

const router: ExpressRouter = Router();

router.post("/phone/request", requestPhoneVerification);
router.post("/phone/confirm", confirmPhoneVerification);

export default router;