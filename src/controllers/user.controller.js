import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { motorProjects } from "../db/schema.js";


export const createUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phoneNumber: users.phoneNumber,
        role: users.role,
        createdAt: users.createdAt,
      });

    res.status(201).json({
      message: "User created successfully",
      data: result[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const getUsers = async (req, res) => {
  const data = await db.select().from(users);
  res.json(data);
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await db.select().from(users).where(eq(users.id, id));

  if (!user.length) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user[0]);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id));

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const projects = await db
    .select()
    .from(motorProjects)
    .where(eq(motorProjects.userId, id));

  if (projects.length > 0) {
    return res.status(400).json({
      message: "Cannot delete user because user still has projects. Please delete the projects first.",
    });
  }

  await db.delete(users).where(eq(users.id, id));

  res.json({
    message: "User deleted successfully",
  });
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, phoneNumber, role } = req.body;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id));

  if (!user.length) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const existingUser = user[0];

  const hashedPassword = password
    ? await bcrypt.hash(password, 10)
    : existingUser.password;

  const updatedUser = await db
    .update(users)
    .set({
      name: name || existingUser.name,
      email: email || existingUser.email,
      password: hashedPassword,
      phoneNumber: phoneNumber || existingUser.phoneNumber,
      role: role || existingUser.role,
    })
    .where(eq(users.id, id))
    .returning();

  res.json({
    message: "User updated successfully",
    data: updatedUser[0],
  });
};