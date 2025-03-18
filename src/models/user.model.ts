import { model, Schema, Document } from "mongoose";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import argon2, { argon2id } from "argon2";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "../constants";
import ApiError from "../utils/ApiError";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  comparePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await argon2.hash(this.password, {
      type: argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  try {
    return await argon2.verify(this.password, password);
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", [
      (error as Error).message,
    ]);
  }
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { _id: this._id, email: this.email },
    ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
    }
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign({ _id: this._id }, REFRESH_TOKEN_SECRET as Secret, {
    expiresIn: REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
  });
};

const User = model<IUser>("User", userSchema);
export default User;
