// routes/admin/chat.ts
import { Router, type Router as ExpressRouter } from "express";
import {
  getChatMessages,
  getChatMessageById,
  moderateChatMessage,
} from "../../controllers/admin/chatController";

const router: ExpressRouter = Router();

//Specific class messages
router.get("/class/:classKey", getChatMessages);
//All messages (optional)
router.get("/", getChatMessages);
router.get("/:id", getChatMessageById);
router.patch("/:id", moderateChatMessage);

export default router;