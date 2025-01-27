import { model, Schema, Document } from "mongoose";

interface ILink extends Document {
  hash: string;
  owner: Schema.Types.ObjectId;
}

const linkSchema = new Schema<ILink>(
  {
    hash: {
      type: String,
      required: [true, "Hash is required"],
      unique: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
  },
  { timestamps: true }
);

const Link = model<ILink>("Link", linkSchema);
export default Link;
