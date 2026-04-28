import express from "express";
import userRoutes from "./user.routes.js";
import projectRoutes from "./project.routes.js";
import authRoutes from "./auth.route.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

export default app;