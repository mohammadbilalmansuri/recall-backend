import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import validate from "../utils/validate";
import {
  signupUserValidation,
  loginUserValidation,
  deleteUserValidation,
} from "../validations/user.validation";
import User, { IUser } from "../models/user.model";
import Content from "../models/content.model";
import { REFRESH_TOKEN_SECRET } from "../constants";

const generateAccessAndRefreshTokens = async (user: IUser) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", [
      (error as Error).message,
    ]);
  }
};

export const signupUser = asyncHandler(async (req, res) => {
  const { name, email, password } = validate(signupUserValidation, req.body);

  const isUserExist = await User.findOne({ email }).lean();

  if (isUserExist) {
    throw new ApiError(400, "User already exists");
  }

  const createdUser = await User.create({ name, email, password });

  const userResponse = {
    id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
  };

  return new ApiResponse(201, "User created successfully", userResponse).send(
    res
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = validate(loginUserValidation, req.body);

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new ApiError(400, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user
  );

  const responseData = {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };

  const options = {
    httpOnly: true,
    // secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);

  return new ApiResponse(200, "User logged in successfully", responseData).send(
    res
  );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?.id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    // secure: true,
  };

  res.clearCookie("accessToken", options).clearCookie("refreshToken", options);
  return new ApiResponse(200, "Logout successful.").send(res);
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token =
    req.cookies.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.body.refreshToken;

  if (!token) {
    throw new ApiError(401, "Refresh token is required.");
  }

  const decodedToken = jwt.verify(token, REFRESH_TOKEN_SECRET as string);
  const user = await User.findById((decodedToken as JwtPayload)?._id);

  if (!user || token !== user?.refreshToken) {
    throw new ApiError(401, "Invalid or expired refresh token.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user
  );

  const options = {
    httpOnly: true,
    // secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);

  return new ApiResponse(200, "Access token refreshed successfully.", {
    accessToken,
    refreshToken,
  }).send(res);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { password } = validate(deleteUserValidation, req.body);

  if (!password) {
    throw new ApiError(400, "Password is required for verification.");
  }

  const user = await User.findById(req.user?.id).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid password.");
  }

  const deleteResult = await User.deleteOne({ _id: req.user?.id });

  if (deleteResult.deletedCount === 0) {
    throw new ApiError(500, "Failed to delete user.");
  }

  await Content.deleteMany({ owner: req.user?.id });

  const options = {
    httpOnly: true,
    // secure: true,
  };

  res.clearCookie("accessToken", options).clearCookie("refreshToken", options);
  return new ApiResponse(200, "User deleted successfully.").send(res);
});
