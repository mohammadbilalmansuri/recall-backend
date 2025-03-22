import { Router } from "express";
import {
  getShareLink,
  getSharedContent,
  deleteShareLink,
} from "../controllers/share.controllers";
import authMiddleware from "../middlewares/auth.middleware";

const shareRoutes = Router();

shareRoutes.post("/get", authMiddleware, getShareLink);
shareRoutes.delete("/delete", authMiddleware, deleteShareLink);
shareRoutes.get("/content/:hash", getSharedContent);

export default shareRoutes;
