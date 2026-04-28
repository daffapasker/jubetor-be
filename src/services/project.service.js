import { db } from "../db/index.js";
import { motorProjects, progressLogs } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { imagekit } from "../utils/imageKit.js";

const allowedTransitions = {
  QUEUE: ["STRIPPING"],
  STRIPPING: ["ENGINE"],
  ENGINE: ["PAINTING"],
  PAINTING: ["ASSEMBLY"],
  ASSEMBLY: ["DONE"],
  DONE: [],
};

export const updateProjectStatus = async (
  projectId,
  newStatus,
  notes,
  file // ← ganti image jadi file
) => {
  return await db.transaction(async (tx) => {
    const project = await tx.query.motorProjects.findFirst({
      where: eq(motorProjects.id, projectId),
    });

    if (!project) throw new Error("Project not found");

    const currentStatus = project.status;

    if (currentStatus === "DONE") {
      throw new Error("Proyek sudah selesai, status tidak dapat diubah lagi.");
    }

    const isCancelling = newStatus === "CANCELED";
    const isLegalTransition =
      allowedTransitions[currentStatus]?.includes(newStatus);

    if (!isLegalTransition && !isCancelling) {
      throw new Error(
        `Transisi ilegal dari ${currentStatus} ke ${newStatus}`
      );
    }

    // =========================
    // UPLOAD IMAGE (jika ada)
    // =========================
    let imageUrl = "";

    if (file) {
      const uploadResponse = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: `project-${projectId}-${Date.now()}`,
      });

      imageUrl = uploadResponse.url;
    }

    // =========================
    // UPDATE PROJECT
    // =========================
    await tx
      .update(motorProjects)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(motorProjects.id, projectId));

    // =========================
    // INSERT LOG
    // =========================
    await tx.insert(progressLogs).values({
      projectId,
      statusName: newStatus,
      notes:
        notes ||
        (isCancelling ? "Proyek dibatalkan oleh admin/owner" : ""),
      image: imageUrl,
    });

    return { message: `Status diperbarui menjadi ${newStatus}` };
  });
};