import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  point,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { number, z } from "zod";

export const documentTypes = [
  "CEDULA DE CIUDADANIA",
  "PASAPORTE",
  "CEDULA DE EXTRANJERIA",
  "TARJETA DE IDENTIDAD",
] as const;

export const userRoles = ["adoptante", "admin"] as const;
export const petSizes = ["pequeño", "mediano", "grande"] as const;

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
  departamento: text("departamento").notNull(),
  ocupacion: text("ocupacion"),
  correo: text("correo").unique().notNull(),
  password: text("password").notNull(),
  rolNombre: text("rol_nombre", { enum: userRoles }).notNull().default("adoptante"),
});

export const usersRelation = relations(users, ({ many }) => ({
  questionaries: many(questionaries)
}));

export const insertUserSchema = createInsertSchema(users, {
  tipoDocumento: z.enum(documentTypes),
  numeroDocumento: z
    .string()
    .min(5, "Número de documento debe tener al menos 5 caracteres"),
  nombres: z.string().min(2, "Nombres debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Apellidos debe tener al menos 2 caracteres"),
  genero: z
    .enum(["M", "F", "O"], {
      required_error: "Género es requerido",
      invalid_type_error: "Género debe ser M, F u O",
    })
    .default("M"),
  fechaNacimiento: z.coerce.date(),
  telefono: z.string().min(7, "Teléfono debe tener al menos 7 caracteres"),
  direccion: z.string().min(5, "Dirección debe tener al menos 5 caracteres"),
  ciudad: z.string().min(3, "Ciudad debe tener al menos 3 caracteres"),
  departamento: z
    .string()
    .min(3, "Departamento debe tener al menos 3 caracteres"),
  ocupacion: z.string().optional(),
  correo: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
  rolNombre: z.enum(userRoles).default("adoptante"),
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
  gender: text("gender", { enum: ["macho", "hembra"] }).notNull(),
  size: text("size", { enum: petSizes }).notNull().default("mediano"),
  requirements: text("requirements").array().notNull(),
  healthStatus: text("health_status").array().notNull(),
  personality: text("personality").array().notNull(),
});

export const insertPetSchema = createInsertSchema(pets, {
  requirements: z
    .array(z.string())
    .min(1, "Debe especificar al menos un requisito"),
  healthStatus: z
    .array(z.string())
    .min(1, "Debe especificar al menos un estado de salud"),
  personality: z
    .array(z.string())
    .min(1, "Debe especificar al menos un rasgo de personalidad"),
  gender: z.enum(["macho", "hembra"], {
    required_error: "El género es requerido",
    invalid_type_error: "El género debe ser macho o hembra",
  }),
  size: z
    .enum(petSizes, {
      required_error: "El tamaño es requerido",
      invalid_type_error: "El tamaño debe ser pequeño, mediano o grande",
    })
    .default("mediano"),
});

export const selectPetSchema = createSelectSchema(pets);
export type InsertPet = typeof pets.$inferInsert;
export type SelectPet = typeof pets.$inferSelect;

export const adoptions = pgTable("adoptions", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id")
    .references(() => pets.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
  applicationDate: timestamp("application_date").notNull().defaultNow(),
  notes: text("notes"),
  aprobada: boolean("aprobada").default(false).notNull(),
  estadoDecision: text("estado_decision", { enum: ["aprobada", "rechazada"] }).notNull().default("rechazada"),
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

export const insertAdoptionSchema = createInsertSchema(adoptions);
export const selectAdoptionSchema = createSelectSchema(adoptions);
export type InsertAdoption = typeof adoptions.$inferInsert;
export type SelectAdoption = typeof adoptions.$inferSelect;


export const questionaries = pgTable("questionaries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  status: text("status").notNull().default("pending"),
  applicationDate: timestamp("application_date").notNull().defaultNow(),
  notes: text("notes"),
  points: integer("points").notNull().default(0),
  experienciaMascotas: text("experiencia_mascotas").notNull(),
  tipoVivienda: text("tipo_vivienda").notNull(),
  cuidadoExtraTiempo: text("cuidado_extra_tiempo").notNull(),
  otrasMascotas: text("otras_mascotas").notNull(),
  adaptacionNuevaVivienda: text("adaptacion_nueva_vivienda").notNull(),
  problemasComportamiento: text("problemas_comportamiento").notNull(),
  presupuestoMensual: text("presupuesto_mensual").notNull(),
  compromisoLargoPlazo: text("compromiso_largo_plazo").notNull(),
  atencionVeterinaria: text("atencion_veterinaria").notNull(),
  reaccionDanos: text("reaccion_danos").notNull(),
})

export const questionariesRelation = relations(questionaries, ({ one }) => ({
  user: one(users, {
    fields: [questionaries.userId],
    references: [users.id],
  }),
}));

export const insertQuestionarySchema = createInsertSchema(questionaries);
export const selectQuestionarySchema = createSelectSchema(questionaries);
export type InsertQuestionary = typeof questionaries.$inferInsert;
export type SelectQuestionary = typeof questionaries.$inferSelect;
