import { Router } from "express";
import { getProfile, updateProfile, getDashboardStats } from "../controllers/profileController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken, getProfile);
router.get("/dashboard", authenticateToken, getDashboardStats);
router.put("/", authenticateToken, updateProfile);

export default router;
