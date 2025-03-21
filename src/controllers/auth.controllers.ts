import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import validate from "../utils/validate";
import {
  signupUserValidation,
  loginUserValidation,
  deleteUserValidation,
} from "../validations/user.validation";
import User from "../models/user.model";
import Content from "../models/content.model";
import generateAccessAndRefreshTokens from "../utils/generateAccessAndRefreshTokens";
import { REFRESH_TOKEN_SECRET } from "../constants";
import pineconeIndex from "../db/pinecone.db";

export const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = validate(signupUserValidation, req.body);

  const isUserExist = await User.findOne({ email }).lean();
  if (isUserExist) throw new ApiError(400, "User already exists");

  const user = await User.create({ name, email, password });

  return new ApiResponse(res, 201, "User created successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  }).send();
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = validate(loginUserValidation, req.body);

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "User not found");

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) throw new ApiError(400, "Password is incorrect");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user
  );

  return new ApiResponse(res, 200, "User logged in successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  })
    .setCookies([
      {
        name: "accessToken",
        value: accessToken,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
      {
        name: "refreshToken",
        value: refreshToken,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    ])
    .send();
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?.id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  return new ApiResponse(res, 200, "User logged out successfully")
    .clearCookies(["accessToken", "refreshToken"])
    .send();
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { password } = validate(deleteUserValidation, req.body);
  if (!password)
    throw new ApiError(400, "Password is required for verification");

  if (!req.user?.id) {
    new ApiResponse(res).clearCookies(["accessToken", "refreshToken"]);
    throw new ApiError(401, "Unauthorized request");
  }

  const user = await User.findById(req.user.id).select("+password");
  if (!user || !(await user.comparePassword(password)))
    throw new ApiError(401, "Invalid password.");

  const deleteResult = await User.deleteOne({ _id: req.user.id });
  if (deleteResult.deletedCount === 0)
    throw new ApiError(500, "Failed to delete user");

  await Content.deleteMany({ owner: req.user.id });
  await pineconeIndex.namespace(req.user.id as string).deleteAll();

  return new ApiResponse(res, 200, "User deleted successfully")
    .clearCookies(["accessToken", "refreshToken"])
    .send();
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token =
    req.cookies.refreshToken ||
    req.header("RefreshToken") ||
    req.body.refreshToken;

  if (!token) throw new ApiError(401, "No refresh token provided");

  try {
    const { id } = jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload & {
      id: string;
      email: string;
    };

    const user = await User.findById(id);

    if (!user || token !== user?.refreshToken)
      throw new ApiError(401, "Invalid or expired refresh token");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user
    );

    return new ApiResponse(res, 200, "Access token refreshed", {
      accessToken,
      refreshToken,
    })
      .setCookies([
        {
          name: "accessToken",
          value: accessToken,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
        {
          name: "refreshToken",
          value: refreshToken,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
      ])
      .send();
  } catch (error) {
    new ApiResponse(res).clearCookies(["accessToken", "refreshToken"]);
    throw new ApiError(401, "Invalid refresh token");
  }
});
