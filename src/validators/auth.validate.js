
// Impor role dari konstanta agar jika nanti berubah, validator otomatis ikut berubah
import z from "zod";
import { userRoleEnum } from "../utils/constan.js"; 


export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password must be field" }),
});

