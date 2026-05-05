import express from "express";
import {
  createProject,
  getProjects,
  updateStatus,
  getProjectById,
  deleteProject,
} from "../controllers/project.controller.js";
import { upload } from "../utils/multer.js";
import { authorization, allowRoles } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// 🔐 semua route di bawah ini butuh token
router.use(authorization);

router.post("/",allowRoles("admin"), createProject);
router.get("/", getProjects);
router.patch("/:projectId/status",allowRoles("admin"), upload.single("image"), updateStatus);
router.get("/:projectId",allowRoles("admin"), getProjectById);
router.delete("/:projectId", allowRoles("admin"), deleteProject);

export default router;