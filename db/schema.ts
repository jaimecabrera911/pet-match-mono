import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(), // Array of options
  category: text("category").notNull(), // e.g., "lifestyle", "environment", "experience"
  weight: integer("weight").notNull().default(1),
});

export const petProfiles = pgTable("pet_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: text("age").notNull(),
  breed: text("breed").notNull(),
  personalityTraits: jsonb("personality_traits").notNull(), // e.g., ["active", "friendly", "independent"]
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  answers: jsonb("answers").notNull(), // Store user's answers
  matchedPetIds: jsonb("matched_pet_ids").notNull(), // Array of matched pet IDs
  createdAt: text("created_at").notNull(),
});

// Export schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions);
export const selectQuizQuestionSchema = createSelectSchema(quizQuestions);
export const insertPetProfileSchema = createInsertSchema(petProfiles);
export const selectPetProfileSchema = createSelectSchema(petProfiles);
export const insertQuizResultSchema = createInsertSchema(quizResults);
export const selectQuizResultSchema = createSelectSchema(quizResults);

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;
export type SelectQuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertPetProfile = typeof petProfiles.$inferInsert;
export type SelectPetProfile = typeof petProfiles.$inferSelect;
export type InsertQuizResult = typeof quizResults.$inferInsert;
export type SelectQuizResult = typeof quizResults.$inferSelect;