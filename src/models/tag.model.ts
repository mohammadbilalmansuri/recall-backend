import { model, Schema, Document } from "mongoose";

interface ITag extends Document {
  name: string;
}

const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Tag = model<ITag>("Tag", tagSchema);
export default Tag;
