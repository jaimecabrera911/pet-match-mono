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
          apellidos: user.apellidos
        }
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
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

  // Serve static files from the uploads directory
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}