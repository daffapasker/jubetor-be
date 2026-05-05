import { ApiResponse } from "../utils/response.js";
import { signInService } from "../services/auth.service.js";

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
      .json(new ApiResponse("Log in Successfully", { user, token: accessToken }));
  }
};