import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { pets, users, adoptions, type InsertPet, type InsertUser, type InsertAdoption, insertUserSchema } from "@db/schema";
import { eq } from "drizzle-orm";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import express from 'express';

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (_req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

export function registerRoutes(app: Express): Server {
  // Rutas de autenticación básica
  app.post("/api/login", async (req, res) => {
    try {
      const { correo, password } = req.body;
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.correo, correo))
        .limit(1);

      if (!user) {
        return res.status(401).json({ error: "Usuario no encontrado" });
      }

      if (password !== user.password) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      res.json({
        message: "Inicio de sesión exitoso",
        user: {
          id: user.id,
          correo: user.correo,
          nombres: user.nombres,
          apellidos: user.apellidos,
          role: user.rolNombre.toLowerCase() // Convertimos ADMIN/USER a admin/user
        }
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  // Ruta para obtener el usuario actual
  app.get("/api/user", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    res.json({
      id: user.id,
      correo: user.correo,
      nombres: user.nombres,
      apellidos: user.apellidos,
      role: user.rolNombre.toLowerCase() // Convertimos ADMIN/USER a admin/user
    });
  });

  app.post("/api/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Datos de usuario inválidos",
          details: result.error.errors 
        });
      }

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.correo, result.data.correo))
        .limit(1);

      if (existingUser) {
        return res.status(400).json({ error: "El correo electrónico ya está registrado" });
      }

      const [newUser] = await db
        .insert(users)
        .values(result.data)
        .returning();

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        user: {
          id: newUser.id,
          correo: newUser.correo,
          nombres: newUser.nombres,
          apellidos: newUser.apellidos
        }
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  });

  // Ruta para obtener usuarios
  app.get("/api/users", async (_req, res) => {
    try {
      const allUsers = await db.select().from(users);
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  });

  // Rutas existentes
  app.get("/api/pets", async (_req, res) => {
    try {
      const allPets = await db.select().from(pets);
      res.json(allPets);
    } catch (error) {
      console.error("Error fetching pets:", error);
      res.status(500).json({ error: "Error al obtener las mascotas" });
    }
  });

  app.get("/api/adoptions/user", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
      }

      const userAdoptions = await db
        .select({
          id: adoptions.id,
          status: adoptions.status,
          applicationDate: adoptions.applicationDate,
          notes: adoptions.notes,
          aprobada: adoptions.aprobada,
          estadoDecision: adoptions.estadoDecision,
          pet: {
            id: pets.id,
            name: pets.name,
            breed: pets.breed,
            imageUrl: pets.imageUrl
          },
          user: {
            id: users.id,
            nombres: users.nombres,
            apellidos: users.apellidos,
            correo: users.correo
          },
        })
        .from(adoptions)
        .where(eq(adoptions.userId, req.user.id))
        .innerJoin(pets, eq(pets.id, adoptions.petId))
        .innerJoin(users, eq(users.id, adoptions.userId));

      res.json(userAdoptions);
    } catch (error) {
      console.error("Error fetching user adoptions:", error);
      res.status(500).json({ error: "Error al obtener las adopciones del usuario" });
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
            imageUrl: pets.imageUrl
          },
          user: {
            id: users.id,
            nombres: users.nombres,
            apellidos: users.apellidos,
            correo: users.correo
          },
        })
        .from(adoptions)
        .innerJoin(pets, eq(pets.id, adoptions.petId))
        .innerJoin(users, eq(users.id, adoptions.userId));
      res.json(allAdoptions);
    } catch (error) {
      console.error("Error fetching adoptions:", error);
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
      console.error("Error creating adoption:", error);
      res.status(500).json({ error: "Error al crear la solicitud de adopción" });
    }
  });

  app.get("/api/adoptions/:id", async (req, res) => {
    try {
      const adoptionId = parseInt(req.params.id);

      const [adoption] = await db
        .select({
          id: adoptions.id,
          status: adoptions.status,
          applicationDate: adoptions.applicationDate,
          notes: adoptions.notes,
          pet: {
            id: pets.id,
            name: pets.name,
            breed: pets.breed,
            imageUrl: pets.imageUrl
          },
          user: {
            id: users.id,
            nombres: users.nombres,
            apellidos: users.apellidos,
            correo: users.correo
          },
        })
        .from(adoptions)
        .where(eq(adoptions.id, adoptionId))
        .innerJoin(pets, eq(pets.id, adoptions.petId))
        .innerJoin(users, eq(users.id, adoptions.userId))
        .limit(1);

      if (!adoption) {
        return res.status(404).json({ error: "Adopción no encontrada" });
      }

      res.json(adoption);
    } catch (error) {
      console.error("Error fetching adoption:", error);
      res.status(500).json({ error: "Error al obtener la adopción" });
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
      console.error("Error updating adoption:", error);
      res.status(500).json({ error: "Error al actualizar la solicitud de adopción" });
    }
  });
  
  app.post("/api/pets", upload.single('image'), async (req, res) => {
    try {
      const petData = {
        name: req.body.name,
        age: req.body.age,
        breed: req.body.breed,
        location: req.body.location,
        requirements: JSON.parse(req.body.requirements),
        healthStatus: JSON.parse(req.body.healthStatus),
        personality: JSON.parse(req.body.personality),
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        isAdopted: false
      };

      const [newPet] = await db
        .insert(pets)
        .values(petData)
        .returning();

      res.json(newPet);
    } catch (error) {
      console.error("Error creating pet:", error);
      res.status(500).json({ error: "Error al crear la mascota" });
    }
  });

  // Add PUT endpoint for updating pets
  app.put("/api/pets/:id", upload.single('image'), async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const updateData: any = {
        name: req.body.name,
        age: req.body.age,
        breed: req.body.breed,
        location: req.body.location,
        requirements: JSON.parse(req.body.requirements),
        healthStatus: JSON.parse(req.body.healthStatus),
        personality: JSON.parse(req.body.personality),
      };

      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const [updatedPet] = await db
        .update(pets)
        .set(updateData)
        .where(eq(pets.id, petId))
        .returning();

      if (!updatedPet) {
        return res.status(404).json({ error: "Mascota no encontrada" });
      }

      res.json(updatedPet);
    } catch (error) {
      console.error("Error updating pet:", error);
      res.status(500).json({ error: "Error al actualizar la mascota" });
    }
  });

  // Add DELETE endpoint for removing pets
  app.delete("/api/pets/:id", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const [deletedPet] = await db
        .delete(pets)
        .where(eq(pets.id, petId))
        .returning();

      if (!deletedPet) {
        return res.status(404).json({ error: "Mascota no encontrada" });
      }

      res.json({ message: "Mascota eliminada correctamente" });
    } catch (error) {
      console.error("Error deleting pet:", error);
      res.status(500).json({ error: "Error al eliminar la mascota" });
    }
  });

  // Serve static files from the uploads directory
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}