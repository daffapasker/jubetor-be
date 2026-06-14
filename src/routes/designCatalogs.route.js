import express from "express";
import {
  createCatalog,
  getCatalogs,
  getCatalogById,
  updateCatalog,
  deleteCatalog,
} from "../controllers/designCatalogs.controller.js";
import { upload } from "../utils/multer.js";
import { authorization, allowRoles } from "../middlewares/auth.middlewares.js";

const router = express.Router();



router.post("/",authorization, allowRoles("admin"), upload.single("image"), createCatalog);
router.get("/", getCatalogs);
router.get("/:id", getCatalogById);
router.put("/:id", authorization, allowRoles("admin"), upload.single("image"), updateCatalog);
router.delete("/:id", authorization, allowRoles("admin"), deleteCatalog);

export default router;