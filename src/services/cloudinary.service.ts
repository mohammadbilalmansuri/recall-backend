import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER,
} from "../constants";
import ApiError from "../utils/ApiError";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

const uploadOnCloudinary = async (
  localFilePath: string
): Promise<CloudinaryResponse> => {
  try {
    if (!localFilePath) {
      throw new ApiError(400, "No file path provided");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw",
      folder: CLOUDINARY_FOLDER,
    });

    return {
      secure_url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    throw new ApiError(
      500,
      `Cloudinary Upload Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

const deleteFromCloudinary = async (url: string): Promise<boolean> => {
  try {
    const publicId = url.split("/").pop()?.split(".")[0];
    if (!publicId) {
      throw new ApiError(400, "Invalid URL format");
    }

    await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
    return true;
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error);
    return false;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
