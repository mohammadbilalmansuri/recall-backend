import argon2, { argon2id } from "argon2";
import { model, Schema, Document } from "mongoose";
import ApiError from "../utils/ApiError";

export interface IShare extends Document {
  hash?: string;
  owner: Schema.Types.ObjectId;
  compareHash: (hash: string) => Promise<boolean>;
}

const shareSchema = new Schema<IShare>(
  {
    hash: {
      type: String,
      unique: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
  },
  { timestamps: true }
);

shareSchema.pre<IShare>("save", async function (next) {
  try {
    this.hash = await argon2.hash(String(this.owner), {
      type: argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
    next();
  } catch (error) {
    next(
      new ApiError(500, "Internal Server Error", [(error as Error).message])
    );
  }
});

shareSchema.methods.compareHash = async function (
  hash: string
): Promise<boolean> {
  try {
    return await argon2.verify(this.hash, hash);
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", [
      (error as Error).message,
    ]);
  }
};

const Share = model<IShare>("Share", shareSchema);
export default Share;
