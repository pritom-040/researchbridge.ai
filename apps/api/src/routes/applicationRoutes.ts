import { Router } from "express";
import { applyForScholarship, checkApplicationStatus, getMyApplications } from "../controllers/applicationController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/", authenticateToken, applyForScholarship);
router.get("/status/:scholarshipId", authenticateToken, checkApplicationStatus);
router.get("/my-applications", authenticateToken, getMyApplications);

export default router;
