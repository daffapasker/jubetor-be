import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/articles.controller.js";
import { upload } from "../utils/multer.js";
import { authorization, allowRoles } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(authorization); // semua endpoint butuh token

router.post("/", allowRoles("admin"), upload.single("thumbnail"), createArticle);
router.get("/", getArticles);
router.get("/:id", getArticleById);
router.put("/:id", allowRoles("admin"), upload.single("thumbnail"), updateArticle);
router.delete("/:id", allowRoles("admin"), deleteArticle);

export default router;