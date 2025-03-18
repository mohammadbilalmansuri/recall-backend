import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import Content, { ContentType } from "../models/content.model";
import validate from "../utils/validate";
import { contentValidation } from "../validations/content.validation";
import Tag from "../models/tag.model";
import { Schema } from "mongoose";
import pineconeIndex from "../db/pinecone.db";
import getTweet from "../services/twitter.service";
import getYoutubeTranscript from "../services/youtube.service";
import getPdfData from "../services/pdf.service";
import { uploadOnCloudinary } from "../services/cloudinary.service";
import fs from "fs/promises";

const processTags = async (
  tags: string[]
): Promise<Schema.Types.ObjectId[]> => {
  if (!tags?.length) return [];

  const existingTags = await Tag.find({ name: { $in: tags } }).lean();
  const existingTagNames = new Set(existingTags.map((tag) => tag.name));
  const tagIds = existingTags.map((tag) => tag._id as Schema.Types.ObjectId);

  const newTags = tags
    .filter((tag) => !existingTagNames.has(tag))
    .map((name) => ({ name }));

  if (newTags.length > 0) {
    const insertedTags = await Tag.insertMany(newTags);
    tagIds.push(...insertedTags.map((tag) => tag._id as Schema.Types.ObjectId));
  }

  return tagIds;
};

export const addContent = asyncHandler(async (req, res) => {
  const {
    description,
    link: initialLink,
    type,
    tags: rawTags,
  } = validate(contentValidation, {
    description: req.body.description,
    link: req.body.link,
    type: req.body.type,
    tags: req.body.tags ? JSON.parse(req.body.tags) : [],
  });

  let link = initialLink;
  let context = "";

  try {
    switch (type) {
      case ContentType.TWEET:
        if (!link) {
          throw new ApiError(400, "Tweet link is required");
        }
        context = await getTweet(link);
        break;

      case ContentType.YOUTUBE:
        if (!link) {
          throw new ApiError(400, "YouTube link is required");
        }
        context = (await getYoutubeTranscript(link)) || "";
        break;

      case ContentType.PDF:
        if (!req.file) {
          throw new ApiError(400, "PDF file is required");
        }
        context = await getPdfData(req.file.path);

        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if (!cloudinaryResponse) {
          throw new ApiError(500, "PDF upload failed");
        }

        link = cloudinaryResponse.secure_url;
        await fs.unlink(req.file.path);
        break;

      case ContentType.TODO:
        break;

      default:
        throw new ApiError(400, "Invalid content type");
    }
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to process content: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  const tagIds = await processTags(rawTags || []);
  const chunkText = `
    Description: ${description || "N/A"}
    Link: ${link || "N/A"}
    Type: ${type || "N/A"}
    Tags: ${rawTags || "N/A"}

    --- Content Context ---
    ${context || "N/A"}
  `.trim();

  const content = await Content.create({
    description,
    link: link || "",
    type,
    tags: tagIds,
    owner: req.user?.id,
    context,
  });

  await pineconeIndex.upsertRecords([
    {
      _id: String(content._id),
      text: chunkText,
      category: rawTags || [],
    },
  ]);

  return new ApiResponse(201, "Content added successfully", {
    ...content.toObject(),
    tags: rawTags,
  }).send(res);
});

export const getContent = asyncHandler(async (req, res) => {
  return new ApiResponse(200, "Content fetched successfully", req.content).send(
    res
  );
});

export const deleteContent = asyncHandler(async (req, res) => {
  const content = req.content;
  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  await content.deleteOne();
  await pineconeIndex._deleteOne(String(content._id));

  return new ApiResponse(200, "Content deleted successfully").send(res);
});

export const fetchContents = asyncHandler(async (req, res) => {
  const contents = await Content.find({ owner: req.user?.id }).populate({
    path: "owner",
    select: "name email",
  });

  return new ApiResponse(
    200,
    contents.length > 0 ? "Contents fetched successfully" : "No content found",
    contents
  ).send(res);
});
