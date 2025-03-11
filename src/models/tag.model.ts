import { model, Schema, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
}

const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Tag = model<ITag>("Tag", tagSchema);
export default Tag;
