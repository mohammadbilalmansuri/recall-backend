import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import Content from "../models/content.model";
import validate from "../utils/validate";
import contentValidation from "../validations/content.validation";
import Tag from "../models/tag.model";
import { Schema } from "mongoose";
import pineconeNamespace from "../db/pinecone.db";
import getTweet from "../services/twitter.service";
import getYoutubeTranscript from "../services/youtube.service";
import getPdfData from "../services/pdf.service";
import generateEmbeddings from "../services/embeddings.service";
import { uploadOnCloudinary } from "../services/cloudinary.service";

export const addContent = asyncHandler(async (req, res) => {
  let { title, description, link, type, tags } = validate(contentValidation, {
    ...req.body,
    tags: req.body.tags?.split(","),
  });

  let embeddings: number[] = [];
  let contentText = "";

  switch (type) {
    case "todo":
      contentText = description || "";
      break;
    case "tweet":
      if (!link) throw new ApiError(400, "Tweet link is required");
      contentText = await getTweet(link);
      break;
    case "youtube":
      if (!link) throw new ApiError(400, "YouTube link is required");
      contentText = (await getYoutubeTranscript(link)) || "";
      break;
    case "pdf":
      if (!req.file) throw new ApiError(400, "PDF file is required");

      contentText = await getPdfData(req.file.path);

      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (!cloudinaryResponse) throw new ApiError(500, "PDF upload failed");

      link = cloudinaryResponse.secure_url;

      break;
    default:
      throw new ApiError(400, "Invalid content type");
  }

  const tagsText = tags && tags.length > 0 ? tags.join(" ") : "";
  const enrichedText = [title, description || "", tagsText, contentText]
    .filter(Boolean)
    .join("\n\n");

  if (enrichedText) {
    const generatedEmbeddings = await generateEmbeddings(enrichedText);
    if (generatedEmbeddings) {
      embeddings = generatedEmbeddings;
    }
  }

  const tagIds: Schema.Types.ObjectId[] = [];

  if (tags && tags.length > 0) {
    await Promise.all(
      tags.map(async (tag) => {
        const existingTag = await Tag.findOne({ name: tag }).lean();
        if (existingTag) {
          tagIds.push(existingTag._id as Schema.Types.ObjectId);
        } else {
          const newTag = await Tag.create({ name: tag });
          tagIds.push(newTag.id);
        }
      })
    );
  }

  const content = await Content.create({
    title,
    description: description || "",
    link: link || "",
    type,
    tags: tagIds,
    owner: req.user?.id,
    embeddings,
    content: contentText,
  });

  await pineconeNamespace.upsert([
    {
      id: String(content._id),
      values: embeddings,
      metadata: {
        title: content.title,
        link: content.link || "",
        type: content.type,
        content: contentText,
        ...(description && { description }),
        ...(tags && { tags }),
      },
    },
  ]);

  return new ApiResponse(201, "Content added successfully", {
    ...content.toObject(),
    tags: tags || [],
  }).send(res);
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
