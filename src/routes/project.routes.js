import express from "express";
import {
  createProject,
  getProjects,
  updateStatus,
  getProjectById,
  deleteProject,
} from "../controllers/project.controller.js";
import { upload } from "../utils/multer.js"

const router = express.Router();

router.post("/", createProject);
router.get("/", getProjects);
router.patch(
  "/:projectId/status",
  upload.single("image"), // ← field name harus "image"
  updateStatus
);
router.get("/:projectId", getProjectById); // Ambil detail motor & log
router.delete("/:projectId", deleteProject); // Hapus motor

export default router;