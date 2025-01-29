import argon2, { argon2id } from "argon2";
import { model, Schema, Document } from "mongoose";

interface IShare extends Document {
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
    console.error("Error in pre-save hook:", error);
    next(error as Error);
  }
});

shareSchema.methods.compareHash = async function (
  hash: string
): Promise<boolean> {
  return await argon2.verify(this.hash, hash);
};

const Share = model<IShare>("Share", shareSchema);
export default Share;
