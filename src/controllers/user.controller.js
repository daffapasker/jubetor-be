import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import bcrypt from "bcrypt";

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