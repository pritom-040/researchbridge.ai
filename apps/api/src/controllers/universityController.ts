import { Request, Response } from "express";
import { prisma } from "@repo/database";

export const getUniversities = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [universities, total] = await Promise.all([
      prisma.university.findMany({ skip, take: limit }),
      prisma.university.count()
    ]);

    res.json({ data: universities, meta: { total, page, limit } });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch universities" });
  }
};

export const getUniversityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const university = await prisma.university.findUnique({
      where: { id: req.params.id as string },
      include: { departments: true, scholarships: true }
    });

    if (!university) {
      res.status(404).json({ error: "University not found" });
      return;
    }

    res.json(university);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch university" });
  }
};

export const createUniversity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, country, globalRank, acceptanceRate } = req.body;
    
    const university = await prisma.university.create({
      data: { name, country, globalRank, acceptanceRate }
    });

    res.status(201).json(university);
  } catch (error) {
    res.status(500).json({ error: "Failed to create university" });
  }
};
