import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import Content from "../models/content.model";
import validate from "../utils/validate";
import { promptValidation } from "../validations/content.validation";
import pineconeIndex from "../db/pinecone.db";
import generateAIResponseStream from "../services/ai.service";

export const askAIWithoutContext = asyncHandler(async (req, res) => {
  const { prompt } = validate(promptValidation, req.body);
  if (!prompt) throw new ApiError(400, "Prompt is required");

  await generateAIResponseStream(prompt, "", res);
});

export const askAIAboutSpecificContent = asyncHandler(async (req, res) => {
  const { prompt } = validate(promptValidation, req.body);
  if (!prompt) throw new ApiError(400, "Prompt is required");

  const savedData = await pineconeIndex
    .namespace(`user_${req.user?.id}`)
    .searchRecords({
      query: {
        topK: 1,
        inputs: { text: prompt },
      },
      fields: ["text", "category"],
    });

  const context = savedData.result?.hits
    .map((hit) => {
      const fields = hit.fields as { text?: string };
      return fields.text || "No text available.";
    })
    .join("\n\n");

  await generateAIResponseStream(prompt, context, res);
});

export const askAIWithSavedContext = asyncHandler(async (req, res) => {
  const { prompt } = validate(promptValidation, req.body);
  if (!prompt) throw new ApiError(400, "Prompt is required");

  const savedData = await pineconeIndex
    .namespace(`user_${req.user?.id}`)
    .searchRecords({
      query: {
        topK: 2,
        inputs: { text: prompt },
      },
      fields: ["text", "category"],
    });

  const hits = savedData.result?.hits || [];
  const context = hits
    .map((hit, index) => {
      const fields = hit.fields as { text?: string };
      return `### Context ${index + 1}:\n${
        fields.text || "No text available."
      }`;
    })
    .join("\n\n");

  await generateAIResponseStream(prompt, context, res);
});
