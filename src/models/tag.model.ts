import { model, Schema, Document } from "mongoose";

interface ITag extends Document {
  title: string;
}

const tagSchema = new Schema<ITag>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Tag = model<ITag>("Tag", tagSchema);
export default Tag;
