import { Router } from "express";
import {
  addContent,
  getContent,
  deleteContent,
  fetchContents,
} from "../controllers/content.controllers";
import authMiddleware from "../middlewares/auth.middleware";
import validateContent from "../middlewares/content.middleware";

const contentRoutes = Router();

contentRoutes.post("/", authMiddleware, addContent);
contentRoutes.get("/:id", authMiddleware, validateContent, getContent);
contentRoutes.delete("/:id", authMiddleware, validateContent, deleteContent);
contentRoutes.get("/", authMiddleware, fetchContents);

export default contentRoutes;
