import Tag from "../models/tag.model";
import { Schema } from "mongoose";

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

export default processTags;
