import { Router } from "express";
import {
  getContents,
  addContent,
  deleteContent,
} from "../controllers/content.controllers";
import authMiddleware from "../middlewares/auth.middleware";

const contentRoutes = Router();

contentRoutes.get("/", authMiddleware, getContents);
contentRoutes.post("/", authMiddleware, addContent);
contentRoutes.delete("/:id", authMiddleware, deleteContent);

export default contentRoutes;
