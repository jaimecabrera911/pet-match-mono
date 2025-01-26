import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  roleId: integer("role_id").references(() => roles.id).notNull(),
});

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: text("age").notNull(),
  breed: text("breed").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  isAdopted: boolean("is_adopted").default(false).notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertPetSchema = createInsertSchema(pets);
export const selectPetSchema = createSelectSchema(pets);
export type InsertPet = typeof pets.$inferInsert;
export type SelectPet = typeof pets.$inferSelect;

export const insertRoleSchema = createInsertSchema(roles);
export const selectRoleSchema = createSelectSchema(roles);
export type InsertRole = typeof roles.$inferInsert;
export type SelectRole = typeof roles.$inferSelect;