import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import Content, { ContentType } from "../models/content.model";
import validate from "../utils/validate";
import { contentValidation } from "../validations/content.validation";
import processTags from "../utils/processTags";
import pineconeIndex from "../db/pinecone.db";
import getTweetData from "../services/twitter.service";
import getYoutubeVideoTranscript from "../services/youtube.service";
import getPdfData from "../services/pdf.service";

export const addContent = asyncHandler(async (req, res) => {
  const { text, link, type, tags } = validate(contentValidation, req.body);

  let context = "";

  switch (type) {
    case ContentType.TWEET:
      if (!link) throw new ApiError(400, "Tweet link is required");
      context = await getTweetData(link);
      break;

    case ContentType.YOUTUBE:
      if (!link) throw new ApiError(400, "YouTube video link is required");
      context = await getYoutubeVideoTranscript(link);
      break;

    case ContentType.PDF:
      if (!link) throw new ApiError(400, "PDF link is required");
      context = await getPdfData(link);
      break;

    case ContentType.TODO:
      if (!text) throw new ApiError(400, "Todo Text is required");
      break;

    default:
      throw new ApiError(400, "Invalid content type");
  }

  const tagIds = await processTags(tags || []);

  const content = await Content.create({
    text,
    link: link || "",
    type,
    tags: tagIds,
    owner: req.user?.id,
  });

  if (!context.trim()) context = "No relevant content found.";

  const chunkText = `
  Type: ${type || "N/A"}
  Content: ${text || "N/A"}
  Link: ${link || "N/A"}
  Tags: ${tags || "N/A"}
  
  --- Content Context ---
  ${context || "N/A"}
  `.trim();

  await pineconeIndex.namespace(`user_${req.user?.id}`).upsertRecords([
    {
      _id: String(content._id),
      text: chunkText,
      category: tags || [],
    },
  ]);

  return new ApiResponse(res, 201, "Content added successfully", {
    content: { ...content.toObject(), tags },
  }).send();
});

export const getContent = asyncHandler(async (req, res) => {
  return new ApiResponse(res, 200, "Content fetched successfully", {
    content: req.content,
  }).send();
});

export const deleteContent = asyncHandler(async (req, res) => {
  const content = req.content;
  if (!content) throw new ApiError(404, "Content not found");

  await content.deleteOne();

  try {
    await pineconeIndex
      .namespace(`user_${req.user?.id}`)
      .deleteOne(String(content._id));
  } catch {}

  return new ApiResponse(res, 200, "Content deleted successfully").send();
});

export const fetchContents = asyncHandler(async (req, res) => {
  const contents = await Content.find({ owner: req.user?.id }).populate({
    path: "owner",
    select: "name email",
  });

  return new ApiResponse(
    res,
    200,
    contents.length > 0 ? "Contents fetched successfully" : "No content found",
    { contents }
  ).send();
});
