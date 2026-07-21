import { OpenAIEmbeddings } from "@langchain/openai";
import { prisma } from "@repo/database";

const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
});

/**
 * Generate embedding for a given text.
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  return await embeddings.embedQuery(text);
};

/**
 * Perform a semantic search for scholarships using pgvector.
 */
export const searchScholarships = async (query: string, limit: number = 5) => {
  const queryEmbedding = await generateEmbedding(query);
  const embeddingString = `[${queryEmbedding.join(',')}]`;

  // Prisma raw query for pgvector cosine distance (<=>)
  // Ensure we only cast the embeddingString to vector if it matches the dimension
  const results = await prisma.$queryRaw`
    SELECT id, name, description, "fundingType", "degreeLevel",
           1 - (embedding <=> ${embeddingString}::vector) as similarity
    FROM "Scholarship"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${embeddingString}::vector
    LIMIT ${limit};
  `;

  return results;
};
