import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export const createUser = async (req, res) => {
  try {
    const result = await db.insert(users).values(req.body).returning();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  const data = await db.select().from(users);
  res.json(data);
};  