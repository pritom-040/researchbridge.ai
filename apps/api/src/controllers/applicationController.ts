import { Request, Response } from "express";
import { prisma } from "@repo/database";

export const applyForScholarship = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { scholarshipId } = req.body;

    if (!scholarshipId) {
      res.status(400).json({ error: "Scholarship ID is required" });
      return;
    }

    // Get the student profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      res.status(404).json({ error: "Student profile not found. Please complete your profile first." });
      return;
    }

    // Check if scholarship exists
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId }
    });

    if (!scholarship) {
      res.status(404).json({ error: "Scholarship not found" });
      return;
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        studentId: profile.id,
        scholarshipId: scholarshipId
      }
    });

    if (existingApplication) {
      res.status(400).json({ error: "You have already applied for this scholarship" });
      return;
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        studentId: profile.id,
        scholarshipId: scholarshipId,
        status: "SUBMITTED",
        appliedAt: new Date()
      }
    });

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
};

export const checkApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const scholarshipId = req.params.scholarshipId as string;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      res.json({ applied: false });
      return;
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        studentId: profile.id,
        scholarshipId: scholarshipId
      }
    });

    res.json({ applied: !!existingApplication, status: existingApplication?.status });
  } catch (error) {
    console.error("Check status error:", error);
    res.status(500).json({ error: "Failed to check application status" });
  }
};

export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const profile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      res.json([]);
      return;
    }

    const applications = await prisma.application.findMany({
      where: { studentId: profile.id },
      include: {
        scholarship: {
          include: {
            university: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(applications);
  } catch (error) {
    console.error("Failed to fetch applications", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};
