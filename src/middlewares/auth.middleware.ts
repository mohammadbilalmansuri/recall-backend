import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants";

const verifyAccess = (req: Request, _: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body.accessToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized request! No token provided");
    }

    const decoded = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET as string
    ) as jwt.JwtPayload;

    req.user = {
      id: decoded._id,
      email: decoded.email,
    };
    next();
  } catch (error) {
    return next(new ApiError(401, "Unauthorized request! Token is invalid"));
  }
};

export default verifyAccess;
