import { model, Schema, Document, Types } from "mongoose";

export enum ContentType {
  TODO = "todo",
  TWEET = "tweet",
  YOUTUBE = "youtube",
  PDF = "pdf",
}

export interface IContent extends Document {
  description: string;
  link?: string;
  type: ContentType;
  tags?: Types.ObjectId[];
  owner: Types.ObjectId;
  context?: string;
}

const contentSchema = new Schema<IContent>(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [5, "Description must be at least 5 characters long"],
      maxlength: [2000, "Description must not exceed 2000 characters"],
    },
    link: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: Object.values(ContentType),
    },
    tags: {
      type: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    context: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Content = model<IContent>("Content", contentSchema);
export default Content;
