import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const documentTypes = [
  "CEDULA DE CIUDADANIA",
  "PASAPORTE",
  "CEDULA DE EXTRANJERIA",
  "TARJETA DE IDENTIDAD"
] as const;

export const userRoles = ["USER", "ADMIN", "MODERADOR"] as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  tipoDocumento: text("tipo_documento", { enum: documentTypes }).notNull(),
  numeroDocumento: text("numero_documento").notNull(),
  nombres: text("nombres").notNull(),
  apellidos: text("apellidos").notNull(),
  genero: text("genero", { enum: ["M", "F", "O"] }).notNull(),
  fechaNacimiento: timestamp("fecha_nacimiento").notNull(),
  telefono: text("telefono").notNull(),
  direccion: text("direccion").notNull(),
  ciudad: text("ciudad").notNull(),
  ocupacion: text("ocupacion"),
  correo: text("correo").unique().notNull(),
  password: text("password").notNull(),
  rolNombre: text("rol_nombre", { enum: userRoles }).notNull().default("USER"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Schema types with zod validation
export const insertUserSchema = createInsertSchema(users, {
  tipoDocumento: z.enum(documentTypes),
  numeroDocumento: z.string().min(5, "Número de documento debe tener al menos 5 caracteres"),
  nombres: z.string().min(2, "Nombres debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Apellidos debe tener al menos 2 caracteres"),
  genero: z.enum(["M", "F", "O"], {
    required_error: "Género es requerido",
    invalid_type_error: "Género debe ser M, F u O",
  }),
  fechaNacimiento: z.coerce.date(),
  telefono: z.string().min(7, "Teléfono debe tener al menos 7 caracteres"),
  direccion: z.string().min(5, "Dirección debe tener al menos 5 caracteres"),
  ciudad: z.string().min(3, "Ciudad debe tener al menos 3 caracteres"),
  ocupacion: z.string().optional(),
  correo: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  rolNombre: z.enum(userRoles).default("USER"),
});

export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: text("age").notNull(),
  breed: text("breed").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  isAdopted: boolean("is_adopted").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adoptions = pgTable("adoptions", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull().default("pending"),
  applicationDate: timestamp("application_date").notNull().defaultNow(),
  notes: text("notes"),
});

export const adoptionsRelations = relations(adoptions, ({ one }) => ({
  pet: one(pets, {
    fields: [adoptions.petId],
    references: [pets.id],
  }),
  user: one(users, {
    fields: [adoptions.userId],
    references: [users.id],
  }),
}));

// Schema types
export const insertPetSchema = createInsertSchema(pets);
export const selectPetSchema = createSelectSchema(pets);
export type InsertPet = typeof pets.$inferInsert;
export type SelectPet = typeof pets.$inferSelect;

export const insertAdoptionSchema = createInsertSchema(adoptions);
export const selectAdoptionSchema = createSelectSchema(adoptions);
export type InsertAdoption = typeof adoptions.$inferInsert;
export type SelectAdoption = typeof adoptions.$inferSelect;