import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import Content from "../models/content.model";
import { isValidObjectId } from "mongoose";

const validateContent = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid content ID format"));
    }

    const content = await Content.findById(id);
    if (!content) {
      return next(new ApiError(404, "Content not found"));
    }

    if (content.owner.toString() !== req.user?.id) {
      return next(
        new ApiError(403, "You do not have permission to access this content")
      );
    }

    req.content = content;
    next();
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", [
      (error as Error).message,
    ]);
  }
};

export default validateContent;
