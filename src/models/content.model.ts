import { model, Schema, Document } from "mongoose";

interface IContent extends Document {
  title: string;
  link: string;
  description?: string;
  type: "tweet" | "image" | "video" | "audio" | "article";
  tags: Schema.Types.ObjectId[];
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
      required: [true, "Link is required"],
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["tweet", "image", "video", "audio", "article"],
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
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
