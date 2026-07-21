import { Router } from "express";
import { getScholarships, getScholarshipById, createScholarship } from "../controllers/scholarshipController";
import { authenticateToken, optionalAuthenticateToken, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuthenticateToken, getScholarships);
router.get("/:id", getScholarshipById);
router.post("/", authenticateToken, requireRole(["ADMIN", "UNIVERSITY"]), createScholarship);

export default router;
