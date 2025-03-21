import ApiError from "../utils/ApiError";
import { IUser } from "../models/user.model";

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

export default generateAccessAndRefreshTokens;
