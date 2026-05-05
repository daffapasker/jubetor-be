import { verifyAccessToken } from "../utils/jwt.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const allowRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, req.user.id),
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }


      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }

      req.user.role = user.role;

      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};

export const authorization = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  const userData = verifyAccessToken(token);

  if (!userData) {
    return res.status(401).json({ message: "Invalid token payload" });
  }

  req.user = {
    id: userData._id,
    role: userData.role,
  };

  next();
};


