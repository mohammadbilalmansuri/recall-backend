export const PORT = Number(process.env.PORT) || 8000;
export const DB_NAME = "recalldb";
export const MONGODB_URI = String(process.env.MONGODB_URI);
export const ACCESS_TOKEN_SECRET = String(process.env.ACCESS_TOKEN_SECRET);
export const ACCESS_TOKEN_EXPIRY =
  String(process.env.ACCESS_TOKEN_EXPIRY) || "1d";
export const REFRESH_TOKEN_SECRET = String(process.env.REFRESH_TOKEN_SECRET);
export const REFRESH_TOKEN_EXPIRY =
  String(process.env.REFRESH_TOKEN_EXPIRY) || "7d";
