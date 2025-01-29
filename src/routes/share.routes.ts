import { Router } from "express";
import {
  getShareLink,
  getSharedContent,
  deleteShareLink,
} from "../controllers/share.controllers";
import authMiddleware from "../middlewares/auth.middleware";

const shareRoutes = Router();

shareRoutes.post("/", authMiddleware, getShareLink);
shareRoutes.delete("/", authMiddleware, deleteShareLink);
shareRoutes.get("/:hash", getSharedContent);

export default shareRoutes;
