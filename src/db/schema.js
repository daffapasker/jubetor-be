import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectStatusEnum, userRoleEnum } from "../utils/constan.js";

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

// 3. TABEL PROYEK (STATUS UTAMA)
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

export const progressLogsRelations = relations(progressLogs, ({ one }) => ({
  project: one(motorProjects, { fields: [progressLogs.projectId], references: [motorProjects.id] }),
}));