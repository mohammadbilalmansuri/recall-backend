import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../constants";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateEmbeddings = async (
  input: any
): Promise<number[] | null> => {
  try {
    let text: string;

    if (typeof input === "string") {
      text = input.trim();
    } else if (typeof input === "number" || typeof input === "boolean") {
      text = input.toString();
    } else if (Array.isArray(input) || typeof input === "object") {
      text = JSON.stringify(input);
    } else {
      throw new Error("Unsupported input type for embedding.");
    }

    if (!text) {
      throw new Error("Empty input provided for embedding.");
    }

    const result = await genAI
      .getGenerativeModel({
        model: "text-embedding-004",
      })
      .embedContent(text);

    if (!result || !result.embedding) {
      throw new Error("Failed to generate embeddings.");
    }

    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return null;
  }
};

// export const generateContent = async (
//   prompt: string,
//   savedEmbeddings?: number[]
// ): Promise<string | null> => {
//   try {
//     if (!prompt.trim()) {
//       throw new Error("Prompt cannot be empty.");
//     }

//     const result = await genAI
//       .getGenerativeModel({ model: "gemini-2.0-flash" })
//       .generateContent(fullPrompt);

//     if (
//       !result ||
//       !result.response ||
//       typeof result.response.text !== "function"
//     ) {
//       throw new Error("Failed to generate content.");
//     }

//     return result.response.text().trim();
//   } catch (error) {
//     console.error("Error generating content:", error);
//     return null;
//   }
// };
