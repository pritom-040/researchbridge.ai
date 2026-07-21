import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import pdfParse from "pdf-parse";

// Define the expected output structure using Zod
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    skills: z.array(z.string()).describe("List of technical and soft skills extracted from the document."),
    grammarScore: z.number().min(0).max(100).describe("Grammar score from 0 to 100."),
    actionableFeedback: z.array(z.string()).describe("Specific, actionable feedback points to improve the CV/SOP."),
  })
);

export const analyzeDocument = async (pdfBuffer: Buffer) => {
  try {
    // 1. Parse the PDF
    const pdfData = await pdfParse(pdfBuffer);
    const textContent = pdfData.text;

    // 2. Setup the LLM
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini", // Cost-effective model for this
      temperature: 0,
    });

    // 3. Create the prompt template
    const formatInstructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
      template: `You are an expert academic advisor. Analyze the following document (CV or Statement of Purpose) and extract key information.

Document Text:
{text}

Please provide:
1. A list of skills found in the document.
2. A grammar score out of 100.
3. Actionable feedback to improve the document.

{format_instructions}`,
      inputVariables: ["text"],
      partialVariables: { format_instructions: formatInstructions },
    });

    // 4. Execute the chain
    const chain = prompt.pipe(model).pipe(parser);
    const result = await chain.invoke({ text: textContent });

    return result;
  } catch (error) {
    console.error("Error analyzing document:", error);
    throw new Error("Failed to analyze the document.");
  }
};
