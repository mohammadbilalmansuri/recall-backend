import asyncHandler from "../utils/asyncHandler.ts";
import ApiError from "../utils/ApiError.ts";
import Content from "../models/content.model.ts";
import { Request } from "express";

const validateContent = asyncHandler(async (req: Request, _, next) => {
  const { id } = req.params;
  const content = await Content.findById(id);

  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  req.content = content;
  next();
});

export default validateContent;
