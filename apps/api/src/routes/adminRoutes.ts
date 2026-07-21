import { Router } from "express";
import { 
  getPlatformStats, getAllUsers, deleteUser, getAllAdminScholarships, 
  deleteScholarship, createScholarship, updateScholarship,
  getAllApplications, updateApplicationStatus 
} from "../controllers/adminController";
import { authenticateToken, requireRole } from "../middleware/auth";

const router = Router();

// Apply auth middleware to all admin routes
router.use(authenticateToken);
router.use(requireRole(["ADMIN"]));

router.get("/stats", getPlatformStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/scholarships", getAllAdminScholarships);
router.post("/scholarships", createScholarship);
router.patch("/scholarships/:id", updateScholarship);
router.delete("/scholarships/:id", deleteScholarship);

router.get("/applications", getAllApplications);
router.patch("/applications/:id/status", updateApplicationStatus);

export default router;
