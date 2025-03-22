import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
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

  const content = await pineconeIndex
    .namespace(`user_${req.user?.id}`)
    .fetch(req.content?.id);

  const context = `${content.records?.[req.content?.id]?.metadata?.text}`;

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
    .map(
      (hit: { fields: { text?: string } }, index) =>
        `### Context ${index + 1}:\n${hit.fields?.text}`
    )
    .filter(Boolean)
    .join("\n\n");

  await generateAIResponseStream(prompt, context, res);
});
