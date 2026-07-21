import { Router } from "express";
import { sendMessage } from "../controllers/chatController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/", authenticateToken, sendMessage);

export default router;
