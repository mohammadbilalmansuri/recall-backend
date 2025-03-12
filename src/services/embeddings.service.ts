import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../constants";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function generateEmbeddings(input: any): Promise<number[] | null> {
  try {
    let text: string;

    if (typeof input === "string") {
      text = input;
    } else if (typeof input === "number" || typeof input === "boolean") {
      text = input.toString();
    } else if (Array.isArray(input) || typeof input === "object") {
      text = JSON.stringify(input);
    } else {
      throw new Error("Unsupported input type for embedding.");
    }

    const result = await model.embedContent(text);

    if (!result || !result.embedding) {
      throw new Error("Failed to generate embeddings.");
    }

    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return null;
  }
}

export default generateEmbeddings;
