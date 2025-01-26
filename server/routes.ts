import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { pets, users, type InsertPet, type InsertUser } from "@db/schema";
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

  // Rutas para usuarios
  app.get("/api/users", async (_req, res) => {
    try {
      const allUsers = await db.select().from(users);
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const [newUser] = await db.insert(users).values(req.body as InsertUser).returning();
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [updatedUser] = await db
        .update(users)
        .set(req.body)
        .where(eq(users.id, parseInt(id)))
        .returning();
      if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, parseInt(id)))
        .returning();
      if (!deletedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}