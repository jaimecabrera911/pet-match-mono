import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { pets, users, adoptions, type InsertPet, type InsertUser, type InsertAdoption, insertUserSchema } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Rutas para usuarios
  app.get("/api/users", async (_req, res) => {
    try {
      const allUsers = await db.select().from(users);
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      // Validar los datos de entrada usando el schema
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Datos de usuario inválidos",
          details: result.error.errors
        });
      }

      // Verificar si el correo ya existe
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.correo, result.data.correo))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({ error: "El correo electrónico ya está registrado" });
      }

      // Crear el nuevo usuario
      const [newUser] = await db.insert(users).values(result.data).returning();
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
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

  // Rutas para mascotas
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

  // Rutas para adopciones
  app.get("/api/adoptions", async (_req, res) => {
    try {
      const allAdoptions = await db
        .select({
          id: adoptions.id,
          status: adoptions.status,
          applicationDate: adoptions.applicationDate,
          notes: adoptions.notes,
          pet: {
            id: pets.id,
            name: pets.name,
            breed: pets.breed,
          },
          user: {
            id: users.id,
            username: users.username,
          },
        })
        .from(adoptions)
        .innerJoin(pets, eq(pets.id, adoptions.petId))
        .innerJoin(users, eq(users.id, adoptions.userId));
      res.json(allAdoptions);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las adopciones" });
    }
  });

  app.post("/api/adoptions", async (req, res) => {
    try {
      const [newAdoption] = await db
        .insert(adoptions)
        .values(req.body as InsertAdoption)
        .returning();
      res.json(newAdoption);
    } catch (error) {
      res.status(500).json({ error: "Error al crear la solicitud de adopción" });
    }
  });

  app.put("/api/adoptions/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [updatedAdoption] = await db
        .update(adoptions)
        .set(req.body)
        .where(eq(adoptions.id, parseInt(id)))
        .returning();
      if (!updatedAdoption) {
        return res.status(404).json({ error: "Solicitud de adopción no encontrada" });
      }

      // Si la adopción fue aprobada, actualizar el estado de la mascota
      if (req.body.status === "approved") {
        await db
          .update(pets)
          .set({ isAdopted: true })
          .where(eq(pets.id, updatedAdoption.petId));
      }

      res.json(updatedAdoption);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la solicitud de adopción" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}