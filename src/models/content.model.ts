import { model, Schema, Document, Types } from "mongoose";
import Tag from "./tag.model";

export interface IContent extends Document {
  title: string;
  link?: string;
  description?: string;
  type: "todo" | "tweet" | "image" | "video" | "audio" | "article";
  tags?: Schema.Types.ObjectId[];
  owner: Schema.Types.ObjectId;
}

const contentSchema = new Schema<IContent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    link: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["todo", "tweet", "image", "video", "audio", "article"],
    },
    tags: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Tag",
        },
      ],
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
  },
  { timestamps: true }
);

const Content = model<IContent>("Content", contentSchema);
export default Content;
