import express from "express";
import {
  createUser,
  getUsers,
} from "../controllers/user.controller.js";
import { authorization, allowRoles } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(authorization); 

router.post("/",allowRoles("admin"), createUser);
router.get("/",allowRoles("admin"), getUsers);

export default router;