import { db } from "../db/index.js";
import { trackRecords } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { imagekit } from "../utils/imageKit.js";

export const createTrackRecord = async (data, files) => {
  let beforeUrl = null;
  let afterUrl = null;

  if (files?.beforeImage) {
    const upload = await imagekit.upload({
      file: files.beforeImage[0].buffer.toString("base64"),
      fileName: `track-before-${Date.now()}`,
    });
    beforeUrl = upload.url;
  }
  if (files?.afterImage) {
    const upload = await imagekit.upload({
      file: files.afterImage[0].buffer.toString("base64"),
      fileName: `track-after-${Date.now()}`,
    });
    afterUrl = upload.url;
  }

  const [newRecord] = await db
    .insert(trackRecords)
    .values({
      title: data.title,
      description: data.description,
      beforeImage: beforeUrl,
      afterImage: afterUrl,
    })
    .returning();
  return newRecord;
};

export const getTrackRecords = async () => {
  return await db.query.trackRecords.findMany();
};

export const getTrackRecordById = async (id) => {
  const record = await db.query.trackRecords.findFirst({
    where: eq(trackRecords.id, id),
  });
  if (!record) throw new Error("Track record not found");
  return record;
};

export const updateTrackRecord = async (id, data, files) => {
  const existing = await getTrackRecordById(id);
  let beforeUrl = existing.beforeImage;
  let afterUrl = existing.afterImage;

  if (files?.beforeImage) {
    const upload = await imagekit.upload({
      file: files.beforeImage[0].buffer.toString("base64"),
      fileName: `track-before-${id}-${Date.now()}`,
    });
    beforeUrl = upload.url;
  }
  if (files?.afterImage) {
    const upload = await imagekit.upload({
      file: files.afterImage[0].buffer.toString("base64"),
      fileName: `track-after-${id}-${Date.now()}`,
    });
    afterUrl = upload.url;
  }

  const [updated] = await db
    .update(trackRecords)
    .set({
      title: data.title ?? existing.title,
      description: data.description ?? existing.description,
      beforeImage: beforeUrl,
      afterImage: afterUrl,
    })
    .where(eq(trackRecords.id, id))
    .returning();
  return updated;
};

export const deleteTrackRecord = async (id) => {
  await getTrackRecordById(id);
  await db.delete(trackRecords).where(eq(trackRecords.id, id));
  return { message: "Track record deleted" };
};