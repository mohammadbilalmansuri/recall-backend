import { Router } from "express";
import {
  askAIWithSavedContext,
  askAIAboutSpecificContent,
  askAIWithoutContext,
} from "../controllers/ai.controllers";
import validateContent from "../middlewares/content.middleware";

const aiRoutes = Router();

aiRoutes.post("/basic", askAIWithoutContext);
aiRoutes.post("/content", validateContent, askAIAboutSpecificContent);
aiRoutes.post("/saved-context", askAIWithSavedContext);

export default aiRoutes;
