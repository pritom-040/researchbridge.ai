import { Request, Response } from "express";
import { prisma } from "@repo/database";

export const getPlatformStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    const totalScholarships = await prisma.scholarship.count();
    const totalUniversities = await prisma.university.count();
    
    // You could also add applications, etc.
    const totalApplications = await prisma.application.count();

    res.json({
      totalUsers,
      totalScholarships,
      totalUniversities,
      totalApplications
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Failed to fetch platform stats" });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Only return safe fields (no passwordHash)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // pagination could be added later
    });

    res.json(users);
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        student: {
          include: {
            user: {
              select: { email: true }
            },
            documents: true
          }
        },
        scholarship: {
          select: { name: true }
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

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const application = await prisma.application.update({
      where: { id },
      data: { status }
    });

    res.json(application);
  } catch (error) {
    console.error("Failed to update application status", error);
    res.status(500).json({ error: "Failed to update application status" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    // Prevent admin from deleting themselves (assuming req.user exists from authenticateToken)
    if ((req as any).user.id === id) {
      res.status(400).json({ error: "Cannot delete your own admin account" });
      return;
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const getAllAdminScholarships = async (req: Request, res: Response): Promise<void> => {
  try {
    const scholarships = await prisma.scholarship.findMany({
      include: {
        university: { select: { name: true, country: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(scholarships);
  } catch (error) {
    console.error("Admin fetch scholarships error:", error);
    res.status(500).json({ error: "Failed to fetch scholarships" });
  }
};

export const deleteScholarship = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    await prisma.scholarship.delete({
      where: { id }
    });

    res.json({ message: "Scholarship deleted successfully" });
  } catch (error) {
    console.error("Admin delete scholarship error:", error);
    res.status(500).json({ error: "Failed to delete scholarship" });
  }
};

export const createScholarship = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, fundingType, degreeLevel, deadline, universityId } = req.body;
    const scholarship = await prisma.scholarship.create({
      data: {
        name,
        description,
        fundingType,
        degreeLevel,
        deadline: deadline ? new Date(deadline) : null,
        universityId
      }
    });
    res.json(scholarship);
  } catch (error) {
    console.error("Admin create scholarship error:", error);
    res.status(500).json({ error: "Failed to create scholarship" });
  }
};

export const updateScholarship = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description, fundingType, degreeLevel, deadline, universityId } = req.body;
    
    const scholarship = await prisma.scholarship.update({
      where: { id },
      data: {
        name,
        description,
        fundingType,
        degreeLevel,
        deadline: deadline ? new Date(deadline) : null,
        universityId
      }
    });
    res.json(scholarship);
  } catch (error) {
    console.error("Admin update scholarship error:", error);
    res.status(500).json({ error: "Failed to update scholarship" });
  }
};
