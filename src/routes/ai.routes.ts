import { Router } from "express";
import {
  askAIWithSavedContext,
  askAIAboutSpecificContent,
  askAIWithoutContext,
} from "../controllers/ai.controllers";
import validateContent from "../middlewares/content.middleware";
import verifyAccess from "../middlewares/auth.middleware";

const aiRoutes = Router();

aiRoutes.post("/query", verifyAccess, askAIWithoutContext);
aiRoutes.post(
  "/query-one/:id",
  verifyAccess,
  validateContent,
  askAIAboutSpecificContent
);
aiRoutes.post("/query-context", verifyAccess, askAIWithSavedContext);

export default aiRoutes;
