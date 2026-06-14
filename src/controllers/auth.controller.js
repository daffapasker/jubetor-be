import { ApiResponse } from "../utils/response.js";
import { signInService } from "../services/auth.service.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export default {
  async signIn(req, res) {
    const { user, accessToken } = await signInService(req.body);

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json(
        new ApiResponse("Log in Successfully", { user, token: accessToken }),
      );
  },
  async getProfile(req, res) {
    try {
      const profile = await db.query.users.findFirst({
        where: eq(users.id, req.user.id),
        columns: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          role: true,
          createdAt: true,
        },
      });

      if (!profile) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res
        .status(200)
        .json(new ApiResponse("Profile retrieved successfully", profile));
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
};
