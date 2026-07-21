import { Request, Response } from "express";
import { analyzeDocument, searchScholarships } from "@repo/ai-core";

export const analyzeCv = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pdfBase64 } = req.body;
    if (!pdfBase64) {
      res.status(400).json({ error: "pdfBase64 is required" });
      return;
    }

    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    const result = await analyzeDocument(pdfBuffer);
    
    res.json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to analyze document" });
  }
};

export const chat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ error: "query is required" });
      return;
    }
    
    // Using searchScholarships as part of RAG context retrieval
    const recommendations = await searchScholarships(query, 3);
    
    // In a real RAG chatbot, we would pass these recommendations to the LLM to form a reply.
    // For now, we'll just return the context directly as a stub.
    res.json({ reply: `Here are some matches based on your query.`, recommendations });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Chat failed" });
  }
};

export const recommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    // Generate AI recommendations based on user profile.
    // Stub implementation
    res.json({ message: "Recommendations API coming soon" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};
