import { Router } from "express";
import { getUniversities, getUniversityById, createUniversity } from "../controllers/universityController";
import { authenticateToken, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", getUniversities);
router.get("/:id", getUniversityById);
router.post("/", authenticateToken, requireRole(["ADMIN"]), createUniversity);

export default router;
