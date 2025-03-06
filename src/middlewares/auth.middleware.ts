import ApiError from "../utils/ApiError";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants";
import { Request, Response, NextFunction } from "express";

const verifyAccess = (req: Request, _: Response, next: NextFunction) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    throw new ApiError(401, "Unauthorized request! No token provided");

  jwt.verify(
    token,
    ACCESS_TOKEN_SECRET as string,
    (err: VerifyErrors | null, decodedInfo: any) => {
      if (err) {
        console.error("JWT verification error:", err);
        throw new ApiError(401, "Invalid or expired access token");
      }

      req.user = {
        id: decodedInfo._id,
        email: decodedInfo.email,
      };
      next();
    }
  );
};

export default verifyAccess;
