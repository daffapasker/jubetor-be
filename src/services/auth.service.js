// TAMBAHKAN IMPORT INI
import { db } from "../db/index.js"; // Sesuaikan path ke file konfigurasi DB kamu
import { users } from "../db/schema.js"; // Sesuaikan path ke file schema kamu
import { eq } from "drizzle-orm"; // Wajib untuk fungsi query 'eq'


import { verifyPassword } from "../utils/encryption.js";
import { generateAuthTokens } from "../utils/jwt.js";

const signInService = async (payload) => {
    const user = await db.query.users.findFirst({
    where: eq(users.email, payload.email)
});

    if (!user) throw new Error("User not found");

    // KRITIK: verifyPassword butuh password dari DB untuk dibandingkan!
    // Kamu harus memasukkan user.password sebagai argumen kedua
    const isPasswordMatch = await verifyPassword(payload.password, user.password);
    if (!isPasswordMatch) throw new Error("email or password is incorrect");

    const { accessToken } = generateAuthTokens({ 
        _id: user.id, 
        role: user.role 
    });

    return { user, accessToken };
}

export { signInService };