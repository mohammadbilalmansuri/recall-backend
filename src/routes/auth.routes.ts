import { Router } from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  deleteUser,
  refreshAccessToken,
} from "../controllers/auth.controllers";
import verifyAccess from "../middlewares/auth.middleware";

const authRoutes = Router();

authRoutes.post("/signup", signupUser);
authRoutes.post("/login", loginUser);
authRoutes.patch("/logout", verifyAccess, logoutUser);
authRoutes.delete("/delete", verifyAccess, deleteUser);
authRoutes.patch("/refresh-access-token", refreshAccessToken);

export default authRoutes;
