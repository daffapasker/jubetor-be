import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser, 
} from "../controllers/user.controller.js";
import { authorization, allowRoles } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(authorization); 

router.post("/",allowRoles("admin"), createUser);
router.get("/",allowRoles("admin"), getUsers);
router.patch("/:id",allowRoles("admin"), updateUser);
router.get("/:id",allowRoles("admin"), getUserById);
router.delete("/:id",allowRoles("admin"), deleteUser);


export default router;