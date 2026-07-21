import { Router } from "express";
import { analyzeCv, chat, recommendations } from "../controllers/aiController";

const router = Router();

router.post("/analyze", analyzeCv);
router.post("/chat", chat);
router.get("/recommendations", recommendations);

export default router;
