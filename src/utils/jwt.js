import jwt from "jsonwebtoken";
import { env } from "./env.js";

const signToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateAuthTokens = (payload) => {
  if (!env.JWT_ACCESS_SECRET) {
    throw new Error("JWT Access Secret is not defined in environment variables");
  }

  const tokenPayload = {
    _id: payload._id,
    role: payload.role,
  };

  const accessToken = signToken(
    tokenPayload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN || "1d"
  );

  return { accessToken };
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
};