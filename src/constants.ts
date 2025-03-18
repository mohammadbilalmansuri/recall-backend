export const PORT = Number(process.env.PORT) || 8000;
export const MONGODB_CONNECTION_STRING = `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`;

export const PINECONE_API_KEY = String(process.env.PINECONE_API_KEY);
export const PINECONE_INDEX = String(process.env.PINECONE_INDEX);

export const ACCESS_TOKEN_SECRET = String(process.env.ACCESS_TOKEN_SECRET);
export const ACCESS_TOKEN_EXPIRY =
  String(process.env.ACCESS_TOKEN_EXPIRY) || "1d";
export const REFRESH_TOKEN_SECRET = String(process.env.REFRESH_TOKEN_SECRET);
export const REFRESH_TOKEN_EXPIRY =
  String(process.env.REFRESH_TOKEN_EXPIRY) || "7d";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  // secure: true,
  // sameSite: "None",
};
export const ALLOWED_ORIGINS =
  process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) || [];

export const GEMINI_API_KEY = String(process.env.GEMINI_API_KEY);

export const CLOUDINARY_CLOUD_NAME = String(process.env.CLOUDINARY_CLOUD_NAME);
export const CLOUDINARY_API_KEY = String(process.env.CLOUDINARY_API_KEY);
export const CLOUDINARY_API_SECRET = String(process.env.CLOUDINARY_API_SECRET);
export const CLOUDINARY_FOLDER = String(process.env.CLOUDINARY_FOLDER);
