import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

import { verifyPassword } from "../utils/encryption.js";
import { generateAuthTokens } from "../utils/jwt.js";

const signInService = async (payload) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, payload.email)
  });

  if (!user) throw new Error("User not found");

  const isPasswordMatch = await verifyPassword(payload.password, user.password);
  if (!isPasswordMatch) throw new Error("email or password is incorrect");

  const { accessToken } = generateAuthTokens({ 
    _id: user.id, 
    role: user.user_role   // ⚠️ ini juga aku perbaiki
  });

  return { user, accessToken };
};

export { signInService };