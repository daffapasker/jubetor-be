import express from "express";
import {
  createTrackRecord,
  getTrackRecords,
  getTrackRecordById,
  updateTrackRecord,
  deleteTrackRecord,
} from "../controllers/trackRecords.controller.js";
import { upload } from "../utils/multer.js";
import { authorization, allowRoles } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(authorization);

router.post(
  "/",
  allowRoles("admin"),
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  createTrackRecord
);
router.get("/", getTrackRecords);
router.get("/:id", getTrackRecordById);
router.put(
  "/:id",
  allowRoles("admin"),
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  updateTrackRecord
);
router.delete("/:id", allowRoles("admin"), deleteTrackRecord);

export default router;