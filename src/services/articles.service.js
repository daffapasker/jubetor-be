import { db } from "../db/index.js";
import { articles } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { imagekit } from "../utils/imageKit.js";

export const createArticle = async (data, file) => {
  let thumbnailUrl = null;
  if (file) {
    const upload = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: `article-${Date.now()}`,
    });
    thumbnailUrl = upload.url;
  }

  const [newArticle] = await db
    .insert(articles)
    .values({
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      thumbnail: thumbnailUrl,
    })
    .returning();
  return newArticle;
};

export const getArticles = async () => {
  return await db.query.articles.findMany();
};

export const getArticleById = async (id) => {
  const article = await db.query.articles.findFirst({
    where: eq(articles.id, id),
  });
  if (!article) throw new Error("Article not found");
  return article;
};

export const updateArticle = async (id, data, file) => {
  const existing = await getArticleById(id);
  let thumbnailUrl = existing.thumbnail;

  if (file) {
    const upload = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: `article-${id}-${Date.now()}`,
    });
    thumbnailUrl = upload.url;
  }

  const [updated] = await db
    .update(articles)
    .set({
      title: data.title ?? existing.title,
      content: data.content ?? existing.content,
      thumbnail: thumbnailUrl,
    })
    .where(eq(articles.id, id))
    .returning();
  return updated;
};

export const deleteArticle = async (id) => {
  await getArticleById(id);
  await db.delete(articles).where(eq(articles.id, id));
  return { message: "Article deleted" };
};