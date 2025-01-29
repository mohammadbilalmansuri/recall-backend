import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import Share from "../models/share.model";
import Content from "../models/content.model";

export const getShareLink = asyncHandler(async (req, res) => {
  const isAlreadyShared = await Share.findOne({ owner: req.user?.id });
  if (isAlreadyShared) {
    throw new ApiError(400, "You already have a share link");
  }

  const share = await Share.create({ owner: req.user?.id });

  return new ApiResponse(201, "Share link created successfully.", share).send(
    res
  );
});

export const getSharedContent = asyncHandler(async (req, res) => {
  const share = await Share.findOne({ hash: req.params.hash });
  if (!share) {
    throw new ApiError(404, "Invalid share link.");
  }

  const content = await Content.find({ owner: share.owner }).populate({
    path: "owner",
    select: "name email",
  });

  return new ApiResponse(
    200,
    "Shared Content fetched successfully.",
    content
  ).send(res);
});

export const deleteShareLink = asyncHandler(async (req, res) => {
  const share = await Share.findOneAndDelete({ owner: req.user?.id });
  if (!share) {
    throw new ApiError(404, "Share link not found.");
  }

  return new ApiResponse(200, "Share link deleted successfully.").send(res);
});
