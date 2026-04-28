import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import dotenv from "dotenv";
import * as schema from "./schema.js";

dotenv.config();

const { Pool } = pkg;

// Tambahkan logika pengecekan agar aplikasi tidak crash tanpa pesan jelas
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL tidak ditemukan di file .env");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // TAMBAHKAN INI: Agar koneksi ke Neon/Cloud DB stabil
  ssl: {
    rejectUnauthorized: false, // Diperlukan untuk penyedia cloud seperti Neon/Render
  },
});

export const db = drizzle(pool, { schema });