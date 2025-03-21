import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY, GEMINI_MODEL } from "../constants";
import ApiError from "../utils/ApiError";
import { Response } from "express";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

const generateAIResponseStream = async (
  prompt: string,
  context: string = "",
  res: Response
) => {
  try {
    if (!prompt.trim()) throw new ApiError(400, "Prompt cannot be empty");

    const formattedPrompt = `
      You are an advanced AI model that generates well-structured and high-quality responses.

      ### **Context:**
      ${context.trim() || "No additional context available."}

      ---
      ### **Task:**
      ${prompt.trim()}

      ---
      ### **Instructions:**
      - Use the provided context to enhance the response.
      - Ensure the response is **clear, structured, and formatted properly**.
      - If applicable, use:
        - Bullet points for lists.
        - Headings for sections.
        - Code blocks for technical responses.
        - JSON format if needed.

      Provide the best possible response with accurate and relevant details.
    `;

    const result = await model.generateContentStream(formattedPrompt);

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of result.stream) res.write(chunk.text());
    res.end();
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate AI response",
      details: (error as Error).message,
    });
  }
};

export default generateAIResponseStream;
