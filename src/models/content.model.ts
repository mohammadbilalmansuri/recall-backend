import { model, Schema, Document } from "mongoose";

export interface IContent extends Document {
  title: string;
  description?: string;
  link?: string;
  type: "todo" | "tweet" | "youtube" | "pdf";
  tags?: Schema.Types.ObjectId[];
  owner: Schema.Types.ObjectId;
  embeddings?: number[];
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
      enum: ["todo", "tweet", "youtube", "pdf"],
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
    embeddings: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

const Content = model<IContent>("Content", contentSchema);
export default Content;
