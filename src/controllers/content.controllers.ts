import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import Content from "../models/content.model";
import validate from "../utils/validate";
import contentValidation from "../validations/content.validation";
import Tag from "../models/tag.model";
import { Schema } from "mongoose";

export const addContent = asyncHandler(async (req, res) => {
  const { title, link, description, tags, type } = validate(
    contentValidation,
    req.body
  );

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
    link: link || "",
    type,
    description: description || "",
    tags: tagIds,
    owner: req.user?.id,
  });

  return new ApiResponse(
    201,
    "Content added successfully",
    createdContent
  ).send(res);
});

export const deleteContent = asyncHandler(async (req, res) => {
  const contentId = req.params.id;
  const content = await Content.findOne({ _id: contentId });
  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  if (content.owner.toString() !== req.user?.id) {
    throw new ApiError(403, "You are not authorized to delete this content");
  }

  await Content.deleteOne({ _id: contentId });
  return new ApiResponse(200, "Content deleted successfully").send(res);
});

export const getContents = asyncHandler(async (req, res) => {
  const contents = await Content.find({ owner: req.user?.id }).populate({
    path: "owner",
    select: "name email",
  });

  if (contents.length === 0) {
    return new ApiResponse(200, "No content found", []).send(res);
  }

  return new ApiResponse(200, "Content fetched successfully", contents).send(
    res
  );
});
