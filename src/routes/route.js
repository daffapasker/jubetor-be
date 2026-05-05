import express from "express";
import userRoutes from "./user.routes.js";
import projectRoutes from "./project.routes.js";
import authRoutes from "./auth.route.js";
import articleRoutes from "./articles.route.js";
import designCatalogRoutes from "./designCatalogs.route.js";
import trackRecordRoutes from "./trackRecords.route.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/design-catalogs", designCatalogRoutes);
app.use("/api/track-records", trackRecordRoutes);

export default app