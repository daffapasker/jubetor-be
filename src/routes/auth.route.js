import express from "express";
import authController from "../controllers/auth.controller.js";
import { signInSchema } from "../validators/auth.validate.js";
import { validate } from "../middlelwares/validate.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/sign-in", validate(signInSchema), authController.signIn);

export default authRoutes;