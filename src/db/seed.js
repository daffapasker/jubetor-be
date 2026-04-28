import { db } from "./index.js";
import { users } from "./schema.js";
import bcrypt from "bcrypt";

async function seed() {
  console.log("--- Memulai proses seeding JUBETOR ---");

  try {
    // 1. Kritik Keamanan: Selalu hash password sebelum masuk DB!
    const hashedPassword = await bcrypt.hash("admin123", 10);

    console.log("Sedang mendaftarkan Admin...");

    await db.insert(users).values([
      {
        name: "Admin Utama JUBETOR",
        email: "admin@jubetor.com",
        password: hashedPassword,
        phoneNumber: "08123456789",
        role: "admin",
      },
      {
        name: "Allaya Daffa Zhillal", // Akun Owner kamu
        email: "owner@jubetor.com",
        password: hashedPassword,
        phoneNumber: "08987654321",
        role: "owner",
      }
    ]);

    console.log("--- Seeding BERHASIL: Admin & Owner siap digunakan ---");
    process.exit(0);
  } catch (error) {
    console.error("--- Seeding GAGAL ---");
    console.error(error);
    process.exit(1);
  }
}

seed();