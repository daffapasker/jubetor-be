import { db } from "../db/index.js";
import { motorProjects } from "../db/schema.js";
import { updateProjectStatus } from "../services/project.service.js";
import { count, eq, desc } from "drizzle-orm";


export const createProject = async (req, res) => {

  try {

    const result = await db.insert(motorProjects).values(req.body).returning();

    res.json(result);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

}

export const getProjects = async (req, res) => {
  try {
    // 1. Ambil query parameter dengan default value
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 2. Ambil data dengan limit, offset, dan urutan terbaru (desc)
    const data = await db.query.motorProjects.findMany({
      limit: limit,
      offset: offset,
      orderBy: [desc(motorProjects.createdAt)],
      with: {
        user: {
          columns: {
            name: true,
            email: true
          }
        }
      }
    });

    // 3. Hitung total data untuk keperluan metadata di Frontend
    const [totalUsage] = await db.select({ value: count() }).from(motorProjects);
    const totalItems = totalUsage.value;
    const totalPages = Math.ceil(totalItems / limit);

    // 4. Response yang informatif (sangat disukai penguji skripsi)
    res.json({
      message: "Projects retrieved successfully",
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalItems,
        totalPages: totalPages
      },
      data: data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const getProjects = async (req, res) => {
//   const data = await db.select().from(motorProjects);
//   res.json(data);
// };

export const updateStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, notes } = req.body;

    const result = await updateProjectStatus(
      projectId,
      status,
      notes,
      req.file // ← ambil dari multer
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// ... (fungsi createProject, getProjects, dan updateStatus yang sudah ada)

export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Menggunakan relational query agar data log dan user pemilik ikut terbawa
    const data = await db.query.motorProjects.findFirst({
      where: eq(motorProjects.id, projectId),
      with: {
        user: true, // Mengambil data pemilik motor
        logs: true, // Mengambil semua sejarah progres motor ini
      },
    });

    if (!data) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Pastikan project-nya ada sebelum dihapus
    const result = await db
      .delete(motorProjects)
      .where(eq(motorProjects.id, projectId))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project and its history deleted successfully", deleted: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};