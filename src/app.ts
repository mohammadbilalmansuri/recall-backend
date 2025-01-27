import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

import userRoutes from "./routes/user.routes.ts";
import contentRoutes from "./routes/content.routes.ts";
import globalErrorHandler from "./middlewares/errorHandler.middleware.ts";

app.use("/api/vi/users", userRoutes);
app.use("/api/vi/content", contentRoutes);

app.use(globalErrorHandler);

export default app;
