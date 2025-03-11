import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import Content from "../models/content.model";
import validate from "../utils/validate";
import contentValidation from "../validations/content.validation";
import Tag from "../models/tag.model";
import { Schema } from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const addContent = asyncHandler(async (req, res) => {
  const { title, description, link, type, tags, pdf } = validate(
    contentValidation,
    req.body
  );

  let embeddings: number[] = [];

  switch (type) {
    case "tweet":
      if (!link) throw new ApiError(400, "Tweet link is required");
      break;
    case "youtube":
      if (!link) throw new ApiError(400, "Youtube link is required");
      break;
    case "pdf":
      if (!pdf) throw new ApiError(400, "PDF is required");
      break;
    case "todo":
      break;
    default:
      throw new ApiError(400, "Invalid content type");
  }

  const tagIds: Schema.Types.ObjectId[] = [];

  if (tags && tags.length > 0) {
    await Promise.all(
      tags.map(async (tag) => {
        const isTagAlreadyExist = await Tag.findOne({ name: tag }).lean();

        if (isTagAlreadyExist) {
          tagIds.push(isTagAlreadyExist._id as Schema.Types.ObjectId);
        } else {
          const newTag = await Tag.create({ name: tag });
          tagIds.push(newTag.id);
        }
      })
    );
  }

  const createdContent = await Content.create({
    title,
    description: description || "",
    link: link || "",
    type,
    tags: tagIds,
    owner: req.user?.id,
    embeddings,
  });

  return new ApiResponse(
    201,
    "Content added successfully",
    createdContent
  ).send(res);
});

export const getContent = asyncHandler(async (req, res) => {
  const content = req.content;
  return new ApiResponse(200, "Content fetched successfully", content).send(
    res
  );
});

export const deleteContent = asyncHandler(async (req, res) => {
  const content = req.content;
  await content?.deleteOne();
  return new ApiResponse(200, "Content deleted successfully").send(res);
});

export const fetchContents = asyncHandler(async (req, res) => {
  const contents = await Content.find({ owner: req.user?.id }).populate({
    path: "owner",
    select: "name email",
  });

  if (contents.length === 0) {
    return new ApiResponse(200, "No content found", []).send(res);
  }

  return new ApiResponse(200, "Contents fetched successfully", contents).send(
    res
  );
});
