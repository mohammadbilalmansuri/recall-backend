import { Router } from "express";
import {
  addContent,
  getContent,
  deleteContent,
  fetchContents,
} from "../controllers/content.controllers";
import verifyAccess from "../middlewares/auth.middleware";
import validateContent from "../middlewares/content.middleware";

const contentRoutes = Router();

contentRoutes.post("/add", verifyAccess, addContent);
contentRoutes.get("/get/:id", verifyAccess, validateContent, getContent);
contentRoutes.delete(
  "/delete/:id",
  verifyAccess,
  validateContent,
  deleteContent
);
contentRoutes.get("/all", verifyAccess, fetchContents);

export default contentRoutes;
