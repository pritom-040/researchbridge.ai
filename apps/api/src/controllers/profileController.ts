import { Request, Response } from "express";
import { prisma } from "@repo/database";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id; // from authenticateToken middleware

    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true } }
      }
    });

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { cgpa, major, researchInterests, testScores, skills } = req.body;

    // Check if profile exists
    const existing = await prisma.studentProfile.findUnique({ where: { userId } });
    
    let profile;
    if (existing) {
      profile = await prisma.studentProfile.update({
        where: { userId },
        data: {
          cgpa: cgpa ? parseFloat(cgpa) : undefined,
          major,
          researchInterests: researchInterests || undefined,
          testScores: testScores || undefined,
          skills: skills || undefined
        }
      });
    } else {
      profile = await prisma.studentProfile.create({
        data: {
          userId,
          cgpa: cgpa ? parseFloat(cgpa) : undefined,
          major,
          researchInterests: researchInterests || undefined,
          testScores: testScores || undefined,
          skills: skills || undefined
        }
      });
    }

    res.json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    // Fetch the user's profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    // Fetch counts
    const activeApplications = await prisma.application.count({
      where: { studentId: profile.id, status: { not: 'DRAFT' } }
    });

    const savedScholarships = await prisma.bookmark.count({
      where: { studentId: profile.id, scholarshipId: { not: null } }
    });

    // Calculate profile completion
    let completionScore = 20; // Base score for having an account
    const checklist = {
      accountCreated: true,
      hasCgpa: !!profile.cgpa,
      hasMajor: !!profile.major,
      hasSkills: profile.skills && (profile.skills as any[]).length > 0,
      hasTestScores: profile.testScores && Object.keys(profile.testScores).length > 0
    };

    if (checklist.hasCgpa) completionScore += 20;
    if (checklist.hasMajor) completionScore += 20;
    if (checklist.hasSkills) completionScore += 20;
    if (checklist.hasTestScores) completionScore += 20;

    // Fetch upcoming deadlines (limit 3)
    const upcomingApplications = await prisma.application.findMany({
      where: { 
        studentId: profile.id,
        status: { notIn: ['REJECTED', 'ACCEPTED'] }
      },
      include: { scholarship: true },
      take: 3,
      orderBy: { updatedAt: 'desc' }
    });

    // We don't have AI matches table yet, so just returning 0
    const aiMatches = 0;

    res.json({
      activeApplications,
      savedScholarships,
      profileCompletion: completionScore,
      checklist,
      aiMatches,
      timeline: upcomingApplications
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
