import { db } from "../db/index.js";
import { designCatalogs } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { imagekit } from "../utils/imageKit.js";

export const createDesignCatalog = async (data, file) => {
  if (!file) throw new Error("Image is required");
  const upload = await imagekit.upload({
    file: file.buffer.toString("base64"),
    fileName: `design-${Date.now()}`,
  });

  const [newCatalog] = await db
    .insert(designCatalogs)
    .values({
      name: data.name,
      description: data.description,
      image: upload.url,
      isAvailable: data.isAvailable ?? "true",
    })
    .returning();
  return newCatalog;
};

export const getDesignCatalogs = async () => {
  return await db.query.designCatalogs.findMany();
};

export const getDesignCatalogById = async (id) => {
  const catalog = await db.query.designCatalogs.findFirst({
    where: eq(designCatalogs.id, id),
  });
  if (!catalog) throw new Error("Design catalog not found");
  return catalog;
};

export const updateDesignCatalog = async (id, data, file) => {
  const existing = await getDesignCatalogById(id);
  let imageUrl = existing.image;

  if (file) {
    const upload = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: `design-${id}-${Date.now()}`,
    });
    imageUrl = upload.url;
  }

  const [updated] = await db
    .update(designCatalogs)
    .set({
      name: data.name ?? existing.name,
      description: data.description ?? existing.description,
      image: imageUrl,
      isAvailable: data.isAvailable ?? existing.isAvailable,
    })
    .where(eq(designCatalogs.id, id))
    .returning();
  return updated;
};

export const deleteDesignCatalog = async (id) => {
  await getDesignCatalogById(id);
  await db.delete(designCatalogs).where(eq(designCatalogs.id, id));
  return { message: "Design catalog deleted" };
};