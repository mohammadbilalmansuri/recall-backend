import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import { ACCESS_TOKEN_SECRET } from "../constants";

const verifyAccess = (req: Request, _: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body?.accessToken;

    if (!token)
      throw new ApiError(401, "Unauthorized request! No token provided");

    const { id, email } = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET
    ) as jwt.JwtPayload & { id: string; email: string };

    req.user = { id, email };
    next();
  } catch {
    next(new ApiError(401, "Unauthorized request! Token is invalid"));
  }
};

export default verifyAccess;
