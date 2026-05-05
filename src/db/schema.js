import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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

export const userRoleEnum = pgEnum("user_role", ["client", "admin"]);

// 2. TABEL PENGGUNA
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  role: userRoleEnum("user_role").default("client").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. TABEL PROYEK (STATUS UTAMA)A
export const motorProjects = pgTable("motor_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  
  motorModel: text("motor_model").notNull(),
  licensePlate: varchar("license_plate", { length: 20 }),
  engineNumber: varchar("engine_number", { length: 50 }),

  // Status ini adalah "pointer" ke lokasi motor saat ini
  status: projectStatusEnum("status").default("QUEUE").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. TABEL LOG (HISTORI & DURASI)
export const progressLogs = pgTable("progress_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => motorProjects.id, { onDelete: "cascade" }),
  
  // Mencatat status apa yang sedang/sudah dikerjakan di baris ini
  statusName: projectStatusEnum("status_name").notNull(),
  
  // Logika Durasi
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"), // NULL jika masih berjalan
  
  // Alasan jika terjadi lompatan atau regresi (sangat penting untuk penelitian)
  notes: text("notes"), 
  image: text("image"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. RELASI (Drizzle Core)
export const motorProjectsRelations = relations(motorProjects, ({ one, many }) => ({
  user: one(users, { fields: [motorProjects.userId], references: [users.id] }),
  logs: many(progressLogs),
}));


// 6. ARTICLES (BLOG / EDUKASI)
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  thumbnail: text("thumbnail"),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});



// 7. DESIGN CATALOG (KATALOG CUSTOM)
export const designCatalogs = pgTable("design_catalogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  isAvailable: text("is_available").default("true"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});



// 8. TRACK RECORD (PORTFOLIO)
export const trackRecords = pgTable("track_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),

  beforeImage: text("before_image"),
  afterImage: text("after_image"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const progressLogsRelations = relations(progressLogs, ({ one }) => ({
  project: one(motorProjects, { fields: [progressLogs.projectId], references: [motorProjects.id] }),
}));