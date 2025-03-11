export const PORT = process.env.PORT || 8000;
export const DB_NAME = "recalldb";
export const MONGODB_URI = process.env.MONGODB_URI;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "1d";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";
export const COOKIE_OPTIONS = {
  httpOnly: true,
  // secure: true,
  // sameSite: "None",
};
// export const ALLOWED_ORIGINS =
//   process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) || [];
