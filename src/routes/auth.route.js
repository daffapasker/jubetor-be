import express from "express";
import authController from "../controllers/auth.controller.js";
import { signInSchema } from "../validators/auth.validate.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authorization } from "../middlewares/auth.middlewares.js";

const authRoutes = express.Router();

authRoutes.post("/sign-in", validate(signInSchema), authController.signIn);
authRoutes.get(
  "/profile",
  authorization,
  authController.getProfile
);


export default authRoutes;