import express from "express";
import cors from "cors";

import userRoutes from "./user.routes.js";
import projectRoutes from "./project.routes.js";
import authRoutes from "./auth.route.js";
import articleRoutes from "./articles.route.js";
import designCatalogRoutes from "./designCatalogs.route.js";
import trackRecordRoutes from "./trackRecords.route.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/design-catalogs", designCatalogRoutes);
app.use("/api/track-records", trackRecordRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

export default app;