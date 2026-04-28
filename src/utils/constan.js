import { pgEnum } from "drizzle-orm/pg-core";

// 1. ENUM STATUS (Lokasi/Proses Motor)
export const projectStatusEnum = pgEnum("project_status", [
  'QUEUE',      // Antrean
  'STRIPPING',  // Bongkar
  'ENGINE',     // Mesin
  'PAINTING',   // Cat
  'ASSEMBLY',   // Rakit
  'DONE',       // Selesai
  'CANCELED'    // Batal
]);

export const userRoleEnum = pgEnum("user_role", ["client", "admin", "owner"]);