import { verifyAccessToken } from "../utils/jwt.js";

const authorization = async (req, res, next) => {
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