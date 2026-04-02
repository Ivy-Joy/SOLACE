//services/api/routes/admin/member.ts
import { Router, type Router as ExpressRouter } from "express";
import 
{ 
    listMembers,
    getMemberById,
    updateMemberStatus,
    updateMemberTags,
    updateMemberProfile,
} from "../../controllers/admin/memberController";

const router:ExpressRouter = Router();

router.get("/", listMembers);
router.get("/:id", getMemberById);
router.patch("/:id/profile", updateMemberProfile);
router.patch("/:id/status", updateMemberStatus);
router.patch("/:id/tags", updateMemberTags);


export default router;