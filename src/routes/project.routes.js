import express from "express";
import {
  createProject,
  getProjects,
  updateStatus,
  getProjectById,
  deleteProject,
  getMyProjects,
} from "../controllers/project.controller.js";
import { upload } from "../utils/multer.js";
import { authorization, allowRoles } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Public routes
router.get("/",authorization, getProjects);
router.get("/my-projects",authorization, getMyProjects);
router.get("/:projectId",authorization, getProjectById);

// Protected routes
router.post("/", authorization, allowRoles("admin"), createProject);
router.patch(
  "/:projectId/status",
  authorization,
  allowRoles("admin"),
  upload.single("image"),
  updateStatus
);
router.delete(
  "/:projectId",
  authorization,
  allowRoles("admin"),
  deleteProject
);


export default router;