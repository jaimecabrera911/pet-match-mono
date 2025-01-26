import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { pets, type InsertPet } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Rutas para mascotas sin autenticación
  app.get("/api/pets", async (_req, res) => {
    try {
      const allPets = await db.select().from(pets);
      res.json(allPets);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las mascotas" });
    }
  });

  app.post("/api/pets", async (req, res) => {
    try {
      const [newPet] = await db.insert(pets).values(req.body as InsertPet).returning();
      res.json(newPet);
    } catch (error) {
      res.status(500).json({ error: "Error al crear la mascota" });
    }
  });

  app.put("/api/pets/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [updatedPet] = await db
        .update(pets)
        .set(req.body)
        .where(eq(pets.id, parseInt(id)))
        .returning();
      if (!updatedPet) {
        return res.status(404).json({ error: "Mascota no encontrada" });
      }
      res.json(updatedPet);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la mascota" });
    }
  });

  app.delete("/api/pets/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [deletedPet] = await db
        .delete(pets)
        .where(eq(pets.id, parseInt(id)))
        .returning();
      if (!deletedPet) {
        return res.status(404).json({ error: "Mascota no encontrada" });
      }
      res.json({ message: "Mascota eliminada exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la mascota" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}