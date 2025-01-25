import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { 
  quizQuestions, 
  petProfiles, 
  quizResults 
} from "@db/schema";
import { eq, and, inArray } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Quiz endpoints
  app.get("/api/quiz/questions", async (_req, res) => {
    try {
      const questions = await db.query.quizQuestions.findMany({
        orderBy: (questions, { asc }) => [asc(questions.id)]
      });
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las preguntas del cuestionario" });
    }
  });

  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const { userId, answers } = req.body;

      // Algoritmo simple de coincidencia basado en las respuestas
      const pets = await db.query.petProfiles.findMany();

      // Filtrar mascotas basado en las respuestas
      const matchedPetIds = pets
        .filter(pet => {
          // Aquí implementaremos la lógica de coincidencia
          // Por ahora, retornamos todos como coincidencia
          return true;
        })
        .map(pet => pet.id);

      // Guardar resultados
      const result = await db.insert(quizResults).values({
        userId,
        answers,
        matchedPetIds,
        createdAt: new Date().toISOString(),
      }).returning();

      res.json({
        quizResult: result[0],
        matchedPets: pets.filter(pet => matchedPetIds.includes(pet.id))
      });
    } catch (error) {
      res.status(500).json({ message: "Error al procesar las respuestas del cuestionario" });
    }
  });

  app.get("/api/quiz/results/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const results = await db.query.quizResults.findFirst({
        where: eq(quizResults.userId, parseInt(userId)),
        orderBy: (results, { desc }) => [desc(results.createdAt)]
      });

      if (!results) {
        return res.status(404).json({ message: "No se encontraron resultados" });
      }

      const matchedPets = await db.query.petProfiles.findMany({
        where: (pets, { inArray }) => 
          inArray(pets.id, results.matchedPetIds as number[])
      });

      res.json({ results, matchedPets });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los resultados del cuestionario" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}